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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const message_gateway_1 = require("./message.gateway");
let MessageService = class MessageService {
    constructor(prisma, messageGateway) {
        this.prisma = prisma;
        this.messageGateway = messageGateway;
    }
    async list(workspaceRef, channelRef, userId) {
        const channel = await this.resolveChannel(workspaceRef, channelRef);
        await this.requireChannelMember(channel.id, userId);
        const messages = await this.prisma.message.findMany({
            where: { channelId: channel.id },
            orderBy: { createdAt: "asc" },
            include: {
                User: true,
            },
            take: 200,
        });
        return messages.map((message) => this.toView(message));
    }
    async create(workspaceRef, channelRef, userId, dto) {
        const channel = await this.resolveChannel(workspaceRef, channelRef);
        await this.requireChannelMember(channel.id, userId);
        const now = new Date();
        const message = await this.prisma.message.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                channelId: channel.id,
                userId,
                content: dto.content.trim(),
                updatedAt: now,
            },
            include: {
                User: true,
            },
        });
        const view = this.toView(message);
        this.messageGateway.emitMessageCreated(channel.workspaceId, channel.id, view);
        return view;
    }
    async resolveChannel(workspaceRef, channelRef) {
        const workspace = await this.prisma.workspace.findFirst({
            where: {
                OR: [{ id: workspaceRef }, { slug: workspaceRef }],
            },
            select: { id: true },
        });
        if (!workspace) {
            throw new common_1.NotFoundException("Workspace not found");
        }
        const normalizedChannel = channelRef.toLowerCase().trim();
        const channel = await this.prisma.channel.findFirst({
            where: {
                workspaceId: workspace.id,
                OR: [{ id: channelRef }, { name: normalizedChannel }],
            },
            select: { id: true, name: true, workspaceId: true },
        });
        if (!channel) {
            throw new common_1.NotFoundException("Channel not found");
        }
        return channel;
    }
    async requireChannelMember(channelId, userId) {
        const member = await this.prisma.channelMember.findUnique({
            where: {
                channelId_userId: {
                    channelId,
                    userId,
                },
            },
        });
        if (!member) {
            throw new common_1.ForbiddenException("You are not a member of this channel");
        }
    }
    toView(message) {
        const authorName = message.User.fullName || message.User.name || message.User.email.split("@")[0] || "User";
        return {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            author: {
                name: authorName,
                email: message.User.email,
            },
        };
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        message_gateway_1.MessageGateway])
], MessageService);
//# sourceMappingURL=message.service.js.map