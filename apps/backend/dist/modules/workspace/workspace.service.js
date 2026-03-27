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
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../database/prisma/prisma.service");
let WorkspaceService = class WorkspaceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createWorkspace(userId, dto) {
        const name = dto.name.trim();
        const slug = `${this.slugify(name)}-${(0, node_crypto_1.randomBytes)(3).toString("hex")}`;
        const inviteCode = (0, node_crypto_1.randomBytes)(5).toString("hex").toUpperCase();
        return this.prisma.$transaction(async (tx) => {
            const workspace = await tx.workspace.create({
                data: {
                    name,
                    slug,
                    inviteCode,
                    ownerId: userId,
                },
            });
            await tx.workspaceMember.create({
                data: {
                    workspaceId: workspace.id,
                    userId,
                    role: client_1.WorkspaceRole.ADMIN,
                },
            });
            const generalChannel = await tx.channel.create({
                data: {
                    workspaceId: workspace.id,
                    name: "general",
                    description: "Company-wide announcements and discussions",
                    type: client_1.ChannelType.PUBLIC,
                    createdById: userId,
                },
            });
            await tx.channelMember.create({
                data: {
                    channelId: generalChannel.id,
                    userId,
                },
            });
            return {
                ...workspace,
                defaultChannelId: generalChannel.id,
            };
        });
    }
    async joinWorkspace(userId, dto) {
        const workspace = await this.prisma.workspace.findUnique({
            where: { inviteCode: dto.inviteCode.toUpperCase() },
        });
        if (!workspace) {
            throw new common_1.NotFoundException("Workspace not found for invite code");
        }
        await this.prisma.workspaceMember.upsert({
            where: {
                workspaceId_userId: {
                    workspaceId: workspace.id,
                    userId,
                },
            },
            create: {
                workspaceId: workspace.id,
                userId,
                role: client_1.WorkspaceRole.MEMBER,
            },
            update: {},
        });
        return workspace;
    }
    async listUserWorkspaces(userId) {
        const memberships = await this.prisma.workspaceMember.findMany({
            where: { userId },
            include: {
                workspace: true,
            },
            orderBy: {
                joinedAt: "desc",
            },
        });
        return memberships.map((membership) => ({
            role: membership.role,
            joinedAt: membership.joinedAt,
            workspace: membership.workspace,
        }));
    }
    async listWorkspaceMembers(userId, workspaceId) {
        const membership = await this.prisma.workspaceMember.findUnique({
            where: {
                workspaceId_userId: {
                    workspaceId,
                    userId,
                },
            },
        });
        if (!membership) {
            throw new common_1.NotFoundException("Workspace not found or access denied");
        }
        return this.prisma.workspaceMember.findMany({
            where: { workspaceId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                joinedAt: "asc",
            },
        });
    }
    slugify(value) {
        return value
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 40);
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map