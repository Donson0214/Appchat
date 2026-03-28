import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageGateway } from "./message.gateway";

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly messageGateway: MessageGateway,
  ) {}

  async list(workspaceRef: string, channelRef: string, userId: string) {
    const channel = await this.resolveChannel(workspaceRef, channelRef);
    await this.requireChannelMember(channel.id, userId);

    const messages = await this.prisma.message.findMany({
      where: { channelId: channel.id },
      orderBy: { createdAt: "asc" },
      include: {
        User: true,
      },
      take: 200,
    });

    return messages.map((message) => this.toView(message));
  }

  async create(workspaceRef: string, channelRef: string, userId: string, dto: CreateMessageDto) {
    const channel = await this.resolveChannel(workspaceRef, channelRef);
    await this.requireChannelMember(channel.id, userId);

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
      select: { id: true, name: true, workspaceId: true },
    });

    if (!channel) {
      throw new NotFoundException("Channel not found");
    }

    return channel;
  }

  private async requireChannelMember(channelId: string, userId: string) {
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
