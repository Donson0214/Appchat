import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ChannelType, WorkspaceRole } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { AddChannelMemberDto } from "./dto/add-channel-member.dto";
import { AddWorkspaceMemberDto } from "./dto/add-workspace-member.dto";
import { UpdateWorkspaceMemberRoleDto } from "./dto/update-workspace-member-role.dto";

@Injectable()
export class MembershipService {
  constructor(private readonly prisma: PrismaService) {}

  async assertWorkspaceMember(userId: string, workspaceId: string) {
    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!member) {
      throw new ForbiddenException("You are not a member of this workspace");
    }

    return member;
  }

  async assertWorkspaceAdmin(userId: string, workspaceId: string) {
    const member = await this.assertWorkspaceMember(userId, workspaceId);

    if (member.role !== WorkspaceRole.ADMIN) {
      throw new ForbiddenException("Admin role required");
    }

    return member;
  }

  async assertChannelMember(userId: string, channelId: string) {
    const membership = await this.prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException("You are not a member of this channel");
    }

    return membership;
  }

  async addWorkspaceMember(
    actorUserId: string,
    workspaceId: string,
    dto: AddWorkspaceMemberDto,
  ) {
    await this.assertWorkspaceAdmin(actorUserId, workspaceId);

    const targetUser = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!targetUser) {
      throw new NotFoundException("Target user not found");
    }

    return this.prisma.workspaceMember.upsert({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: dto.userId,
        },
      },
      create: {
        workspaceId,
        userId: dto.userId,
        role: dto.role ?? WorkspaceRole.MEMBER,
      },
      update: {
        role: dto.role,
      },
    });
  }

  async updateWorkspaceMemberRole(
    actorUserId: string,
    workspaceId: string,
    targetUserId: string,
    dto: UpdateWorkspaceMemberRoleDto,
  ) {
    await this.assertWorkspaceAdmin(actorUserId, workspaceId);

    const existing = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: targetUserId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException("Workspace membership not found");
    }

    return this.prisma.workspaceMember.update({
      where: { id: existing.id },
      data: { role: dto.role },
    });
  }

  async removeWorkspaceMember(actorUserId: string, workspaceId: string, targetUserId: string) {
    await this.assertWorkspaceAdmin(actorUserId, workspaceId);

    const target = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: targetUserId,
        },
      },
    });

    if (!target) {
      throw new NotFoundException("Workspace membership not found");
    }

    if (target.role === WorkspaceRole.ADMIN) {
      const adminCount = await this.prisma.workspaceMember.count({
        where: {
          workspaceId,
          role: WorkspaceRole.ADMIN,
        },
      });

      if (adminCount <= 1) {
        throw new BadRequestException("Workspace must have at least one admin");
      }
    }

    await this.prisma.workspaceMember.delete({ where: { id: target.id } });

    return { success: true };
  }

  async addUserToPrivateChannel(
    actorUserId: string,
    channelId: string,
    dto: AddChannelMemberDto,
  ) {
    const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });

    if (!channel) {
      throw new NotFoundException("Channel not found");
    }

    if (channel.type !== ChannelType.PRIVATE) {
      throw new BadRequestException("Manual membership is only required for private channels");
    }

    await this.assertWorkspaceAdmin(actorUserId, channel.workspaceId);
    await this.assertWorkspaceMember(dto.userId, channel.workspaceId);

    return this.prisma.channelMember.upsert({
      where: {
        channelId_userId: {
          channelId,
          userId: dto.userId,
        },
      },
      create: {
        channelId,
        userId: dto.userId,
      },
      update: {},
    });
  }

  async removeUserFromChannel(actorUserId: string, channelId: string, targetUserId: string) {
    const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });

    if (!channel) {
      throw new NotFoundException("Channel not found");
    }

    await this.assertWorkspaceAdmin(actorUserId, channel.workspaceId);

    const membership = await this.prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId: targetUserId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException("Channel membership not found");
    }

    await this.prisma.channelMember.delete({ where: { id: membership.id } });

    return { success: true };
  }
}