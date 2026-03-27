import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { MembershipService } from "../membership/membership.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { QueryMessagesDto } from "./dto/query-messages.dto";

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly membershipService: MembershipService,
  ) {}

  async ensureChannelMember(userId: string, channelId: string) {
    await this.membershipService.assertChannelMember(userId, channelId);
  }

  async sendMessage(userId: string, channelId: string, dto: CreateMessageDto) {
    await this.ensureChannelMember(userId, channelId);

    return this.prisma.message.create({
      data: {
        userId,
        channelId,
        content: dto.content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async getMessages(userId: string, channelId: string, query: QueryMessagesDto) {
    await this.ensureChannelMember(userId, channelId);

    const limit = query.limit ?? 20;

    const messages = await this.prisma.message.findMany({
      where: { channelId },
      orderBy: { createdAt: "desc" },
      take: limit,
      ...(query.cursor
        ? {
            skip: 1,
            cursor: { id: query.cursor },
          }
        : {}),
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    const nextCursor = messages.length === limit ? messages[messages.length - 1]?.id ?? null : null;

    return {
      data: [...messages].reverse(),
      nextCursor,
    };
  }
}