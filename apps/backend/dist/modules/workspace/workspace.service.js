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
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../database/prisma/prisma.service");
let WorkspaceService = class WorkspaceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createForUser(userId, dto) {
        const slugBase = this.normalizeSlug(dto.slug ?? dto.name);
        const slug = await this.ensureUniqueSlug(slugBase);
        const inviteCode = await this.ensureUniqueInviteCode();
        const workspace = await this.prisma.$transaction(async (tx) => {
            const created = await tx.workspace.create({
                data: {
                    name: dto.name.trim(),
                    slug,
                    inviteCode,
                    ownerId: userId,
                },
            });
            await tx.workspaceMember.create({
                data: {
                    workspaceId: created.id,
                    userId,
                    role: "ADMIN",
                },
            });
            const defaultChannels = [
                { name: "general", description: "Company-wide announcements and watercooler chat", type: client_1.ChannelType.PUBLIC },
                { name: "announcements", description: "Important company announcements", type: client_1.ChannelType.PUBLIC },
            ];
            for (const channel of defaultChannels) {
                const createdChannel = await tx.channel.create({
                    data: {
                        id: (0, crypto_1.randomUUID)(),
                        workspaceId: created.id,
                        name: channel.name,
                        description: channel.description,
                        type: channel.type,
                        createdById: userId,
                        updatedAt: new Date(),
                    },
                });
                await tx.channelMember.create({
                    data: {
                        id: (0, crypto_1.randomUUID)(),
                        channelId: createdChannel.id,
                        userId,
                    },
                });
            }
            return created;
        });
        return workspace;
    }
    async joinForUserByCode(userId, dto) {
        const code = dto.code.trim().toUpperCase();
        const workspace = await this.prisma.workspace.findUnique({
            where: { inviteCode: code },
        });
        if (!workspace) {
            throw new common_1.BadRequestException("Invalid workspace invite code");
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.workspaceMember.upsert({
                where: {
                    workspaceId_userId: {
                        workspaceId: workspace.id,
                        userId,
                    },
                },
                create: {
                    workspaceId: workspace.id,
                    userId,
                    role: "MEMBER",
                },
                update: {},
            });
            const defaultChannels = await tx.channel.findMany({
                where: {
                    workspaceId: workspace.id,
                    name: { in: ["general", "announcements"] },
                    type: client_1.ChannelType.PUBLIC,
                },
                select: { id: true },
            });
            for (const channel of defaultChannels) {
                await tx.channelMember.upsert({
                    where: {
                        channelId_userId: {
                            channelId: channel.id,
                            userId,
                        },
                    },
                    create: {
                        id: (0, crypto_1.randomUUID)(),
                        channelId: channel.id,
                        userId,
                    },
                    update: {},
                });
            }
        });
        return {
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            role: "MEMBER",
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
        };
    }
    async findMine(userId) {
        const memberships = await this.prisma.workspaceMember.findMany({
            where: { userId },
            include: { workspace: true },
            orderBy: { joinedAt: "asc" },
        });
        return memberships.map((membership) => ({
            id: membership.workspace.id,
            name: membership.workspace.name,
            slug: membership.workspace.slug,
            role: membership.role,
            createdAt: membership.workspace.createdAt,
            updatedAt: membership.workspace.updatedAt,
        }));
    }
    normalizeSlug(input) {
        const slug = input
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
        if (!slug) {
            throw new common_1.BadRequestException("Workspace slug is invalid");
        }
        return slug.slice(0, 80);
    }
    async ensureUniqueSlug(base) {
        let candidate = base;
        let suffix = 2;
        while (await this.prisma.workspace.findUnique({ where: { slug: candidate } })) {
            candidate = `${base}-${suffix}`;
            suffix += 1;
        }
        return candidate;
    }
    async ensureUniqueInviteCode() {
        let candidate = "";
        do {
            candidate = Math.random().toString(36).slice(2, 10).toUpperCase();
        } while (await this.prisma.workspace.findUnique({ where: { inviteCode: candidate } }));
        return candidate;
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map