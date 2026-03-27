import { AddChannelMemberDto } from "./dto/add-channel-member.dto";
import { AddWorkspaceMemberDto } from "./dto/add-workspace-member.dto";
import { UpdateWorkspaceMemberRoleDto } from "./dto/update-workspace-member-role.dto";
import { MembershipService } from "./membership.service";
export declare class MembershipController {
    private readonly membershipService;
    constructor(membershipService: MembershipService);
    addWorkspaceMember(userId: string, workspaceId: string, dto: AddWorkspaceMemberDto): Promise<{
        id: string;
        userId: string;
        workspaceId: string;
        role: import(".prisma/client").$Enums.WorkspaceRole;
        joinedAt: Date;
    }>;
    updateRole(userId: string, workspaceId: string, targetUserId: string, dto: UpdateWorkspaceMemberRoleDto): Promise<{
        id: string;
        userId: string;
        workspaceId: string;
        role: import(".prisma/client").$Enums.WorkspaceRole;
        joinedAt: Date;
    }>;
    removeWorkspaceMember(userId: string, workspaceId: string, targetUserId: string): Promise<{
        success: boolean;
    }>;
    addChannelMember(userId: string, channelId: string, dto: AddChannelMemberDto): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        channelId: string;
    }>;
    removeChannelMember(userId: string, channelId: string, targetUserId: string): Promise<{
        success: boolean;
    }>;
}
