import { Injectable, Logger } from "@nestjs/common";
import { NotificationType } from "@prisma/client";
import { randomUUID } from "crypto";
import { PrismaService } from "../../database/prisma/prisma.service";
import { NotificationsGateway } from "./notifications.gateway";

type MentionNotificationInput = {
  userId: string;
  workspaceId: string;
  channelId: string;
  messageId: string;
  mentionKey: string;
  preview: string;
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async createMentionNotifications(inputs: MentionNotificationInput[]) {
    if (!inputs.length) {
      return [];
    }

    const now = new Date();
    const records = await this.prisma.$transaction(
      inputs.map((input) =>
        this.prisma.notification.create({
          data: {
            id: randomUUID(),
            userId: input.userId,
            workspaceId: input.workspaceId,
            channelId: input.channelId,
            messageId: input.messageId,
            type: NotificationType.MENTION,
            mentionKey: input.mentionKey,
            preview: input.preview,
            createdAt: now,
            isRead: false,
          },
        }),
      ),
    );

    for (const record of records) {
      this.notificationsGateway.emitNotification(record.userId, {
        id: record.id,
        type: "mention",
        createdAt: record.createdAt,
        preview: record.preview,
      });
    }

    return records;
  }

  async listForUser(userId: string) {
    const items = await this.prisma.notification.findMany({
      where: { userId },
      include: {
        message: {
          select: {
            content: true,
            channelId: true,
          },
        },
        channel: {
          select: {
            id: true,
            name: true,
            workspaceId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return items.map((item) => ({
      id: item.id,
      type: item.type.toLowerCase(),
      preview: item.preview,
      mentionKey: item.mentionKey,
      isRead: item.isRead,
      createdAt: item.createdAt,
      workspaceId: item.workspaceId,
      channel: {
        id: item.channel.id,
        name: item.channel.name,
      },
      message: {
        id: item.messageId,
        channelId: item.message.channelId,
      },
    }));
  }

  async markRead(userId: string, ids?: string[]) {
    const where = ids?.length
      ? {
          userId,
          id: { in: ids },
        }
      : {
          userId,
          isRead: false,
        };

    const result = await this.prisma.notification.updateMany({
      where,
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    this.logger.debug(`Marked ${result.count} notifications read for user ${userId}`);
    return { updated: result.count };
  }
}
