import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { JoinWorkspaceDto } from "./dto/join-workspace.dto";
import { WorkspaceService } from "./workspace.service";
export declare class WorkspaceController {
    private readonly workspaceService;
    constructor(workspaceService: WorkspaceService);
    create(userId: string, dto: CreateWorkspaceDto): Promise<{
        defaultChannelId: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        inviteCode: string;
        ownerId: string;
    }>;
    join(userId: string, dto: JoinWorkspaceDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        inviteCode: string;
        ownerId: string;
    }>;
    list(userId: string): Promise<{
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
    listMembers(userId: string, workspaceId: string): Promise<({
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
}
