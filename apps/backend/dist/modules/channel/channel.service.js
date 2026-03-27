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
exports.ChannelService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma/prisma.service");
const membership_service_1 = require("../membership/membership.service");
let ChannelService = class ChannelService {
    constructor(prisma, membershipService) {
        this.prisma = prisma;
        this.membershipService = membershipService;
    }
    async createChannel(userId, workspaceId, dto) {
        await this.membershipService.assertWorkspaceMember(userId, workspaceId);
        return this.prisma.$transaction(async (tx) => {
            const channel = await tx.channel.create({
                data: {
                    workspaceId,
                    name: dto.name.trim(),
                    description: dto.description?.trim() || null,
                    type: dto.type,
                    createdById: userId,
                },
            });
            await tx.channelMember.create({
                data: {
                    channelId: channel.id,
                    userId,
                },
            });
            return channel;
        });
    }
    async listChannels(userId, workspaceId) {
        await this.membershipService.assertWorkspaceMember(userId, workspaceId);
        return this.prisma.channel.findMany({
            where: {
                workspaceId,
                OR: [
                    { type: client_1.ChannelType.PUBLIC },
                    {
                        members: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
            orderBy: { createdAt: "asc" },
        });
    }
    async joinChannel(userId, channelId) {
        const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
        if (!channel) {
            throw new common_1.NotFoundException("Channel not found");
        }
        await this.membershipService.assertWorkspaceMember(userId, channel.workspaceId);
        if (channel.type === client_1.ChannelType.PRIVATE) {
            throw new common_1.ForbiddenException("Private channels require an admin invitation");
        }
        return this.prisma.channelMember.upsert({
            where: {
                channelId_userId: {
                    channelId,
                    userId,
                },
            },
            create: {
                channelId,
                userId,
            },
            update: {},
        });
    }
    async leaveChannel(userId, channelId) {
        const membership = await this.prisma.channelMember.findUnique({
            where: {
                channelId_userId: {
                    channelId,
                    userId,
                },
            },
        });
        if (!membership) {
            throw new common_1.NotFoundException("You are not a member of this channel");
        }
        const count = await this.prisma.channelMember.count({ where: { channelId } });
        if (count <= 1) {
            throw new common_1.BadRequestException("Channel must have at least one member");
        }
        await this.prisma.channelMember.delete({ where: { id: membership.id } });
        return { success: true };
    }
};
exports.ChannelService = ChannelService;
exports.ChannelService = ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        membership_service_1.MembershipService])
], ChannelService);
//# sourceMappingURL=channel.service.js.map