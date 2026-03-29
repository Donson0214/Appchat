import { test } from "node:test";
import assert from "node:assert/strict";
import { BadRequestException } from "@nestjs/common";
import { PresenceService } from "../src/modules/presence/presence.service";
import { PresenceStatus } from "../src/modules/presence/dto/set-status.dto";

const createService = (overrides: Record<string, unknown> = {}) => {
  const prisma: any = {
    workspace: {
      findFirst: async () => ({ id: "workspace-1" }),
    },
    workspaceMember: {
      findUnique: async () => ({ id: "membership-1" }),
      findMany: async () => [{ workspaceId: "workspace-1" }],
    },
    ...overrides,
  };

  const configService = {
    get: () => undefined,
  };

  const emitted: Array<{ workspaceId: string; userId: string; status: PresenceStatus }> = [];
  const presenceGateway = {
    emitPresenceChanged: (workspaceId: string, payload: { userId: string; status: PresenceStatus }) => {
      emitted.push({ workspaceId, userId: payload.userId, status: payload.status });
    },
  };

  return {
    service: new PresenceService(prisma, configService as any, presenceGateway as any),
    emitted,
  };
};

test("heartbeat marks user online and emits presence update", async () => {
  const { service, emitted } = createService();

  const result = await service.heartbeat("user-1", "workspace-1");

  assert.equal(result.ok, true);
  assert.equal(emitted.length, 1);
  assert.equal(emitted[0].workspaceId, "workspace-1");
  assert.equal(emitted[0].userId, "user-1");
  assert.equal(emitted[0].status, PresenceStatus.ONLINE);
});

test("setStatus marks user offline", async () => {
  const { service } = createService({
    workspaceMember: {
      findUnique: async () => ({ id: "membership-1" }),
      findMany: async () => [
        {
          workspaceId: "workspace-1",
          role: "MEMBER",
          user: {
            id: "user-1",
            email: "user1@example.com",
            fullName: "User One",
            name: null,
          },
        },
      ],
    },
  });

  await service.heartbeat("user-1", "workspace-1");
  await service.setStatus("user-1", { status: PresenceStatus.OFFLINE });

  const members = await service.listWorkspacePresence("workspace-1", "user-2");
  assert.equal(members[0].status, PresenceStatus.OFFLINE);
});

test("heartbeat rejects users outside workspace membership", async () => {
  const { service } = createService({
    workspaceMember: {
      findUnique: async () => null,
      findMany: async () => [],
    },
  });

  await assert.rejects(
    async () => service.heartbeat("user-1", "workspace-1"),
    (error: unknown) => error instanceof BadRequestException,
  );
});
