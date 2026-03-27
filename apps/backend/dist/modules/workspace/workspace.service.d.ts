import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { JoinWorkspaceDto } from "./dto/join-workspace.dto";
export declare class WorkspaceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createWorkspace(userId: string, dto: CreateWorkspaceDto): Promise<{
        defaultChannelId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        inviteCode: string;
        ownerId: string;
    }>;
    joinWorkspace(userId: string, dto: JoinWorkspaceDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        inviteCode: string;
        ownerId: string;
    }>;
    listUserWorkspaces(userId: string): Promise<{
        role: import(".prisma/client").$Enums.WorkspaceRole;
        joinedAt: Date;
        workspace: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            inviteCode: string;
            ownerId: string;
        };
    }[]>;
    listWorkspaceMembers(userId: string, workspaceId: string): Promise<({
        user: {
            name: string | null;
            id: string;
            email: string;
        };
    } & {
        id: string;
        userId: string;
        workspaceId: string;
        role: import(".prisma/client").$Enums.WorkspaceRole;
        joinedAt: Date;
    })[]>;
    private slugify;
}
