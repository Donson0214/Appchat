import { test } from "node:test";
import assert from "node:assert/strict";
import { ForbiddenException } from "@nestjs/common";
import { ChannelService } from "../src/modules/channel/channel.service";
import { MessageService } from "../src/modules/message/message.service";

test("new message emits unread update for other users only", async () => {
  const unreadEvents: Array<{ userId: string; unreadCount: number }> = [];
  const prisma: any = {
    workspace: {
      findFirst: async () => ({ id: "workspace-1" }),
    },
    channel: {
      findFirst: async () => ({
        id: "channel-1",
        name: "general",
        workspaceId: "workspace-1",
        type: "PUBLIC",
      }),
    },
    workspaceMember: {
      findUnique: async () => ({ id: "wm-author" }),
      findMany: async () => [{ userId: "user-2" }],
    },
    channelMember: {
      findUnique: async () => null,
      findMany: async () => [],
    },
    message: {
      findMany: async () => [],
      count: async () => 1,
      findUnique: async () => ({
        id: "message-1",
        content: "hello",
        parentMessageId: null,
        createdAt: new Date(),
        User: { id: "user-1", email: "author@example.com", fullName: "Author", name: null },
        MessageMention: [],
        MessageReaction: [],
        PinnedMessage: [],
        Replies: [],
      }),
      create: async () => ({
        id: "message-1",
        content: "hello",
        parentMessageId: null,
        createdAt: new Date(),
        User: { id: "user-1", email: "author@example.com", fullName: "Author", name: null },
        MessageMention: [],
        MessageReaction: [],
        PinnedMessage: [],
        Replies: [],
      }),
    },
    channelReadState: {
      findMany: async () => [],
    },
    messageMention: {
      create: async () => ({}),
    },
    messageReaction: {
      findMany: async () => [],
      upsert: async () => ({}),
      deleteMany: async () => ({ count: 0 }),
    },
    pinnedMessage: {
      upsert: async () => ({}),
      deleteMany: async () => ({ count: 0 }),
      findMany: async () => [],
    },
    $transaction: async (actions: any[]) => Promise.all(actions),
  };

  const messageGateway = {
    emitMessageCreated: () => undefined,
    emitUnreadCountForUser: (userId: string, payload: { unreadCount: number }) => {
      unreadEvents.push({ userId, unreadCount: payload.unreadCount });
    },
  };

  const notificationsService = {
    createMentionNotifications: async () => [],
  };

  const service = new MessageService(prisma, messageGateway as any, notificationsService as any);
  await service.create("workspace-1", "general", "user-1", { content: "hello" });

  assert.equal(unreadEvents.length, 1);
  assert.equal(unreadEvents[0].userId, "user-2");
  assert.equal(unreadEvents[0].unreadCount, 1);
});

test("mark-as-read emits zero unread count for the requester", async () => {
  const unreadEvents: Array<{ userId: string; unreadCount: number }> = [];
  const prisma: any = {
    workspace: {
      findFirst: async () => ({ id: "workspace-1" }),
    },
    workspaceMember: {
      findUnique: async () => ({ id: "wm-1", userId: "user-1" }),
    },
    channel: {
      findFirst: async () => ({ id: "channel-1", workspaceId: "workspace-1", type: "PUBLIC" }),
    },
    channelReadState: {
      upsert: async () => ({}),
    },
  };

  const messageGateway = {
    emitUnreadCountForUser: (userId: string, payload: { unreadCount: number }) => {
      unreadEvents.push({ userId, unreadCount: payload.unreadCount });
    },
  };

  const service = new ChannelService(prisma, messageGateway as any);
  const result = await service.markAsRead("workspace-1", "channel-1", "user-1");

  assert.equal(result.unreadCount, 0);
  assert.equal(unreadEvents.length, 1);
  assert.equal(unreadEvents[0].userId, "user-1");
  assert.equal(unreadEvents[0].unreadCount, 0);
});

test("private channels reject mark-as-read from non-channel-members", async () => {
  const prisma: any = {
    workspace: {
      findFirst: async () => ({ id: "workspace-1" }),
    },
    workspaceMember: {
      findUnique: async () => ({ id: "wm-1", userId: "user-1" }),
    },
    channel: {
      findFirst: async () => ({ id: "channel-private", workspaceId: "workspace-1", type: "PRIVATE" }),
    },
    channelMember: {
      findUnique: async () => null,
    },
  };

  const messageGateway = {
    emitUnreadCountForUser: () => undefined,
  };

  const service = new ChannelService(prisma, messageGateway as any);

  await assert.rejects(
    async () => service.markAsRead("workspace-1", "channel-private", "user-1"),
    (error: unknown) => error instanceof ForbiddenException,
  );
});
