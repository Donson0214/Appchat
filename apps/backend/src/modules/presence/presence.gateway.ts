import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PrismaService } from "../../database/prisma/prisma.service";
import { JwtPayload } from "../auth/strategies/jwt.strategy";
import { PresenceStatus } from "./dto/set-status.dto";

type SubscribePresencePayload = {
  workspaceRef: string;
};

type PresenceChangedPayload = {
  userId: string;
  status: PresenceStatus;
  at: string;
};

@WebSocketGateway({
  namespace: "/presence",
  cors: {
    origin: true,
    credentials: true,
  },
})
export class PresenceGateway implements OnGatewayConnection {
  private readonly logger = new Logger(PresenceGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  handleConnection(client: Socket) {
    const token = this.extractToken(client);
    if (!token) {
      this.logger.warn("Presence socket rejected: missing auth token");
      client.disconnect(true);
      return;
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>("JWT_SECRET") ?? "",
      });
      client.data.userId = payload.sub;
    } catch {
      this.logger.warn("Presence socket rejected: invalid token");
      client.disconnect(true);
    }
  }

  @SubscribeMessage("presence:subscribe")
  async handleSubscribe(@ConnectedSocket() client: Socket, @MessageBody() payload: SubscribePresencePayload) {
    const userId = client.data.userId as string | undefined;
    const workspaceRef = String(payload?.workspaceRef ?? "").trim();

    if (!userId || !workspaceRef) {
      return { ok: false, reason: "Missing user or workspace reference" };
    }

    const workspace = await this.resolveWorkspace(workspaceRef);
    if (!workspace) {
      this.logger.warn(`Presence subscribe rejected: workspace not found (${workspaceRef})`);
      return { ok: false, reason: "Workspace not found" };
    }

    const membership = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId,
        },
      },
      select: { id: true },
    });

    if (!membership) {
      this.logger.warn(`Presence subscribe denied for user=${userId} workspace=${workspace.id}`);
      return { ok: false, reason: "Not a member of this workspace" };
    }

    const room = this.roomForWorkspace(workspace.id);
    client.join(room);
    return { ok: true, workspaceId: workspace.id };
  }

  emitPresenceChanged(workspaceId: string, payload: PresenceChangedPayload) {
    this.server.to(this.roomForWorkspace(workspaceId)).emit("presence:changed", payload);
  }

  private roomForWorkspace(workspaceId: string) {
    return `workspace:${workspaceId}:presence`;
  }

  private extractToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token;
    if (typeof authToken === "string" && authToken.trim()) {
      return authToken.trim();
    }

    const header = client.handshake.headers.authorization;
    if (typeof header === "string" && header.toLowerCase().startsWith("bearer ")) {
      return header.slice(7).trim();
    }

    return null;
  }

  private async resolveWorkspace(workspaceRef: string) {
    return this.prisma.workspace.findFirst({
      where: {
        OR: [{ id: workspaceRef }, { slug: workspaceRef }],
      },
      select: { id: true },
    });
  }
}
