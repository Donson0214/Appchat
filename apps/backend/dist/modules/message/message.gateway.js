"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const socket_io_1 = require("socket.io");
const ws_auth_guard_1 = require("../../common/guards/ws-auth.guard");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const ws_join_channel_dto_1 = require("./dto/ws-join-channel.dto");
const ws_send_message_dto_1 = require("./dto/ws-send-message.dto");
const message_service_1 = require("./message.service");
let MessageGateway = class MessageGateway {
    constructor(configService, jwtService, prisma, messageService) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.messageService = messageService;
    }
    async handleConnection(client) {
        const token = this.extractToken(client);
        if (!token) {
            client.disconnect(true);
            return;
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get("JWT_SECRET") ?? "dev-secret",
            });
            const user = { userId: payload.sub, email: payload.email };
            client.data.user = user;
            const channelMemberships = await this.prisma.channelMember.findMany({
                where: { userId: user.userId },
                select: { channelId: true },
            });
            for (const membership of channelMemberships) {
                client.join(this.channelRoom(membership.channelId));
            }
        }
        catch {
            client.disconnect(true);
        }
    }
    handleDisconnect(_client) {
    }
    async joinChannel(client, dto) {
        const userId = this.getUserId(client);
        await this.messageService.ensureChannelMember(userId, dto.channelId);
        client.join(this.channelRoom(dto.channelId));
        return { success: true };
    }
    async leaveChannel(client, dto) {
        const userId = this.getUserId(client);
        await this.messageService.ensureChannelMember(userId, dto.channelId);
        client.leave(this.channelRoom(dto.channelId));
        return { success: true };
    }
    async sendMessage(client, dto) {
        const userId = this.getUserId(client);
        const message = await this.messageService.sendMessage(userId, dto.channelId, {
            content: dto.content,
        });
        this.server.to(this.channelRoom(dto.channelId)).emit("message:new", message);
        return message;
    }
    channelRoom(channelId) {
        return `channel:${channelId}`;
    }
    getUserId(client) {
        const user = client.data.user;
        if (!user?.userId) {
            throw new websockets_1.WsException("Unauthorized");
        }
        return user.userId;
    }
    extractToken(client) {
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
};
exports.MessageGateway = MessageGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], MessageGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })),
    (0, websockets_1.SubscribeMessage)("join_channel"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, ws_join_channel_dto_1.WsJoinChannelDto]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "joinChannel", null);
__decorate([
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })),
    (0, websockets_1.SubscribeMessage)("leave_channel"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, ws_join_channel_dto_1.WsJoinChannelDto]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "leaveChannel", null);
__decorate([
    (0, common_1.UseGuards)(ws_auth_guard_1.WsAuthGuard),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true })),
    (0, websockets_1.SubscribeMessage)("send_message"),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, ws_send_message_dto_1.WsSendMessageDto]),
    __metadata("design:returntype", Promise)
], MessageGateway.prototype, "sendMessage", null);
exports.MessageGateway = MessageGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: "/chat",
        cors: {
            origin: true,
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService,
        message_service_1.MessageService])
], MessageGateway);
//# sourceMappingURL=message.gateway.js.map