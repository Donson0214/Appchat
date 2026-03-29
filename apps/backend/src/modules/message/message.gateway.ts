import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ChannelType } from "@prisma/client";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { PrismaService } from "../../database/prisma/prisma.service";
import { JwtPayload } from "../auth/strategies/jwt.strategy";

type JoinRoomPayload = {
  workspaceId: string;
  channelRef: string;
};

@WebSocketGateway({
  namespace: "/ws",
  cors: {
    origin: true,
    credentials: true,
  },
})
export class MessageGateway implements OnGatewayConnection {
  private readonly logger = new Logger(MessageGateway.name);

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
      client.disconnect(true);
      return;
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>("JWT_SECRET") ?? "",
      });
      client.data.userId = payload.sub;
      client.join(this.userRoom(payload.sub));
    } catch {
      client.disconnect(true);
    }
  }

  @SubscribeMessage("join-room")
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() payload: JoinRoomPayload) {
    const userId = client.data.userId as string | undefined;
    if (!userId) {
      client.disconnect(true);
      return { ok: false };
    }

    const channel = await this.resolveChannel(payload.workspaceId, payload.channelRef);
    if (!channel) {
      return { ok: false };
    }

    const canAccess = await this.canAccessChannel(channel.id, payload.workspaceId, channel.type, userId);
    if (!canAccess) {
      this.logger.warn(`Socket join denied for user ${userId} channel ${payload.channelRef}`);
      return { ok: false };
    }

    const room = this.roomFor(payload.workspaceId, channel.id);
    client.join(room);
    return { ok: true, room };
  }

  emitMessageCreated(workspaceId: string, channelRef: string, message: unknown) {
    const room = this.roomFor(workspaceId, channelRef);
    this.server.to(room).emit("message-created", message);
  }

  emitUnreadCountForUser(userId: string, payload: { workspaceId: string; channelId: string; unreadCount: number }) {
    this.server.to(this.userRoom(userId)).emit("unread-updated", payload);
  }

  emitThreadReplyCreated(
    workspaceId: string,
    channelRef: string,
    rootMessageId: string,
    reply: unknown,
  ) {
    const room = this.roomFor(workspaceId, channelRef);
    this.server.to(room).emit("thread:reply-created", { rootMessageId, reply });
  }

  emitReactionUpdated(
    workspaceId: string,
    channelRef: string,
    payload: { messageId: string; reactions: Array<{ emoji: string; count: number; reactedByMe: boolean }> },
  ) {
    const room = this.roomFor(workspaceId, channelRef);
    this.server.to(room).emit("message:reaction-updated", payload);
  }

  emitMessagePinned(
    workspaceId: string,
    channelRef: string,
    payload: { messageId: string; pinned: boolean },
  ) {
    const room = this.roomFor(workspaceId, channelRef);
    this.server
      .to(room)
      .emit(payload.pinned ? "message:pinned" : "message:unpinned", payload);
  }

  private roomFor(workspaceId: string, channelRef: string) {
    return `workspace:${workspaceId}:channel:${channelRef.toLowerCase().trim()}`;
  }

  private userRoom(userId: string) {
    return `user:${userId}`;
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

  private async resolveChannel(workspaceRef: string, channelRef: string) {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        OR: [{ id: workspaceRef }, { slug: workspaceRef }],
      },
      select: { id: true },
    });

    if (!workspace) {
      return null;
    }

    return this.prisma.channel.findFirst({
      where: {
        workspaceId: workspace.id,
        OR: [{ id: channelRef }, { name: channelRef.toLowerCase().trim() }],
      },
      select: { id: true, type: true },
    });
  }

  private async canAccessChannel(
    channelId: string,
    workspaceRef: string,
    channelType: ChannelType,
    userId: string,
  ) {
    const workspace = await this.prisma.workspace.findFirst({
      where: { OR: [{ id: workspaceRef }, { slug: workspaceRef }] },
      select: { id: true },
    });

    if (!workspace) {
      return false;
    }

    const workspaceMember = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId,
        },
      },
    });

    if (!workspaceMember) {
      return false;
    }

    if (channelType === ChannelType.PUBLIC) {
      return true;
    }

    const channelMember = await this.prisma.channelMember.findUnique({
      where: {
        channelId_userId: {
          channelId,
          userId,
        },
      },
    });

    return Boolean(channelMember);
  }
}
