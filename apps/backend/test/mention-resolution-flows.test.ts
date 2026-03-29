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
      findMany: async () => [],
    },
    workspaceMember: {
      findUnique: async () => ({ id: "wm-1", userId: "user-1", workspaceId: "workspace-1" }),
      findMany: async () => [
        {
          userId: "user-1",
          user: { id: "user-1", email: "author@example.com", fullName: "Author One", name: "author", avatarUrl: null },
        },
        {
          userId: "user-2",
          user: { id: "user-2", email: "donson@example.com", fullName: "Donson Carpenter", name: null, avatarUrl: null },
        },
      ],
    },
    channelMember: {
      findUnique: async () => ({ id: "cm-1" }),
      findMany: async () => [],
    },
    message: {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      create: async () => ({}),
      count: async () => 0,
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
  const notifications = { createMentionNotifications: async () => [] };

  return new MessageService(prisma, gateway as any, notifications as any);
};

test("resolveMentionsPreview resolves @FirstName aliases", async () => {
  const service = buildService();
  const result = await service.resolveMentionsPreview("workspace-1", "general", "user-1", "hello @Donson");
  assert.equal(result.resolved.length, 1);
  assert.equal(result.resolved[0]?.userId, "user-2");
});

test("resolveMentionsPreview returns ambiguity metadata when alias collides", async () => {
  const service = buildService({
    workspaceMember: {
      findUnique: async () => ({ id: "wm-1", userId: "user-1", workspaceId: "workspace-1" }),
      findMany: async () => [
        {
          userId: "user-1",
          user: { id: "user-1", email: "author@example.com", fullName: "Author One", name: "author", avatarUrl: null },
        },
        {
          userId: "user-2",
          user: { id: "user-2", email: "donson@example.com", fullName: "Donson Carpenter", name: null, avatarUrl: null },
        },
        {
          userId: "user-3",
          user: { id: "user-3", email: "donson2@example.com", fullName: "Donson Cruz", name: null, avatarUrl: null },
        },
      ],
    },
  });

  const result = await service.resolveMentionsPreview("workspace-1", "general", "user-1", "hello @donson");
  assert.equal(result.ambiguous.length, 1);
  assert.ok(result.ambiguous[0]?.candidates.length >= 2);
});

test("private channel mention suggestions are blocked for non-members", async () => {
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
    async () => service.suggestMentions("workspace-1", "user-1", "do", "secret"),
    (error: unknown) => error instanceof ForbiddenException,
  );
});

