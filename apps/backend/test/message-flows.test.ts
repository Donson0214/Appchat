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
    },
    channelMember: {
      findUnique: async () => null,
    },
    message: {
      findMany: async () => [],
      create: async () => ({
        id: "message-1",
        content: "hello @channel",
        createdAt: new Date(),
        User: {
          email: "author@example.com",
          fullName: "Author User",
          name: null,
        },
      }),
    },
    messageMention: {
      create: async () => ({}),
    },
    $transaction: async (actions: any[]) => Promise.all(actions),
    ...overrides,
  };

  const messageGateway = {
    emitMessageCreated: () => undefined,
  };

  const notificationsService = {
    createMentionNotifications: async () => [],
  };

  return {
    service: new MessageService(prisma, messageGateway as any, notificationsService as any),
    prisma,
    notificationsService,
  };
};

test("public channels are readable by workspace members without explicit channel membership", async () => {
  const { service } = buildService();
  const result = await service.list("workspace-1", "general", "user-1");
  assert.deepEqual(result, []);
});

test("private channels reject non-channel members", async () => {
  const { service } = buildService({
    channel: {
      findFirst: async () => ({
        id: "channel-private-1",
        name: "leadership",
        workspaceId: "workspace-1",
        type: "PRIVATE",
      }),
    },
  });

  await assert.rejects(
    async () => service.list("workspace-1", "leadership", "user-1"),
    (error: unknown) => error instanceof ForbiddenException,
  );
});

test("@channel mention creates notifications for other workspace members", async () => {
  const createMentionNotifications = async (items: unknown[]) => items;
  const mentionRecords: unknown[] = [];

  const { service } = buildService({
    workspaceMember: {
      findUnique: async () => ({ id: "wm-1", userId: "user-1", workspaceId: "workspace-1" }),
      findMany: async () => [
        {
          userId: "user-1",
          user: { id: "user-1", email: "author@example.com", fullName: "Author User", name: null },
        },
        {
          userId: "user-2",
          user: { id: "user-2", email: "teammate@example.com", fullName: "Team Mate", name: null },
        },
      ],
    },
    messageMention: {
      create: async (payload: unknown) => {
        mentionRecords.push(payload);
        return payload;
      },
    },
  });

  (service as any).notificationsService.createMentionNotifications = createMentionNotifications;

  await service.create("workspace-1", "general", "user-1", { content: "hello @channel" });

  assert.ok(mentionRecords.length > 0);
});
