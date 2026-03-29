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
import { JwtPayload } from "../auth/strategies/jwt.strategy";

type NotificationPayload = {
  id: string;
  type: string;
  createdAt: Date;
  preview: string;
};

@WebSocketGateway({
  namespace: "/notifications",
  cors: {
    origin: true,
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  @SubscribeMessage("subscribe-notifications")
  handleSubscribe(@ConnectedSocket() client: Socket, @MessageBody() _payload: Record<string, unknown>) {
    if (!client.data.userId) {
      client.disconnect(true);
      return { ok: false };
    }

    client.join(this.userRoom(client.data.userId as string));
    return { ok: true };
  }

  emitNotification(userId: string, payload: NotificationPayload) {
    this.server.to(this.userRoom(userId)).emit("notification", payload);
    this.logger.debug(`Notification emitted to user ${userId}: ${payload.id}`);
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
}
