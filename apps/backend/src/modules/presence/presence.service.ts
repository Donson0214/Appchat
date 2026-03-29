import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { PresenceStatus, SetStatusDto } from "./dto/set-status.dto";

type PresenceRecord = {
  status: PresenceStatus;
  lastSeenAt: number;
};

const ACTIVE_WINDOW_MS = 90_000;

@Injectable()
export class PresenceService {
  private readonly presenceByUserId = new Map<string, PresenceRecord>();

  constructor(private readonly prisma: PrismaService) {}

  async heartbeat(userId: string, workspaceRef?: string) {
    if (workspaceRef) {
      const workspace = await this.resolveWorkspace(workspaceRef);
      await this.requireWorkspaceMembership(workspace.id, userId);
    }

    const existing = this.presenceByUserId.get(userId);
    this.presenceByUserId.set(userId, {
      status: existing?.status && existing.status !== PresenceStatus.OFFLINE ? existing.status : PresenceStatus.ONLINE,
      lastSeenAt: Date.now(),
    });

    return { ok: true };
  }

  async setStatus(userId: string, dto: SetStatusDto) {
    this.presenceByUserId.set(userId, {
      status: dto.status,
      lastSeenAt: Date.now(),
    });

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

    return members.map((membership) => {
      const user = membership.user;
      const name = user.fullName || user.name || user.email.split("@")[0] || "Member";

      return {
        id: user.id,
        name,
        email: user.email,
        role: membership.role,
        isSelf: user.id === requesterId,
        status: this.readStatus(user.id),
      };
    });
  }

  private readStatus(userId: string): PresenceStatus {
    const record = this.presenceByUserId.get(userId);
    if (!record) {
      return PresenceStatus.OFFLINE;
    }

    if (record.status === PresenceStatus.OFFLINE) {
      return PresenceStatus.OFFLINE;
    }

    if (Date.now() - record.lastSeenAt > ACTIVE_WINDOW_MS) {
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
}
