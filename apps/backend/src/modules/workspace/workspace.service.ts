import { BadRequestException, Injectable } from "@nestjs/common";
import { ChannelType } from "@prisma/client";
import { randomUUID } from "crypto";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { JoinWorkspaceDto } from "./dto/join-workspace.dto";

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
      createdAt: membership.workspace.createdAt,
      updatedAt: membership.workspace.updatedAt,
    }));
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
}
