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
const prisma_service_1 = require("../../database/prisma/prisma.service");
const membership_service_1 = require("../membership/membership.service");
let MessageService = class MessageService {
    constructor(prisma, membershipService) {
        this.prisma = prisma;
        this.membershipService = membershipService;
    }
    async ensureChannelMember(userId, channelId) {
        await this.membershipService.assertChannelMember(userId, channelId);
    }
    async sendMessage(userId, channelId, dto) {
        await this.ensureChannelMember(userId, channelId);
        return this.prisma.message.create({
            data: {
                userId,
                channelId,
                content: dto.content.trim(),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });
    }
    async getMessages(userId, channelId, query) {
        await this.ensureChannelMember(userId, channelId);
        const limit = query.limit ?? 20;
        const messages = await this.prisma.message.findMany({
            where: { channelId },
            orderBy: { createdAt: "desc" },
            take: limit,
            ...(query.cursor
                ? {
                    skip: 1,
                    cursor: { id: query.cursor },
                }
                : {}),
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });
        const nextCursor = messages.length === limit ? messages[messages.length - 1]?.id ?? null : null;
        return {
            data: [...messages].reverse(),
            nextCursor,
        };
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        membership_service_1.MembershipService])
], MessageService);
//# sourceMappingURL=message.service.js.map