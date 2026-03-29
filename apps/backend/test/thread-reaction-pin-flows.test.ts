import { test } from "node:test";
import assert from "node:assert/strict";
import { ForbiddenException } from "@nestjs/common";
import { MessageService } from "../src/modules/message/message.service";

const buildService = (overrides: Record<string, unknown> = {}) => {
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
      findUnique: async () => ({ id: "wm-1", userId: "user-1", workspaceId: "workspace-1" }),
      findMany: async () => [
        {
          userId: "user-2",
          user: {
            id: "user-2",
            email: "teammate@example.com",
            fullName: "Team Mate",
            name: null,
          },
        },
      ],
    },
    channelMember: {
      findUnique: async () => null,
      findMany: async () => [],
    },
    message: {
      findMany: async () => [],
      findFirst: async () => ({ id: "message-root", parentMessageId: null, channelId: "channel-1" }),
      findUnique: async () => ({
        id: "message-reply",
        content: "reply @teammate",
        parentMessageId: "message-root",
        createdAt: new Date(),
        User: { id: "user-1", email: "author@example.com", fullName: "Author", name: null },
        MessageMention: [{ mentionKey: "teammate", mentionedUser: { id: "user-2", email: "teammate@example.com", fullName: "Team Mate", name: null } }],
        MessageReaction: [],
        PinnedMessage: [],
        Replies: [],
      }),
      create: async () => ({
        id: "message-reply",
        content: "reply @teammate",
        parentMessageId: "message-root",
        createdAt: new Date(),
        User: { id: "user-1", email: "author@example.com", fullName: "Author", name: null },
        MessageMention: [],
        MessageReaction: [],
        PinnedMessage: [],
        Replies: [],
      }),
      count: async () => 1,
    },
    messageMention: {
      create: async () => ({}),
    },
    messageReaction: {
      upsert: async () => ({}),
      deleteMany: async () => ({ count: 1 }),
      findMany: async () => [{ emoji: "👍", userId: "user-1" }, { emoji: "👍", userId: "user-2" }],
    },
    pinnedMessage: {
      upsert: async () => ({}),
      deleteMany: async () => ({ count: 1 }),
      findMany: async () => [],
    },
    channelReadState: {
      findMany: async () => [],
    },
    $transaction: async (actions: any[]) => Promise.all(actions),
    ...overrides,
  };

  const gateway = {
    emitMessageCreated: () => undefined,
    emitUnreadCountForUser: () => undefined,
    emitThreadReplyCreated: () => undefined,
    emitReactionUpdated: () => undefined,
    emitMessagePinned: () => undefined,
  };

  const notifications = {
    createMentionNotifications: async () => [],
  };

  return new MessageService(prisma, gateway as any, notifications as any);
};

test("create reply returns threaded message and preserves mention entities", async () => {
  const service = buildService();
  const reply = await service.createReply("workspace-1", "general", "message-root", "user-1", { content: "reply @teammate" });
  assert.equal(reply.parentMessageId, "message-root");
  assert.ok(Array.isArray(reply.mentions));
});

test("reaction add/remove are idempotent and return grouped counts", async () => {
  const service = buildService();
  const added = await service.addReaction("workspace-1", "general", "message-root", "user-1", "👍");
  assert.equal(added.messageId, "message-root");
  assert.equal(added.reactions[0]?.count, 2);

  const removed = await service.removeReaction("workspace-1", "general", "message-root", "user-1", "👍");
  assert.equal(removed.messageId, "message-root");
  assert.equal(removed.reactions[0]?.emoji, "👍");
});

test("private channel rejects non-member thread access", async () => {
  const service = buildService({
    channel: {
      findFirst: async () => ({
        id: "channel-private",
        name: "secret",
        workspaceId: "workspace-1",
        type: "PRIVATE",
      }),
    },
    channelMember: {
      findUnique: async () => null,
      findMany: async () => [],
    },
  });

  await assert.rejects(
    async () => service.getThread("workspace-1", "secret", "message-root", "user-1"),
    (error: unknown) => error instanceof ForbiddenException,
  );
});

test("public channel allows workspace member to create thread reply without explicit channel membership", async () => {
  const service = buildService({
    channel: {
      findFirst: async () => ({
        id: "channel-public",
        name: "general",
        workspaceId: "workspace-1",
        type: "PUBLIC",
      }),
    },
    channelMember: {
      findUnique: async () => null,
      findMany: async () => [],
    },
  });

  const reply = await service.createReply("workspace-1", "general", "message-root", "user-1", { content: "hello" });
  assert.equal(reply.parentMessageId, "message-root");
});

test("private channel rejects non-member reply create", async () => {
  const service = buildService({
    channel: {
      findFirst: async () => ({
        id: "channel-private",
        name: "secret",
        workspaceId: "workspace-1",
        type: "PRIVATE",
      }),
    },
    channelMember: {
      findUnique: async () => null,
      findMany: async () => [],
    },
  });

  await assert.rejects(
    async () => service.createReply("workspace-1", "secret", "message-root", "user-1", { content: "no access" }),
    (error: unknown) => error instanceof ForbiddenException,
  );
});

test("private channel allows invited member to create reply", async () => {
  const service = buildService({
    channel: {
      findFirst: async () => ({
        id: "channel-private",
        name: "secret",
        workspaceId: "workspace-1",
        type: "PRIVATE",
      }),
    },
    channelMember: {
      findUnique: async () => ({ id: "cm-1", channelId: "channel-private", userId: "user-1" }),
      findMany: async () => [],
    },
  });

  const reply = await service.createReply("workspace-1", "secret", "message-root", "user-1", { content: "allowed" });
  assert.equal(reply.parentMessageId, "message-root");
});
