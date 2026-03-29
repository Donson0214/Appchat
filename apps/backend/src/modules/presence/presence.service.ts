import { BadRequestException, Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PresenceGateway } from "./presence.gateway";
import { PresenceStatus, SetStatusDto } from "./dto/set-status.dto";

type PresenceRecord = {
  status: PresenceStatus;
  lastSeenAt: number;
};

const PRESENCE_TTL_SECONDS = 24 * 60 * 60;

@Injectable()
export class PresenceService implements OnModuleDestroy {
  private readonly logger = new Logger(PresenceService.name);
  private readonly presenceByUserId = new Map<string, PresenceRecord>();
  private readonly redisClient: Redis | null;
  private redisReady = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly presenceGateway: PresenceGateway,
  ) {
    const redisUrl = this.configService.get<string>("REDIS_URL") ?? process.env.REDIS_URL ?? "";
    if (!redisUrl.trim()) {
      this.redisClient = null;
      return;
    }

    const client = new Redis(redisUrl, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableReadyCheck: true,
    });

    client.on("ready", () => {
      this.redisReady = true;
      this.logger.log("Presence Redis connected");
    });

    client.on("error", (error: unknown) => {
      this.redisReady = false;
      this.logger.warn(`Presence Redis error, using memory fallback: ${String(error)}`);
    });

    void client.connect().catch((error: unknown) => {
      this.redisReady = false;
      this.logger.warn(`Presence Redis unavailable, using memory fallback: ${String(error)}`);
    });

    this.redisClient = client;
  }

  async heartbeat(userId: string, workspaceRef?: string) {
    let workspaceId: string | null = null;
    if (workspaceRef) {
      const workspace = await this.resolveWorkspace(workspaceRef);
      await this.requireWorkspaceMembership(workspace.id, userId);
      workspaceId = workspace.id;
    }

    const existing = await this.readRecord(userId);
    const previousStatus = this.computeEffectiveStatus(existing);

    const next: PresenceRecord = {
      status: PresenceStatus.ONLINE,
      lastSeenAt: Date.now(),
    };

    await this.writeRecord(userId, next);
    const nextStatus = this.computeEffectiveStatus(next);

    if (nextStatus !== previousStatus) {
      if (workspaceId) {
        this.emitStatusChanged(workspaceId, userId, nextStatus);
      } else {
        await this.emitToUserWorkspaces(userId, nextStatus);
      }
    }

    return { ok: true };
  }

  async setStatus(userId: string, dto: SetStatusDto) {
    const existing = await this.readRecord(userId);
    const previousStatus = this.computeEffectiveStatus(existing);
    const next: PresenceRecord = {
      status: dto.status,
      lastSeenAt: Date.now(),
    };

    await this.writeRecord(userId, next);
    const nextStatus = this.computeEffectiveStatus(next);
    if (nextStatus !== previousStatus) {
      await this.emitToUserWorkspaces(userId, nextStatus);
    }

    return { status: dto.status };
  }

  async listWorkspacePresence(workspaceRef: string, requesterId: string) {
    const workspace = await this.resolveWorkspace(workspaceRef);
    await this.requireWorkspaceMembership(workspace.id, requesterId);

    const members = await this.prisma.workspaceMember.findMany({
      where: { workspaceId: workspace.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            name: true,
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    const result = await Promise.all(
      members.map(async (membership) => {
        const user = membership.user;
        const name = user.fullName || user.name || user.email.split("@")[0] || "Member";
        const status = await this.readStatus(user.id);

        return {
          id: user.id,
          name,
          email: user.email,
          role: membership.role,
          isSelf: user.id === requesterId,
          status,
        };
      }),
    );

    return result;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit().catch(() => undefined);
    }
  }

  private async readStatus(userId: string): Promise<PresenceStatus> {
    const record = await this.readRecord(userId);
    return this.computeEffectiveStatus(record);
  }

  private computeEffectiveStatus(record: PresenceRecord | null): PresenceStatus {
    if (!record) {
      return PresenceStatus.OFFLINE;
    }

    if (record.status === PresenceStatus.OFFLINE) {
      return PresenceStatus.OFFLINE;
    }

    return record.status;
  }

  private async resolveWorkspace(workspaceRef: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        OR: [{ id: workspaceRef }, { slug: workspaceRef }],
      },
      select: { id: true },
    });

    if (!workspace) {
      throw new BadRequestException("Workspace not found");
    }

    return workspace;
  }

  private async requireWorkspaceMembership(workspaceId: string, userId: string) {
    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
      select: { id: true },
    });

    if (!membership) {
      throw new BadRequestException("Not a member of this workspace");
    }

    return membership;
  }

  private keyForUser(userId: string) {
    return `presence:user:${userId}`;
  }

  private async readRecord(userId: string): Promise<PresenceRecord | null> {
    const inMemory = this.presenceByUserId.get(userId) ?? null;
    if (!this.redisClient || !this.redisReady) {
      return inMemory;
    }

    try {
      const data = await this.redisClient.hgetall(this.keyForUser(userId));
      if (!data.status) {
        return inMemory;
      }

      const parsed: PresenceRecord = {
        status: data.status as PresenceStatus,
        lastSeenAt: Number(data.lastSeenAt || 0),
      };

      if (!Number.isFinite(parsed.lastSeenAt) || parsed.lastSeenAt <= 0) {
        return inMemory;
      }

      this.presenceByUserId.set(userId, parsed);
      return parsed;
    } catch (error) {
      this.logger.warn(`Presence read failed for user=${userId}: ${String(error)}`);
      return inMemory;
    }
  }

  private async writeRecord(userId: string, record: PresenceRecord): Promise<void> {
    this.presenceByUserId.set(userId, record);

    if (!this.redisClient || !this.redisReady) {
      return;
    }

    try {
      const key = this.keyForUser(userId);
      await this.redisClient.hset(key, {
        status: record.status,
        lastSeenAt: String(record.lastSeenAt),
      });
      await this.redisClient.expire(key, PRESENCE_TTL_SECONDS);
    } catch (error) {
      this.logger.warn(`Presence write failed for user=${userId}: ${String(error)}`);
    }
  }

  private emitStatusChanged(workspaceId: string, userId: string, status: PresenceStatus) {
    this.presenceGateway.emitPresenceChanged(workspaceId, {
      userId,
      status,
      at: new Date().toISOString(),
    });
  }

  private async emitToUserWorkspaces(userId: string, status: PresenceStatus) {
    const memberships = await this.prisma.workspaceMember.findMany({
      where: { userId },
      select: { workspaceId: true },
    });

    for (const membership of memberships) {
      this.emitStatusChanged(membership.workspaceId, userId, status);
    }
  }
}
