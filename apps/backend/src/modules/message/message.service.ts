import { ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ChannelType } from "@prisma/client";
import { randomUUID } from "crypto";
import { PrismaService } from "../../database/prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageGateway } from "./message.gateway";

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly messageGateway: MessageGateway,
    private readonly notificationsService: NotificationsService,
  ) {}

  async list(workspaceRef: string, channelRef: string, userId: string) {
    const channel = await this.resolveChannel(workspaceRef, channelRef);
    await this.requireChannelAccess(channel.id, channel.workspaceId, channel.type, userId);

    const messages = await this.prisma.message.findMany({
      where: { channelId: channel.id },
      orderBy: { createdAt: "asc" },
      include: {
        User: true,
      },
    });

    return messages.map((message) => this.toView(message));
  }

  async create(workspaceRef: string, channelRef: string, userId: string, dto: CreateMessageDto) {
    const channel = await this.resolveChannel(workspaceRef, channelRef);
    await this.requireChannelAccess(channel.id, channel.workspaceId, channel.type, userId);

    const now = new Date();
    const message = await this.prisma.message.create({
      data: {
        id: randomUUID(),
        channelId: channel.id,
        userId,
        content: dto.content.trim(),
        updatedAt: now,
      },
      include: {
        User: true,
      },
    });

    await this.handleMentions(channel.workspaceId, channel.id, message.id, userId, message.content);

    const view = this.toView(message);
    this.messageGateway.emitMessageCreated(channel.workspaceId, channel.id, view);
    return view;
  }

  private async resolveChannel(workspaceRef: string, channelRef: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        OR: [{ id: workspaceRef }, { slug: workspaceRef }],
      },
      select: { id: true },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    const normalizedChannel = channelRef.toLowerCase().trim();
    const channel = await this.prisma.channel.findFirst({
      where: {
        workspaceId: workspace.id,
        OR: [{ id: channelRef }, { name: normalizedChannel }],
      },
      select: { id: true, name: true, workspaceId: true, type: true },
    });

    if (!channel) {
      throw new NotFoundException("Channel not found");
    }

    return channel;
  }

  private async requireChannelAccess(
    channelId: string,
    workspaceId: string,
    channelType: ChannelType,
    userId: string,
  ) {
    const workspaceMember = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!workspaceMember) {
      throw new ForbiddenException("You are not a member of this workspace");
    }

    if (channelType === ChannelType.PUBLIC) {
      return;
    }

    const member = await this.prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException("You are not a member of this channel");
    }
  }

  private async handleMentions(
    workspaceId: string,
    channelId: string,
    messageId: string,
    authorId: string,
    content: string,
  ) {
    const mentionKeys = this.extractMentionKeys(content);
    if (!mentionKeys.length) {
      return;
    }
    this.logger.debug(
      `Processing mentions in workspace=${workspaceId}, channel=${channelId}, message=${messageId}`,
    );

    const members = await this.prisma.workspaceMember.findMany({
      where: {
        workspaceId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            name: true,
          },
        },
      },
    });

    const keyToUserId = new Map<string, string>();
    for (const member of members) {
      const candidates = this.mentionCandidates(member.user);
      for (const candidate of candidates) {
        if (!keyToUserId.has(candidate)) {
          keyToUserId.set(candidate, member.user.id);
        }
      }
    }

    const records: Array<{ mentionKey: string; mentionedUserId: string | null }> = [];
    const notifyUserIds = new Set<string>();

    for (const key of mentionKeys) {
      if (key === "channel") {
        for (const member of members) {
          if (member.userId !== authorId) {
            notifyUserIds.add(member.userId);
            records.push({ mentionKey: key, mentionedUserId: member.userId });
          }
        }
        continue;
      }

      const mentionedUserId = keyToUserId.get(key) ?? null;
      records.push({ mentionKey: key, mentionedUserId });
      if (mentionedUserId && mentionedUserId !== authorId) {
        notifyUserIds.add(mentionedUserId);
      }
    }

    if (records.length) {
      await this.prisma.$transaction(
        records.map((record) =>
          this.prisma.messageMention.create({
            data: {
              id: randomUUID(),
              messageId,
              workspaceId,
              channelId,
              mentionKey: record.mentionKey,
              mentionedById: authorId,
              mentionedUserId: record.mentionedUserId,
            },
          }),
        ),
      );
    }

    if (notifyUserIds.size) {
      const preview = content.length > 280 ? `${content.slice(0, 277)}...` : content;
      await this.notificationsService.createMentionNotifications(
        [...notifyUserIds].map((userId) => ({
          userId,
          workspaceId,
          channelId,
          messageId,
          mentionKey: "mention",
          preview,
        })),
      );
    }
  }

  private extractMentionKeys(content: string): string[] {
    const matches = [...content.matchAll(/(^|\s)@([a-zA-Z0-9._-]{2,64})/g)];
    const keys = matches.map((item) => item[2]?.toLowerCase().trim()).filter(Boolean) as string[];
    return [...new Set(keys)];
  }

  private mentionCandidates(user: { email: string; fullName: string | null; name: string | null }) {
    const fromEmail = user.email.split("@")[0]?.toLowerCase().trim();
    const fromName = (user.fullName || user.name || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");

    return [fromEmail, fromName].filter(Boolean);
  }

  private toView(message: {
    id: string;
    content: string;
    createdAt: Date;
    User: {
      email: string;
      fullName: string | null;
      name: string | null;
    };
  }) {
    const authorName =
      message.User.fullName || message.User.name || message.User.email.split("@")[0] || "User";

    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      author: {
        name: authorName,
        email: message.User.email,
      },
    };
  }
}
