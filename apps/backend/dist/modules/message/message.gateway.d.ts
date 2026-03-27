import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Server, Socket } from "socket.io";
import { PrismaService } from "../../database/prisma/prisma.service";
import { WsJoinChannelDto } from "./dto/ws-join-channel.dto";
import { WsSendMessageDto } from "./dto/ws-send-message.dto";
import { MessageService } from "./message.service";
export declare class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly configService;
    private readonly jwtService;
    private readonly prisma;
    private readonly messageService;
    server: Server;
    constructor(configService: ConfigService, jwtService: JwtService, prisma: PrismaService, messageService: MessageService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(_client: Socket): void;
    joinChannel(client: Socket, dto: WsJoinChannelDto): Promise<{
        success: boolean;
    }>;
    leaveChannel(client: Socket, dto: WsJoinChannelDto): Promise<{
        success: boolean;
    }>;
    sendMessage(client: Socket, dto: WsSendMessageDto): Promise<{
        user: {
            name: string | null;
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        channelId: string;
        content: string;
    }>;
    private channelRoom;
    private getUserId;
    private extractToken;
}
