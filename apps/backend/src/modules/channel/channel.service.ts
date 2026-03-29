import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ChannelType, WorkspaceRole } from "@prisma/client";
import { randomUUID } from "crypto";
import { PrismaService } from "../../database/prisma/prisma.service";
import { MessageGateway } from "../message/message.gateway";
import { AddChannelMemberDto } from "./dto/add-channel-member.dto";
import { CreateChannelDto } from "./dto/create-channel.dto";

@Injectable()
export class ChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly messageGateway: MessageGateway,
  ) {}

  async listForWorkspace(workspaceRef: string, userId: string) {
    const workspace = await this.resolveWorkspace(workspaceRef);
    await this.requireWorkspaceMember(workspace.id, userId);

    const channels = await this.prisma.channel.findMany({
      where: {
        workspaceId: workspace.id,
        NOT: {
          name: {
            startsWith: "dm-",
          },
        },
        OR: [
          { type: ChannelType.PUBLIC },
          {
            ChannelMember: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      orderBy: { name: "asc" },
      include: {
        ChannelMember: {
          select: { id: true },
        },
      },
    });

    const channelIds = channels.map((channel) => channel.id);
    const readStates = await this.prisma.channelReadState.findMany({
      where: {
        userId,
        channelId: { in: channelIds },
      },
      select: {
        channelId: true,
        lastReadAt: true,
      },
    });
    const readByChannelId = new Map(readStates.map((item) => [item.channelId, item.lastReadAt]));

    const unreadEntries = await Promise.all(
      channels.map(async (channel) => {
        const lastReadAt = readByChannelId.get(channel.id);
        const unreadCount = await this.prisma.message.count({
          where: {
            channelId: channel.id,
            userId: { not: userId },
            ...(lastReadAt ? { createdAt: { gt: lastReadAt } } : {}),
          },
        });
        return { channelId: channel.id, unreadCount };
      }),
    );
    const unreadByChannelId = new Map(unreadEntries.map((item) => [item.channelId, item.unreadCount]));

    return channels.map((channel) => ({
      id: channel.id,
      name: channel.name,
      slug: channel.name,
      description: channel.description ?? "",
      type: channel.type,
      private: channel.type === ChannelType.PRIVATE,
      membersCount: channel.ChannelMember.length,
      unreadCount: unreadByChannelId.get(channel.id) ?? 0,
    }));
  }

  async createInWorkspace(workspaceRef: string, userId: string, dto: CreateChannelDto) {
    const workspace = await this.resolveWorkspace(workspaceRef);
    await this.requireWorkspaceMember(workspace.id, userId);

    const name = this.normalizeChannelName(dto.name);

    const existing = await this.prisma.channel.findFirst({
      where: {
        workspaceId: workspace.id,
        name,
      },
    });

    if (existing) {
      throw new BadRequestException("Channel already exists");
    }

    const now = new Date();
    const channel = await this.prisma.channel.create({
      data: {
        id: randomUUID(),
        workspaceId: workspace.id,
        name,
        description: dto.description?.trim() || null,
        type: dto.type ?? ChannelType.PUBLIC,
        createdById: userId,
        updatedAt: now,
      },
    });

    await this.prisma.channelMember.create({
      data: {
        id: randomUUID(),
        channelId: channel.id,
        userId,
      },
    });

    return {
      id: channel.id,
      name: channel.name,
      slug: channel.name,
      description: channel.description ?? "",
      type: channel.type,
      private: channel.type === ChannelType.PRIVATE,
      membersCount: 1,
      unreadCount: 0,
    };
  }

  async addMember(workspaceRef: string, channelRef: string, requesterId: string, dto: AddChannelMemberDto) {
    const workspace = await this.resolveWorkspace(workspaceRef);
    const requesterMembership = await this.requireWorkspaceMember(workspace.id, requesterId);
    const channel = await this.findChannel(workspace.id, channelRef);
    const requesterChannelMember = await this.prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId: channel.id,
          userId: requesterId,
        },
      },
    });

    if (
      channel.type === ChannelType.PRIVATE &&
      requesterMembership.role !== WorkspaceRole.ADMIN &&
      !requesterChannelMember
    ) {
      throw new ForbiddenException("Only workspace admins or channel members can invite to a private channel");
    }

    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.upsert({
      where: { email },
      create: {
        id: randomUUID(),
        email,
        provider: "EMAIL",
      },
      update: {},
    });

    const existingWorkspaceMember = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId: user.id,
        },
      },
    });

    if (!existingWorkspaceMember) {
      await this.prisma.workspaceMember.create({
        data: {
          id: randomUUID(),
          workspaceId: workspace.id,
          userId: user.id,
          role: WorkspaceRole.MEMBER,
        },
      });
    }

    const existingChannelMember = await this.prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId: channel.id,
          userId: user.id,
        },
      },
    });

    if (!existingChannelMember) {
      await this.prisma.channelMember.create({
        data: {
          id: randomUUID(),
          channelId: channel.id,
          userId: user.id,
        },
      });
    }

    return {
      channel: channel.name,
      invitedEmail: user.email,
      invitedBy: requesterMembership.userId,
    };
  }

  async markAsRead(workspaceRef: string, channelRef: string, userId: string) {
    const channel = await this.resolveChannel(workspaceRef, channelRef);
    await this.requireChannelAccess(channel.id, channel.workspaceId, channel.type, userId);

    const now = new Date();
    await this.prisma.channelReadState.upsert({
      where: {
        channelId_userId: {
          channelId: channel.id,
          userId,
        },
      },
      create: {
        id: randomUUID(),
        channelId: channel.id,
        userId,
        lastReadAt: now,
      },
      update: {
        lastReadAt: now,
      },
    });

    this.messageGateway.emitUnreadCountForUser(userId, {
      workspaceId: channel.workspaceId,
      channelId: channel.id,
      unreadCount: 0,
    });

    return {
      channelId: channel.id,
      unreadCount: 0,
      lastReadAt: now,
    };
  }

  private normalizeChannelName(raw: string): string {
    const slug = raw
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!slug) {
      throw new BadRequestException("Invalid channel name");
    }

    return slug.slice(0, 80);
  }

  private async resolveWorkspace(workspaceRef: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        OR: [{ id: workspaceRef }, { slug: workspaceRef }],
      },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    return workspace;
  }

  private async resolveChannel(workspaceRef: string, channelRef: string) {
    const workspace = await this.resolveWorkspace(workspaceRef);
    const normalized = this.normalizeChannelName(channelRef);
    const channel = await this.prisma.channel.findFirst({
      where: {
        workspaceId: workspace.id,
        OR: [{ id: channelRef }, { name: normalized }],
      },
      select: { id: true, workspaceId: true, type: true },
    });

    if (!channel) {
      throw new NotFoundException("Channel not found");
    }

    return channel;
  }

  private async requireWorkspaceMember(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException("You are not a member of this workspace");
    }

    return membership;
  }

  private async findChannel(workspaceId: string, channelRef: string) {
    const normalized = this.normalizeChannelName(channelRef);
    const channel = await this.prisma.channel.findFirst({
      where: {
        workspaceId,
        OR: [{ id: channelRef }, { name: normalized }],
      },
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
    await this.requireWorkspaceMember(workspaceId, userId);

    if (channelType === ChannelType.PUBLIC) {
      return;
    }

    const channelMember = await this.prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
      select: { id: true },
    });

    if (!channelMember) {
      throw new ForbiddenException("You are not a member of this channel");
    }
  }
}
