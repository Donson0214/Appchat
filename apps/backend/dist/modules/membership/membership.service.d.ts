import { PrismaService } from "../../database/prisma/prisma.service";
import { AddChannelMemberDto } from "./dto/add-channel-member.dto";
import { AddWorkspaceMemberDto } from "./dto/add-workspace-member.dto";
import { UpdateWorkspaceMemberRoleDto } from "./dto/update-workspace-member-role.dto";
export declare class MembershipService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    assertWorkspaceMember(userId: string, workspaceId: string): Promise<{
        id: string;
        userId: string;
        workspaceId: string;
        role: import(".prisma/client").$Enums.WorkspaceRole;
        joinedAt: Date;
    }>;
    assertWorkspaceAdmin(userId: string, workspaceId: string): Promise<{
        id: string;
        userId: string;
        workspaceId: string;
        role: import(".prisma/client").$Enums.WorkspaceRole;
        joinedAt: Date;
    }>;
    assertChannelMember(userId: string, channelId: string): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        channelId: string;
    }>;
    addWorkspaceMember(actorUserId: string, workspaceId: string, dto: AddWorkspaceMemberDto): Promise<{
        id: string;
        userId: string;
        workspaceId: string;
        role: import(".prisma/client").$Enums.WorkspaceRole;
        joinedAt: Date;
    }>;
    updateWorkspaceMemberRole(actorUserId: string, workspaceId: string, targetUserId: string, dto: UpdateWorkspaceMemberRoleDto): Promise<{
        id: string;
        userId: string;
        workspaceId: string;
        role: import(".prisma/client").$Enums.WorkspaceRole;
        joinedAt: Date;
    }>;
    removeWorkspaceMember(actorUserId: string, workspaceId: string, targetUserId: string): Promise<{
        success: boolean;
    }>;
    addUserToPrivateChannel(actorUserId: string, channelId: string, dto: AddChannelMemberDto): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        channelId: string;
    }>;
    removeUserFromChannel(actorUserId: string, channelId: string, targetUserId: string): Promise<{
        success: boolean;
    }>;
}
