import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { JoinWorkspaceDto } from "./dto/join-workspace.dto";
import { WorkspaceService } from "./workspace.service";
type AuthenticatedRequest = {
    user?: {
        sub?: string;
    };
};
export declare class WorkspaceController {
    private readonly workspaceService;
    constructor(workspaceService: WorkspaceService);
    create(req: AuthenticatedRequest, dto: CreateWorkspaceDto): Promise<{
        id: string;
        name: string;
        slug: string;
        inviteCode: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    mine(req: AuthenticatedRequest): Promise<{
        id: string;
        name: string;
        slug: string;
        role: import(".prisma/client").$Enums.WorkspaceRole;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    join(req: AuthenticatedRequest, dto: JoinWorkspaceDto): Promise<{
        id: string;
        name: string;
        slug: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
