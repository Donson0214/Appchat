import { BadRequestException, Injectable } from "@nestjs/common";
import { ChannelType } from "@prisma/client";
import { randomUUID } from "crypto";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { JoinWorkspaceDto } from "./dto/join-workspace.dto";
import { OpenDirectMessageDto } from "./dto/open-direct-message.dto";

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async createForUser(userId: string, dto: CreateWorkspaceDto) {
    const slugBase = this.normalizeSlug(dto.slug ?? dto.name);
    const slug = await this.ensureUniqueSlug(slugBase);
    const inviteCode = await this.ensureUniqueInviteCode();

    const workspace = await this.prisma.$transaction(async (tx) => {
      const created = await tx.workspace.create({
        data: {
          name: dto.name.trim(),
          slug,
          inviteCode,
          ownerId: userId,
        },
      });

      await tx.workspaceMember.create({
        data: {
          workspaceId: created.id,
          userId,
          role: "ADMIN",
        },
      });

      const defaultChannels = [
        { name: "general", description: "Company-wide announcements and watercooler chat", type: ChannelType.PUBLIC },
        { name: "announcements", description: "Important company announcements", type: ChannelType.PUBLIC },
      ];

      for (const channel of defaultChannels) {
        const createdChannel = await tx.channel.create({
          data: {
            id: randomUUID(),
            workspaceId: created.id,
            name: channel.name,
            description: channel.description,
            type: channel.type,
            createdById: userId,
            updatedAt: new Date(),
          },
        });

        await tx.channelMember.create({
          data: {
            id: randomUUID(),
            channelId: createdChannel.id,
            userId,
          },
        });
      }

      return created;
    });

    return workspace;
  }

  async joinForUserByCode(userId: string, dto: JoinWorkspaceDto) {
    const code = dto.code.trim().toUpperCase();
    const workspace = await this.prisma.workspace.findUnique({
      where: { inviteCode: code },
    });

    if (!workspace) {
      throw new BadRequestException("Invalid workspace invite code");
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.workspaceMember.upsert({
        where: {
          workspaceId_userId: {
            workspaceId: workspace.id,
            userId,
          },
        },
        create: {
          workspaceId: workspace.id,
          userId,
          role: "MEMBER",
        },
        update: {},
      });

      const defaultChannels = await tx.channel.findMany({
        where: {
          workspaceId: workspace.id,
          name: { in: ["general", "announcements"] },
          type: ChannelType.PUBLIC,
        },
        select: { id: true },
      });

      for (const channel of defaultChannels) {
        await tx.channelMember.upsert({
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
          },
          update: {},
        });
      }
    });

    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      role: "MEMBER",
      inviteCode: null,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };
  }

  async findMine(userId: string) {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true },
      orderBy: { joinedAt: "asc" },
    });

    return memberships.map((membership) => ({
      id: membership.workspace.id,
      name: membership.workspace.name,
      slug: membership.workspace.slug,
      role: membership.role,
      inviteCode: membership.role === "ADMIN" ? membership.workspace.inviteCode : null,
      createdAt: membership.workspace.createdAt,
      updatedAt: membership.workspace.updatedAt,
    }));
  }

  async openDirectMessage(workspaceRef: string, requesterId: string, dto: OpenDirectMessageDto) {
    if (dto.memberId === requesterId) {
      throw new BadRequestException("Cannot open direct message with yourself");
    }

    const workspace = await this.prisma.workspace.findFirst({
      where: {
        OR: [{ id: workspaceRef }, { slug: workspaceRef }],
      },
      select: { id: true },
    });

    if (!workspace) {
      throw new BadRequestException("Workspace not found");
    }

    const [requesterMembership, targetMembership] = await Promise.all([
      this.prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: workspace.id,
            userId: requesterId,
          },
        },
      }),
      this.prisma.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: workspace.id,
            userId: dto.memberId,
          },
        },
      }),
    ]);

    if (!requesterMembership || !targetMembership) {
      throw new BadRequestException("Both members must belong to this workspace");
    }

    const dmName = this.buildDirectMessageChannelName(requesterId, dto.memberId);
    const now = new Date();

    const channel = await this.prisma.channel.upsert({
      where: {
        workspaceId_name: {
          workspaceId: workspace.id,
          name: dmName,
        },
      },
      create: {
        id: randomUUID(),
        workspaceId: workspace.id,
        name: dmName,
        description: "Direct message",
        type: ChannelType.PRIVATE,
        createdById: requesterId,
        updatedAt: now,
      },
      update: {
        updatedAt: now,
      },
      select: {
        id: true,
        name: true,
        workspaceId: true,
      },
    });

    await Promise.all([
      this.prisma.channelMember.upsert({
        where: {
          channelId_userId: {
            channelId: channel.id,
            userId: requesterId,
          },
        },
        create: {
          id: randomUUID(),
          channelId: channel.id,
          userId: requesterId,
        },
        update: {},
      }),
      this.prisma.channelMember.upsert({
        where: {
          channelId_userId: {
            channelId: channel.id,
            userId: dto.memberId,
          },
        },
        create: {
          id: randomUUID(),
          channelId: channel.id,
          userId: dto.memberId,
        },
        update: {},
      }),
    ]);

    const member = await this.prisma.user.findUnique({
      where: { id: dto.memberId },
      select: {
        id: true,
        email: true,
        fullName: true,
        name: true,
      },
    });

    return {
      channelId: channel.id,
      channelRef: channel.id,
      member: member
        ? {
            id: member.id,
            name: member.fullName || member.name || member.email.split("@")[0] || "Member",
            email: member.email,
          }
        : null,
    };
  }

  private normalizeSlug(input: string): string {
    const slug = input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!slug) {
      throw new BadRequestException("Workspace slug is invalid");
    }

    return slug.slice(0, 80);
  }

  private async ensureUniqueSlug(base: string): Promise<string> {
    let candidate = base;
    let suffix = 2;

    while (await this.prisma.workspace.findUnique({ where: { slug: candidate } })) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }

    return candidate;
  }

  private async ensureUniqueInviteCode(): Promise<string> {
    let candidate = "";

    do {
      candidate = Math.random().toString(36).slice(2, 10).toUpperCase();
    } while (await this.prisma.workspace.findUnique({ where: { inviteCode: candidate } }));

    return candidate;
  }

  private buildDirectMessageChannelName(leftUserId: string, rightUserId: string) {
    const [a, b] = [leftUserId, rightUserId].sort();
    return `dm-${a}-${b}`.toLowerCase();
  }
}
