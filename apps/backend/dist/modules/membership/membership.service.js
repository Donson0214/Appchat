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
exports.MembershipService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../database/prisma/prisma.service");
let MembershipService = class MembershipService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertWorkspaceMember(userId, workspaceId) {
        const member = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId,
                },
            },
        });
        if (!member) {
            throw new common_1.ForbiddenException("You are not a member of this workspace");
        }
        return member;
    }
    async assertWorkspaceAdmin(userId, workspaceId) {
        const member = await this.assertWorkspaceMember(userId, workspaceId);
        if (member.role !== client_1.WorkspaceRole.ADMIN) {
            throw new common_1.ForbiddenException("Admin role required");
        }
        return member;
    }
    async assertChannelMember(userId, channelId) {
        const membership = await this.prisma.channelMember.findUnique({
            where: {
                channelId_userId: {
                    channelId,
                    userId,
                },
            },
        });
        if (!membership) {
            throw new common_1.ForbiddenException("You are not a member of this channel");
        }
        return membership;
    }
    async addWorkspaceMember(actorUserId, workspaceId, dto) {
        await this.assertWorkspaceAdmin(actorUserId, workspaceId);
        const targetUser = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!targetUser) {
            throw new common_1.NotFoundException("Target user not found");
        }
        return this.prisma.workspaceMember.upsert({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: dto.userId,
                },
            },
            create: {
                workspaceId,
                userId: dto.userId,
                role: dto.role ?? client_1.WorkspaceRole.MEMBER,
            },
            update: {
                role: dto.role,
            },
        });
    }
    async updateWorkspaceMemberRole(actorUserId, workspaceId, targetUserId, dto) {
        await this.assertWorkspaceAdmin(actorUserId, workspaceId);
        const existing = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: targetUserId,
                },
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException("Workspace membership not found");
        }
        return this.prisma.workspaceMember.update({
            where: { id: existing.id },
            data: { role: dto.role },
        });
    }
    async removeWorkspaceMember(actorUserId, workspaceId, targetUserId) {
        await this.assertWorkspaceAdmin(actorUserId, workspaceId);
        const target = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId: targetUserId,
                },
            },
        });
        if (!target) {
            throw new common_1.NotFoundException("Workspace membership not found");
        }
        if (target.role === client_1.WorkspaceRole.ADMIN) {
            const adminCount = await this.prisma.workspaceMember.count({
                where: {
                    workspaceId,
                    role: client_1.WorkspaceRole.ADMIN,
                },
            });
            if (adminCount <= 1) {
                throw new common_1.BadRequestException("Workspace must have at least one admin");
            }
        }
        await this.prisma.workspaceMember.delete({ where: { id: target.id } });
        return { success: true };
    }
    async addUserToPrivateChannel(actorUserId, channelId, dto) {
        const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
        if (!channel) {
            throw new common_1.NotFoundException("Channel not found");
        }
        if (channel.type !== client_1.ChannelType.PRIVATE) {
            throw new common_1.BadRequestException("Manual membership is only required for private channels");
        }
        await this.assertWorkspaceAdmin(actorUserId, channel.workspaceId);
        await this.assertWorkspaceMember(dto.userId, channel.workspaceId);
        return this.prisma.channelMember.upsert({
            where: {
                channelId_userId: {
                    channelId,
                    userId: dto.userId,
                },
            },
            create: {
                channelId,
                userId: dto.userId,
            },
            update: {},
        });
    }
    async removeUserFromChannel(actorUserId, channelId, targetUserId) {
        const channel = await this.prisma.channel.findUnique({ where: { id: channelId } });
        if (!channel) {
            throw new common_1.NotFoundException("Channel not found");
        }
        await this.assertWorkspaceAdmin(actorUserId, channel.workspaceId);
        const membership = await this.prisma.channelMember.findUnique({
            where: {
                channelId_userId: {
                    channelId,
                    userId: targetUserId,
                },
            },
        });
        if (!membership) {
            throw new common_1.NotFoundException("Channel membership not found");
        }
        await this.prisma.channelMember.delete({ where: { id: membership.id } });
        return { success: true };
    }
};
exports.MembershipService = MembershipService;
exports.MembershipService = MembershipService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MembershipService);
//# sourceMappingURL=membership.service.js.map