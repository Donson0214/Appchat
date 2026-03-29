import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ChannelType } from "@prisma/client";
import { randomUUID } from "crypto";
import { PrismaService } from "../../database/prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageGateway } from "./message.gateway";

type MentionToken = {
  mentionKey: string;
  start: number;
  end: number;
};

type MentionCandidate = {
  id: string;
  displayName: string;
  handle: string;
  avatarUrl: string | null;
  emailSnippet: string;
};

type MentionResolution = {
  resolved: Array<{
    mentionKey: string;
    userId: string | null;
    displayName: string;
    start: number;
    end: number;
  }>;
  unresolved: Array<{
    mentionKey: string;
    start: number;
    end: number;
  }>;
  ambiguous: Array<{
    mentionKey: string;
    start: number;
    end: number;
    candidates: MentionCandidate[];
  }>;
};

type MentionAudienceMember = {
  userId: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    name: string | null;
    avatarUrl?: string | null;
  };
};

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
      where: {
        channelId: channel.id,
        parentMessageId: null,
      },
      orderBy: { createdAt: "asc" },
      include: {
        User: true,
        MessageMention: {
          include: {
            mentionedUser: {
              select: {
                id: true,
                email: true,
                fullName: true,
                name: true,
              },
            },
          },
        },
        MessageReaction: {
          select: {
            emoji: true,
            userId: true,
          },
        },
        PinnedMessage: {
          select: { id: true },
        },
        Replies: {
          select: { id: true },
        },
      },
    });

    return messages.map((message) => this.toView(message, userId));
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
        MessageMention: {
          include: {
            mentionedUser: {
              select: {
                id: true,
                email: true,
                fullName: true,
                name: true,
              },
            },
          },
        },
        MessageReaction: {
          select: {
            emoji: true,
            userId: true,
          },
        },
        PinnedMessage: {
          select: { id: true },
        },
        Replies: {
          select: { id: true },
        },
      },
    });

    await this.handleMentions(
      channel.workspaceId,
      channel.id,
      channel.type,
      message.id,
      userId,
      message.content,
    );
    await this.emitUnreadUpdates(channel.workspaceId, channel.id, channel.type, userId, message.createdAt);

    const reloaded = await this.prisma.message.findUnique({
      where: { id: message.id },
      include: {
        User: true,
        MessageMention: {
          include: {
            mentionedUser: {
              select: {
                id: true,
                email: true,
                fullName: true,
                name: true,
              },
            },
          },
        },
        MessageReaction: {
          select: {
            emoji: true,
            userId: true,
          },
        },
        PinnedMessage: {
          select: { id: true },
        },
        Replies: {
          select: { id: true },
        },
      },
    });
    if (!reloaded) {
      throw new NotFoundException("Message not found after create");
    }

    const view = this.toView(reloaded, userId);
    const { resolution } = await this.resolveMentions(
      channel.workspaceId,
      channel.id,
      channel.type,
      userId,
      reloaded.content,
    );
    this.messageGateway.emitMessageCreated(channel.workspaceId, channel.id, view);
    return {
      ...view,
      mentionResolution: resolution,
    };
  }

  async getThread(workspaceRef: string, channelRef: string, messageId: string, userId: string) {
    const channel = await this.resolveChannel(workspaceRef, channelRef);
    await this.requireChannelAccess(channel.id, channel.workspaceId, channel.type, userId);

    const root = await this.prisma.message.findFirst({
      where: {
        id: messageId,
        channelId: channel.id,
      },
      include: {
        User: true,
        MessageMention: {
          include: {
            mentionedUser: {
              select: {
                id: true,
                email: true,
                fullName: true,
                name: true,
              },
            },
          },
        },
        MessageReaction: {
          select: {
            emoji: true,
            userId: true,
          },
        },
        PinnedMessage: {
          select: { id: true },
        },
        Replies: {
          select: { id: true },
        },
      },
    });

    if (!root) {
      throw new NotFoundException("Thread root message not found");
    }

    const rootMessageId = root.parentMessageId ?? root.id;
    const rootMessage =
      root.parentMessageId === null
        ? root
        : await this.prisma.message.findFirst({
            where: {
              id: rootMessageId,
              channelId: channel.id,
            },
            include: {
              User: true,
              MessageMention: {
                include: {
                  mentionedUser: {
                    select: {
                      id: true,
                      email: true,
                      fullName: true,
                      name: true,
                    },
                  },
                },
              },
              MessageReaction: {
                select: {
                  emoji: true,
                  userId: true,
                },
              },
              PinnedMessage: {
                select: { id: true },
              },
              Replies: {
                select: { id: true },
              },
            },
          });

    if (!rootMessage) {
      throw new NotFoundException("Thread root message not found");
    }

    const replies = await this.prisma.message.findMany({
      where: {
        channelId: channel.id,
        parentMessageId: rootMessage.id,
      },
      orderBy: { createdAt: "asc" },
      include: {
        User: true,
        MessageMention: {
          include: {
            mentionedUser: {
              select: {
                id: true,
                email: true,
                fullName: true,
                name: true,
              },
            },
          },
        },
        MessageReaction: {
          select: {
            emoji: true,
            userId: true,
          },
        },
        PinnedMessage: {
          select: { id: true },
        },
        Replies: {
          select: { id: true },
        },
      },
    });

    return {
      root: this.toView(rootMessage, userId),
      replies: replies.map((item) => this.toView(item, userId)),
    };
  }

  async createReply(
    workspaceRef: string,
    channelRef: string,
    messageId: string,
    userId: string,
    dto: CreateMessageDto,
  ) {
    const channel = await this.resolveChannel(workspaceRef, channelRef);
    await this.requireChannelAccess(channel.id, channel.workspaceId, channel.type, userId);

    const root = await this.prisma.message.findFirst({
      where: {
        id: messageId,
        channelId: channel.id,
      },
      select: {
        id: true,
        parentMessageId: true,
      },
    });

    if (!root) {
      throw new NotFoundException("Thread root message not found");
    }

    const rootMessageId = root.parentMessageId ?? root.id;
    const message = await this.prisma.message.create({
      data: {
        id: randomUUID(),
        channelId: channel.id,
        userId,
        parentMessageId: rootMessageId,
        content: dto.content.trim(),
        updatedAt: new Date(),
      },
      include: {
        User: true,
        MessageMention: {
          include: {
            mentionedUser: {
              select: {
                id: true,
                email: true,
                fullName: true,
                name: true,
              },
            },
          },
        },
        MessageReaction: {
          select: {
            emoji: true,
            userId: true,
          },
        },
        PinnedMessage: {
          select: { id: true },
        },
        Replies: {
          select: { id: true },
        },
      },
    });

    await this.handleMentions(
      channel.workspaceId,
      channel.id,
      channel.type,
      message.id,
      userId,
      message.content,
    );
    await this.emitUnreadUpdates(channel.workspaceId, channel.id, channel.type, userId, message.createdAt);

    const reloaded = await this.prisma.message.findUnique({
      where: { id: message.id },
      include: {
        User: true,
        MessageMention: {
          include: {
            mentionedUser: {
              select: {
                id: true,
                email: true,
                fullName: true,
                name: true,
              },
            },
          },
        },
        MessageReaction: {
          select: {
            emoji: true,
            userId: true,
          },
        },
        PinnedMessage: {
          select: { id: true },
        },
        Replies: {
          select: { id: true },
        },
      },
    });

    if (!reloaded) {
      throw new NotFoundException("Reply not found after create");
    }

    const view = this.toView(reloaded, userId);
    const { resolution } = await this.resolveMentions(
      channel.workspaceId,
      channel.id,
      channel.type,
      userId,
      reloaded.content,
    );
    this.messageGateway.emitThreadReplyCreated(channel.workspaceId, channel.id, rootMessageId, view);
    return {
      ...view,
      mentionResolution: resolution,
    };
  }

  async addReaction(
    workspaceRef: string,
    channelRef: string,
    messageId: string,
    userId: string,
    emoji: string,
  ) {
    const normalizedEmoji = emoji.trim();
    if (!normalizedEmoji) {
      throw new BadRequestException("Emoji is required");
    }

    const channel = await this.resolveChannel(workspaceRef, channelRef);
    await this.requireChannelAccess(channel.id, channel.workspaceId, channel.type, userId);

    const message = await this.prisma.message.findFirst({
      where: {
        id: messageId,
        channelId: channel.id,
      },
      select: {
        id: true,
      },
    });

    if (!message) {
      throw new NotFoundException("Message not found");
    }

    await this.prisma.messageReaction.upsert({
      where: {
        messageId_userId_emoji: {
          messageId,
          userId,
          emoji: normalizedEmoji,
        },
      },
      create: {
        id: randomUUID(),
        messageId,
        userId,
        emoji: normalizedEmoji,
      },
      update: {},
    });

    const summary = await this.buildReactionSummary(messageId, userId);
    this.messageGateway.emitReactionUpdated(channel.workspaceId, channel.id, {
      messageId,
      reactions: summary,
    });
    return { messageId, reactions: summary };
  }

  async removeReaction(
    workspaceRef: string,
    channelRef: string,
    messageId: string,
    userId: string,
    emoji: string,
  ) {
    const normalizedEmoji = emoji.trim();
    if (!normalizedEmoji) {
      throw new BadRequestException("Emoji is required");
    }

    const channel = await this.resolveChannel(workspaceRef, channelRef);
    await this.requireChannelAccess(channel.id, channel.workspaceId, channel.type, userId);

    const message = await this.prisma.message.findFirst({
      where: {
        id: messageId,
        channelId: channel.id,
      },
      select: {
        id: true,
      },
    });

    if (!message) {
      throw new NotFoundException("Message not found");
    }

    await this.prisma.messageReaction.deleteMany({
      where: {
        messageId,
        userId,
        emoji: normalizedEmoji,
      },
    });

    const summary = await this.buildReactionSummary(messageId, userId);
    this.messageGateway.emitReactionUpdated(channel.workspaceId, channel.id, {
      messageId,
      reactions: summary,
    });
    return { messageId, reactions: summary };
  }

  async pinMessage(workspaceRef: string, channelRef: string, messageId: string, userId: string) {
    const channel = await this.resolveChannel(workspaceRef, channelRef);
    await this.requireChannelAccess(channel.id, channel.workspaceId, channel.type, userId);

    const message = await this.prisma.message.findFirst({
      where: {
        id: messageId,
        channelId: channel.id,
      },
      select: { id: true },
    });

    if (!message) {
      throw new NotFoundException("Message not found");
    }

    await this.prisma.pinnedMessage.upsert({
      where: {
        channelId_messageId: {
          channelId: channel.id,
          messageId,
        },
      },
      create: {
        id: randomUUID(),
        workspaceId: channel.workspaceId,
        channelId: channel.id,
        messageId,
        pinnedById: userId,
      },
      update: {},
    });

    this.messageGateway.emitMessagePinned(channel.workspaceId, channel.id, { messageId, pinned: true });
    return { messageId, pinned: true };
  }

  async unpinMessage(workspaceRef: string, channelRef: string, messageId: string, userId: string) {
    const channel = await this.resolveChannel(workspaceRef, channelRef);
    await this.requireChannelAccess(channel.id, channel.workspaceId, channel.type, userId);

    await this.prisma.pinnedMessage.deleteMany({
      where: {
        channelId: channel.id,
        messageId,
      },
    });

    this.messageGateway.emitMessagePinned(channel.workspaceId, channel.id, { messageId, pinned: false });
    return { messageId, pinned: false };
  }

  async listPinned(workspaceRef: string, channelRef: string, userId: string) {
    const channel = await this.resolveChannel(workspaceRef, channelRef);
    await this.requireChannelAccess(channel.id, channel.workspaceId, channel.type, userId);

    const items = await this.prisma.pinnedMessage.findMany({
      where: {
        workspaceId: channel.workspaceId,
        channelId: channel.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        message: {
          include: {
            User: true,
            MessageMention: {
              include: {
                mentionedUser: {
                  select: {
                    id: true,
                    email: true,
                    fullName: true,
                    name: true,
                  },
                },
              },
            },
            MessageReaction: {
              select: {
                emoji: true,
                userId: true,
              },
            },
            PinnedMessage: {
              select: { id: true },
            },
            Replies: {
              select: { id: true },
            },
          },
        },
      },
    });

    return items.map((item) => this.toView(item.message, userId));
  }

  async searchWorkspace(
    workspaceRef: string,
    userId: string,
    q: string,
    scope: "messages" | "people" | "channels" = "messages",
  ) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        OR: [{ id: workspaceRef }, { slug: workspaceRef }],
      },
      select: { id: true },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId,
        },
      },
    });
    if (!membership) {
      throw new ForbiddenException("You are not a member of this workspace");
    }

    const term = q.trim();
    if (!term) {
      return { scope, items: [] };
    }

    if (scope === "people") {
      const members = await this.prisma.workspaceMember.findMany({
        where: {
          workspaceId: workspace.id,
          user: {
            OR: [
              { email: { contains: term, mode: "insensitive" } },
              { fullName: { contains: term, mode: "insensitive" } },
              { name: { contains: term, mode: "insensitive" } },
            ],
          },
        },
        select: {
          role: true,
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              name: true,
            },
          },
        },
        take: 30,
      });

      return {
        scope,
        items: members.map((member) => ({
          id: member.user.id,
          type: "person",
          name: member.user.fullName || member.user.name || member.user.email.split("@")[0] || "Member",
          email: member.user.email,
          role: member.role,
        })),
      };
    }

    if (scope === "channels") {
      const channels = await this.prisma.channel.findMany({
        where: {
          workspaceId: workspace.id,
          name: {
            contains: term.toLowerCase(),
          },
        },
        select: {
          id: true,
          name: true,
          type: true,
          description: true,
        },
        take: 30,
      });

      return {
        scope,
        items: channels.map((channel) => ({
          id: channel.id,
          type: "channel",
          name: channel.name,
          private: channel.type === "PRIVATE",
          description: channel.description || "",
        })),
      };
    }

    const visibleChannelIds = await this.getVisibleChannelIds(workspace.id, userId);
    const messages = await this.prisma.message.findMany({
      where: {
        channelId: { in: visibleChannelIds },
        content: { contains: term, mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
      include: {
        User: true,
        MessageMention: {
          include: {
            mentionedUser: {
              select: {
                id: true,
                email: true,
                fullName: true,
                name: true,
              },
            },
          },
        },
        MessageReaction: {
          select: {
            emoji: true,
            userId: true,
          },
        },
        PinnedMessage: {
          select: { id: true },
        },
        Replies: {
          select: { id: true },
        },
      },
      take: 50,
    });

    return {
      scope: "messages",
      items: messages.map((message) => this.toView(message, userId)),
    };
  }

  async suggestMentions(
    workspaceRef: string,
    userId: string,
    q: string,
    channelRef?: string,
  ) {
    const workspace = await this.prisma.workspace.findFirst({
      where: { OR: [{ id: workspaceRef }, { slug: workspaceRef }] },
      select: { id: true },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId,
        },
      },
    });
    if (!membership) {
      throw new ForbiddenException("You are not a member of this workspace");
    }

    let channel:
      | {
          id: string;
          workspaceId: string;
          type: ChannelType;
        }
      | null = null;
    if (channelRef) {
      channel = await this.resolveChannel(workspaceRef, channelRef);
      await this.requireChannelAccess(channel.id, channel.workspaceId, channel.type, userId);
    }

    const audience = channel
      ? await this.mentionAudience(workspace.id, channel.id, channel.type)
      : await this.mentionAudience(workspace.id, "", ChannelType.PUBLIC);

    const query = this.normalizeMentionKey(q);
    const users = audience
      .filter((member) => member.userId !== userId)
      .map((member) => ({
        id: member.user.id,
        displayName: this.userDisplayName(member.user),
        handle: this.userHandle(member.user),
        avatarUrl: member.user.avatarUrl ?? null,
        emailSnippet: member.user.email,
        aliases: this.mentionCandidates(member.user),
      }));

    const filtered = query
      ? users.filter((item) => item.aliases.some((alias) => alias.includes(query)))
      : users;

    const dedup = new Map<string, MentionCandidate>();
    for (const user of filtered) {
      if (!dedup.has(user.id)) {
        dedup.set(user.id, {
          id: user.id,
          displayName: user.displayName,
          handle: user.handle,
          avatarUrl: user.avatarUrl,
          emailSnippet: user.emailSnippet,
        });
      }
    }

    const sorted = [...dedup.values()].sort((a, b) => a.displayName.localeCompare(b.displayName));
    const items = sorted.slice(0, 12);

    if (!query || "channel".includes(query)) {
      items.unshift({
        id: "channel",
        displayName: "Notify everyone in channel",
        handle: "channel",
        avatarUrl: null,
        emailSnippet: "@channel",
      });
    }

    return { items: items.slice(0, 12) };
  }

  async resolveMentionsPreview(
    workspaceRef: string,
    channelRef: string,
    userId: string,
    content: string,
  ) {
    const channel = await this.resolveChannel(workspaceRef, channelRef);
    await this.requireChannelAccess(channel.id, channel.workspaceId, channel.type, userId);
    const { resolution } = await this.resolveMentions(channel.workspaceId, channel.id, channel.type, userId, content);
    return resolution;
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

  private async mentionAudience(
    workspaceId: string,
    channelId: string,
    channelType: ChannelType,
  ): Promise<MentionAudienceMember[]> {
    if (channelType === ChannelType.PRIVATE) {
      const members = await this.prisma.channelMember.findMany({
        where: {
          channelId,
        },
        include: {
          User: {
            select: {
              id: true,
              email: true,
              fullName: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });

      return members.map((member) => ({
        userId: member.userId,
        user: member.User,
      }));
    }

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
            avatarUrl: true,
          },
        },
      },
    });

    return members.map((member) => ({
      userId: member.userId,
      user: member.user,
    }));
  }

  private async handleMentions(
    workspaceId: string,
    channelId: string,
    channelType: ChannelType,
    messageId: string,
    authorId: string,
    content: string,
  ) {
    const { records, notifyUserIds } = await this.resolveMentions(
      workspaceId,
      channelId,
      channelType,
      authorId,
      content,
    );

    if (!records.length) {
      return;
    }

    this.logger.debug(
      `Processing mentions in workspace=${workspaceId}, channel=${channelId}, message=${messageId}`,
    );

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
        [...notifyUserIds].map((targetUserId) => ({
          userId: targetUserId,
          workspaceId,
          channelId,
          messageId,
          mentionKey: "mention",
          preview,
        })),
      );
    }
  }

  private async resolveMentions(
    workspaceId: string,
    channelId: string,
    channelType: ChannelType,
    authorId: string,
    content: string,
  ): Promise<{
    records: Array<{ mentionKey: string; mentionedUserId: string | null }>;
    notifyUserIds: Set<string>;
    resolution: MentionResolution;
  }> {
    const tokens = this.extractMentionTokens(content);
    const emptyResolution: MentionResolution = { resolved: [], unresolved: [], ambiguous: [] };
    if (!tokens.length) {
      return { records: [], notifyUserIds: new Set<string>(), resolution: emptyResolution };
    }

    const members = await this.mentionAudience(workspaceId, channelId, channelType);
    const aliasToUsers = new Map<string, MentionAudienceMember[]>();
    for (const member of members) {
      const aliases = this.mentionCandidates(member.user);
      for (const alias of aliases) {
        const list = aliasToUsers.get(alias) ?? [];
        list.push(member);
        aliasToUsers.set(alias, list);
      }
    }

    const records: Array<{ mentionKey: string; mentionedUserId: string | null }> = [];
    const notifyUserIds = new Set<string>();
    const resolution: MentionResolution = { resolved: [], unresolved: [], ambiguous: [] };

    for (const token of tokens) {
      if (token.mentionKey === "channel") {
        resolution.resolved.push({
          mentionKey: token.mentionKey,
          userId: null,
          displayName: "channel",
          start: token.start,
          end: token.end,
        });
        for (const member of members) {
          if (member.userId !== authorId) {
            notifyUserIds.add(member.userId);
            records.push({ mentionKey: token.mentionKey, mentionedUserId: member.userId });
          }
        }
        continue;
      }

      const matched = aliasToUsers.get(token.mentionKey) ?? [];
      const uniqueByUserId = new Map<string, MentionAudienceMember>();
      for (const member of matched) {
        if (!uniqueByUserId.has(member.user.id)) {
          uniqueByUserId.set(member.user.id, member);
        }
      }
      const candidates = [...uniqueByUserId.values()];

      if (candidates.length === 1) {
        const target = candidates[0];
        records.push({ mentionKey: token.mentionKey, mentionedUserId: target.user.id });
        if (target.user.id !== authorId) {
          notifyUserIds.add(target.user.id);
        }
        resolution.resolved.push({
          mentionKey: token.mentionKey,
          userId: target.user.id,
          displayName: this.userDisplayName(target.user),
          start: token.start,
          end: token.end,
        });
        continue;
      }

      records.push({ mentionKey: token.mentionKey, mentionedUserId: null });
      if (candidates.length === 0) {
        resolution.unresolved.push({
          mentionKey: token.mentionKey,
          start: token.start,
          end: token.end,
        });
      } else {
        resolution.ambiguous.push({
          mentionKey: token.mentionKey,
          start: token.start,
          end: token.end,
          candidates: candidates.slice(0, 8).map((member) => ({
            id: member.user.id,
            displayName: this.userDisplayName(member.user),
            handle: this.userHandle(member.user),
            avatarUrl: member.user.avatarUrl ?? null,
            emailSnippet: member.user.email,
          })),
        });
      }
    }

    return { records, notifyUserIds, resolution };
  }

  private extractMentionTokens(content: string): MentionToken[] {
    const regex = /(^|\s)@([a-zA-Z0-9._-]{2,64})/g;
    const tokens: MentionToken[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
      const rawPrefix = match[1] ?? "";
      const mentionKey = this.normalizeMentionKey(match[2] ?? "");
      if (!mentionKey) {
        continue;
      }
      const start = match.index + rawPrefix.length;
      const end = start + mentionKey.length + 1;
      tokens.push({ mentionKey, start, end });
    }
    return tokens;
  }

  private normalizeMentionKey(input: string) {
    return input.toLowerCase().trim().replace(/^@+/, "").replace(/[^a-z0-9._-]/g, "");
  }

  private userDisplayName(user: { email: string; fullName: string | null; name: string | null }) {
    return user.fullName || user.name || user.email.split("@")[0] || "User";
  }

  private userHandle(user: { email: string; fullName: string | null; name: string | null }) {
    const fromName = (user.name || "").trim();
    if (fromName && !fromName.includes(" ")) {
      return fromName.toLowerCase();
    }
    return user.email.split("@")[0]?.toLowerCase().trim() || "user";
  }

  private mentionCandidates(user: { email: string; fullName: string | null; name: string | null }) {
    const emailLocal = this.normalizeMentionKey(user.email.split("@")[0] || "");
    const display = this.userDisplayName(user);
    const normalizedFull = display.toLowerCase().replace(/[^a-z0-9]+/g, "");
    const parts = display
      .toLowerCase()
      .split(/[^a-z0-9]+/g)
      .filter(Boolean);
    const first = parts[0] || "";
    const firstLast = parts.length >= 2 ? `${parts[0]}.${parts[parts.length - 1]}` : "";
    const explicitHandle = this.normalizeMentionKey(user.name || "");

    return [...new Set([emailLocal, normalizedFull, first, firstLast, explicitHandle].filter(Boolean))];
  }

  private buildMentionEntities(
    content: string,
    mentions: Array<{
      mentionKey: string;
      mentionedUser: {
        id: string;
        email: string;
        fullName: string | null;
        name: string | null;
      } | null;
    }>,
  ) {
    const tokens = this.extractMentionTokens(content);
    if (!tokens.length) {
      return [];
    }

    const lookup = new Map<
      string,
      {
        userId: string | null;
        displayName: string;
      }
    >();
    for (const mention of mentions) {
      if (!lookup.has(mention.mentionKey)) {
        const user = mention.mentionedUser;
        lookup.set(mention.mentionKey, {
          userId: user?.id ?? null,
          displayName:
            mention.mentionKey === "channel"
              ? "channel"
              : user?.fullName || user?.name || user?.email.split("@")[0] || mention.mentionKey,
        });
      }
    }

    return tokens.map((token) => {
      const resolved = lookup.get(token.mentionKey);
      return {
        mentionKey: token.mentionKey,
        userId: resolved?.userId ?? null,
        displayName: resolved?.displayName ?? token.mentionKey,
        start: token.start,
        end: token.end,
      };
    });
  }

  private buildReactionEntities(
    reactions: Array<{
      emoji: string;
      userId: string;
    }>,
    currentUserId: string,
  ) {
    const grouped = new Map<string, Set<string>>();
    for (const reaction of reactions) {
      const set = grouped.get(reaction.emoji) ?? new Set<string>();
      set.add(reaction.userId);
      grouped.set(reaction.emoji, set);
    }

    return [...grouped.entries()].map(([emoji, users]) => ({
      emoji,
      count: users.size,
      reactedByMe: users.has(currentUserId),
    }));
  }

  private toView(
    message: {
      id: string;
      content: string;
      createdAt: Date;
      parentMessageId: string | null;
      User: {
        id: string;
        email: string;
        fullName: string | null;
        name: string | null;
      };
      MessageMention: Array<{
        mentionKey: string;
        mentionedUser: {
          id: string;
          email: string;
          fullName: string | null;
          name: string | null;
        } | null;
      }>;
      MessageReaction: Array<{
        emoji: string;
        userId: string;
      }>;
      PinnedMessage: Array<{ id: string }>;
      Replies: Array<{ id: string }>;
    },
    currentUserId: string,
  ) {
    const authorName =
      message.User.fullName || message.User.name || message.User.email.split("@")[0] || "User";
    const mentionEntities = this.buildMentionEntities(message.content, message.MessageMention);
    const unresolved = mentionEntities
      .filter((item) => !item.userId && item.mentionKey !== "channel")
      .map((item) => ({
        mentionKey: item.mentionKey,
        start: item.start,
        end: item.end,
      }));

    return {
      id: message.id,
      content: message.content,
      createdAt: message.createdAt,
      parentMessageId: message.parentMessageId,
      author: {
        id: message.User.id,
        name: authorName,
        email: message.User.email,
      },
      mentions: mentionEntities,
      mentionResolution: {
        resolved: mentionEntities.filter((item) => item.userId || item.mentionKey === "channel"),
        unresolved,
        ambiguous: [],
      },
      reactions: this.buildReactionEntities(message.MessageReaction, currentUserId),
      repliesCount: message.Replies.length,
      pinned: message.PinnedMessage.length > 0,
    };
  }

  private async buildReactionSummary(messageId: string, userId: string) {
    const reactions = await this.prisma.messageReaction.findMany({
      where: {
        messageId,
      },
      select: {
        emoji: true,
        userId: true,
      },
    });
    return this.buildReactionEntities(reactions, userId);
  }

  private async getVisibleChannelIds(workspaceId: string, userId: string) {
    const [publicChannels, privateChannels] = await Promise.all([
      this.prisma.channel.findMany({
        where: {
          workspaceId,
          type: ChannelType.PUBLIC,
        },
        select: { id: true },
      }),
      this.prisma.channelMember.findMany({
        where: {
          userId,
          Channel: {
            workspaceId,
            type: ChannelType.PRIVATE,
          },
        },
        select: { channelId: true },
      }),
    ]);

    const ids = new Set<string>();
    for (const item of publicChannels) {
      ids.add(item.id);
    }
    for (const item of privateChannels) {
      ids.add(item.channelId);
    }
    return [...ids];
  }

  private async emitUnreadUpdates(
    workspaceId: string,
    channelId: string,
    channelType: ChannelType,
    authorId: string,
    messageCreatedAt: Date,
  ) {
    const recipientIds =
      channelType === ChannelType.PUBLIC
        ? (
            await this.prisma.workspaceMember.findMany({
              where: {
                workspaceId,
                userId: { not: authorId },
              },
              select: { userId: true },
            })
          ).map((item) => item.userId)
        : (
            await this.prisma.channelMember.findMany({
              where: {
                channelId,
                userId: { not: authorId },
              },
              select: { userId: true },
            })
          ).map((item) => item.userId);

    if (!recipientIds.length) {
      return;
    }

    const readStates = await this.prisma.channelReadState.findMany({
      where: {
        channelId,
        userId: { in: recipientIds },
      },
      select: {
        userId: true,
        lastReadAt: true,
      },
    });
    const readByUserId = new Map(readStates.map((state) => [state.userId, state.lastReadAt]));

    for (const recipientId of recipientIds) {
      const lastReadAt = readByUserId.get(recipientId);
      const isUnreadForRecipient = !lastReadAt || messageCreatedAt > lastReadAt;
      if (!isUnreadForRecipient) {
        continue;
      }

      const unreadCount = await this.prisma.message.count({
        where: {
          channelId,
          userId: { not: recipientId },
          ...(lastReadAt ? { createdAt: { gt: lastReadAt } } : {}),
        },
      });

      this.messageGateway.emitUnreadCountForUser(recipientId, {
        workspaceId,
        channelId,
        unreadCount,
      });
    }
  }
}
