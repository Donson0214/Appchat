import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Server, Socket } from "socket.io";
import { WsAuthGuard } from "../../common/guards/ws-auth.guard";
import { AuthUser } from "../../common/types";
import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { WsJoinChannelDto } from "./dto/ws-join-channel.dto";
import { WsSendMessageDto } from "./dto/ws-send-message.dto";
import { MessageService } from "./message.service";

type JwtPayload = {
  sub: string;
  email: string;
};

@WebSocketGateway({
  namespace: "/chat",
  cors: {
    origin: true,
    credentials: true,
  },
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly messageService: MessageService,
  ) {}

  async handleConnection(client: Socket) {
    const token = this.extractToken(client);
    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>("JWT_SECRET") ?? "dev-secret",
      });

      const user: AuthUser = { userId: payload.sub, email: payload.email };
      client.data.user = user;

      const channelMemberships = await this.prisma.channelMember.findMany({
        where: { userId: user.userId },
        select: { channelId: true },
      });

      for (const membership of channelMemberships) {
        client.join(this.channelRoom(membership.channelId));
      }
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(_client: Socket) {
    // Presence tracking can be added later without changing message delivery.
  }

  @UseGuards(WsAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  @SubscribeMessage("join_channel")
  async joinChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: WsJoinChannelDto) {
    const userId = this.getUserId(client);
    await this.messageService.ensureChannelMember(userId, dto.channelId);
    client.join(this.channelRoom(dto.channelId));

    return { success: true };
  }

  @UseGuards(WsAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  @SubscribeMessage("leave_channel")
  async leaveChannel(@ConnectedSocket() client: Socket, @MessageBody() dto: WsJoinChannelDto) {
    const userId = this.getUserId(client);
    await this.messageService.ensureChannelMember(userId, dto.channelId);
    client.leave(this.channelRoom(dto.channelId));

    return { success: true };
  }

  @UseGuards(WsAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
  @SubscribeMessage("send_message")
  async sendMessage(@ConnectedSocket() client: Socket, @MessageBody() dto: WsSendMessageDto) {
    const userId = this.getUserId(client);

    const message = await this.messageService.sendMessage(userId, dto.channelId, {
      content: dto.content,
    } satisfies CreateMessageDto);

    this.server.to(this.channelRoom(dto.channelId)).emit("message:new", message);

    return message;
  }

  private channelRoom(channelId: string) {
    return `channel:${channelId}`;
  }

  private getUserId(client: Socket) {
    const user = client.data.user as AuthUser | undefined;

    if (!user?.userId) {
      throw new WsException("Unauthorized");
    }

    return user.userId;
  }

  private extractToken(client: Socket) {
    const fromAuth = client.handshake.auth?.token;
    if (typeof fromAuth === "string" && fromAuth.trim().length > 0) {
      return fromAuth.replace(/^Bearer\s+/i, "");
    }

    const headerValue = client.handshake.headers.authorization;
    if (typeof headerValue === "string" && headerValue.trim().length > 0) {
      return headerValue.replace(/^Bearer\s+/i, "");
    }

    return null;
  }
}