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
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../database/prisma/prisma.service");
let ChannelService = class ChannelService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listForWorkspace(workspaceRef, userId) {
        const workspace = await this.resolveWorkspace(workspaceRef);
        await this.requireWorkspaceMember(workspace.id, userId);
        const channels = await this.prisma.channel.findMany({
            where: {
                workspaceId: workspace.id,
                OR: [
                    { type: client_1.ChannelType.PUBLIC },
                    {
                        ChannelMember: {
                            some: {
                                userId,
                            },
                        },
                    },
                ],
            },
            orderBy: { name: "asc" },
            include: {
                ChannelMember: {
                    select: { id: true },
                },
            },
        });
        return channels.map((channel) => ({
            id: channel.id,
            name: channel.name,
            slug: channel.name,
            description: channel.description ?? "",
            type: channel.type,
            private: channel.type === client_1.ChannelType.PRIVATE,
            membersCount: channel.ChannelMember.length,
        }));
    }
    async createInWorkspace(workspaceRef, userId, dto) {
        const workspace = await this.resolveWorkspace(workspaceRef);
        await this.requireWorkspaceMember(workspace.id, userId);
        const name = this.normalizeChannelName(dto.name);
        const existing = await this.prisma.channel.findFirst({
            where: {
                workspaceId: workspace.id,
                name,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException("Channel already exists");
        }
        const now = new Date();
        const channel = await this.prisma.channel.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                workspaceId: workspace.id,
                name,
                description: dto.description?.trim() || null,
                type: dto.type ?? client_1.ChannelType.PUBLIC,
                createdById: userId,
                updatedAt: now,
            },
        });
        await this.prisma.channelMember.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                channelId: channel.id,
                userId,
            },
        });
        return {
            id: channel.id,
            name: channel.name,
            slug: channel.name,
            description: channel.description ?? "",
            type: channel.type,
            private: channel.type === client_1.ChannelType.PRIVATE,
        };
    }
    async addMember(workspaceRef, channelRef, requesterId, dto) {
        const workspace = await this.resolveWorkspace(workspaceRef);
        const requesterMembership = await this.requireWorkspaceMember(workspace.id, requesterId);
        const channel = await this.findChannel(workspace.id, channelRef);
        const email = dto.email.toLowerCase().trim();
        const user = await this.prisma.user.upsert({
            where: { email },
            create: {
                id: (0, crypto_1.randomUUID)(),
                email,
                provider: "EMAIL",
            },
            update: {},
        });
        const existingWorkspaceMember = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId: workspace.id,
                    userId: user.id,
                },
            },
        });
        if (!existingWorkspaceMember) {
            await this.prisma.workspaceMember.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    workspaceId: workspace.id,
                    userId: user.id,
                    role: client_1.WorkspaceRole.MEMBER,
                },
            });
        }
        const existingChannelMember = await this.prisma.channelMember.findUnique({
            where: {
                channelId_userId: {
                    channelId: channel.id,
                    userId: user.id,
                },
            },
        });
        if (!existingChannelMember) {
            await this.prisma.channelMember.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    channelId: channel.id,
                    userId: user.id,
                },
            });
        }
        return {
            channel: channel.name,
            invitedEmail: user.email,
            invitedBy: requesterMembership.userId,
        };
    }
    normalizeChannelName(raw) {
        const slug = raw
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
        if (!slug) {
            throw new common_1.BadRequestException("Invalid channel name");
        }
        return slug.slice(0, 80);
    }
    async resolveWorkspace(workspaceRef) {
        const workspace = await this.prisma.workspace.findFirst({
            where: {
                OR: [{ id: workspaceRef }, { slug: workspaceRef }],
            },
        });
        if (!workspace) {
            throw new common_1.NotFoundException("Workspace not found");
        }
        return workspace;
    }
    async requireWorkspaceMember(workspaceId, userId) {
        const membership = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId,
                },
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException("You are not a member of this workspace");
        }
        return membership;
    }
    async findChannel(workspaceId, channelRef) {
        const normalized = this.normalizeChannelName(channelRef);
        const channel = await this.prisma.channel.findFirst({
            where: {
                workspaceId,
                OR: [{ id: channelRef }, { name: normalized }],
            },
        });
        if (!channel) {
            throw new common_1.NotFoundException("Channel not found");
        }
        return channel;
    }
};
exports.ChannelService = ChannelService;
exports.ChannelService = ChannelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChannelService);
//# sourceMappingURL=channel.service.js.map