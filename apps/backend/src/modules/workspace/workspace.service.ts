import { Injectable, NotFoundException } from "@nestjs/common";
import { ChannelType, WorkspaceRole } from "@prisma/client";
import { randomBytes } from "node:crypto";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { JoinWorkspaceDto } from "./dto/join-workspace.dto";

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkspace(userId: string, dto: CreateWorkspaceDto) {
    const name = dto.name.trim();
    const slug = `${this.slugify(name)}-${randomBytes(3).toString("hex")}`;
    const inviteCode = randomBytes(5).toString("hex").toUpperCase();

    return this.prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name,
          slug,
          inviteCode,
          ownerId: userId,
        },
      });

      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId,
          role: WorkspaceRole.ADMIN,
        },
      });

      const generalChannel = await tx.channel.create({
        data: {
          workspaceId: workspace.id,
          name: "general",
          description: "Company-wide announcements and discussions",
          type: ChannelType.PUBLIC,
          createdById: userId,
        },
      });

      await tx.channelMember.create({
        data: {
          channelId: generalChannel.id,
          userId,
        },
      });

      return {
        ...workspace,
        defaultChannelId: generalChannel.id,
      };
    });
  }

  async joinWorkspace(userId: string, dto: JoinWorkspaceDto) {
    const workspace = await this.prisma.workspace.findUnique({
      where: { inviteCode: dto.inviteCode.toUpperCase() },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found for invite code");
    }

    await this.prisma.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId,
        },
      },
      create: {
        workspaceId: workspace.id,
        userId,
        role: WorkspaceRole.MEMBER,
      },
      update: {},
    });

    return workspace;
  }

  async listUserWorkspaces(userId: string) {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: true,
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    return memberships.map((membership) => ({
      role: membership.role,
      joinedAt: membership.joinedAt,
      workspace: membership.workspace,
    }));
  }

  async listWorkspaceMembers(userId: string, workspaceId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException("Workspace not found or access denied");
    }

    return this.prisma.workspaceMember.findMany({
      where: { workspaceId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        joinedAt: "asc",
      },
    });
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);
  }
}
