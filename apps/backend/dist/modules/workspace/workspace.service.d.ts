import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { JoinWorkspaceDto } from "./dto/join-workspace.dto";
export declare class WorkspaceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createForUser(userId: string, dto: CreateWorkspaceDto): Promise<{
        id: string;
        name: string;
        slug: string;
        inviteCode: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    joinForUserByCode(userId: string, dto: JoinWorkspaceDto): Promise<{
        id: string;
        name: string;
        slug: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findMine(userId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        role: import(".prisma/client").$Enums.WorkspaceRole;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    private normalizeSlug;
    private ensureUniqueSlug;
    private ensureUniqueInviteCode;
}
