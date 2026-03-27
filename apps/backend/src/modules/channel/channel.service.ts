import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ChannelType } from "@prisma/client";
import { PrismaService } from "../../database/prisma/prisma.service";
import { MembershipService } from "../membership/membership.service";
import { CreateChannelDto } from "./dto/create-channel.dto";

@Injectable()
export class ChannelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membershipService: MembershipService,
  ) {}

  async createChannel(userId: string, workspaceId: string, dto: CreateChannelDto) {
    await this.membershipService.assertWorkspaceMember(userId, workspaceId);

    return this.prisma.$transaction(async (tx) => {
      const channel = await tx.channel.create({
        data: {
          workspaceId,
          name: dto.name.trim(),
          description: dto.description?.trim() || null,
          type: dto.type,
          createdById: userId,
        },
      });

      await tx.channelMember.create({
        data: {
          channelId: channel.id,
          userId,
        },
      });

      return channel;
    });
  }

  async listChannels(userId: string, workspaceId: string) {
    await this.membershipService.assertWorkspaceMember(userId, workspaceId);

    return this.prisma.channel.findMany({
      where: {
        workspaceId,
        OR: [
          { type: ChannelType.PUBLIC },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async joinChannel(userId: string, channelId: string) {
    const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });

    if (!channel) {
      throw new NotFoundException("Channel not found");
    }

    await this.membershipService.assertWorkspaceMember(userId, channel.workspaceId);

    if (channel.type === ChannelType.PRIVATE) {
      throw new ForbiddenException("Private channels require an admin invitation");
    }

    return this.prisma.channelMember.upsert({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
      create: {
        channelId,
        userId,
      },
      update: {},
    });
  }

  async leaveChannel(userId: string, channelId: string) {
    const membership = await this.prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException("You are not a member of this channel");
    }

    const count = await this.prisma.channelMember.count({ where: { channelId } });
    if (count <= 1) {
      throw new BadRequestException("Channel must have at least one member");
    }

    await this.prisma.channelMember.delete({ where: { id: membership.id } });

    return { success: true };
  }
}