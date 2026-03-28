import { AddChannelMemberDto } from "./dto/add-channel-member.dto";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { ChannelService } from "./channel.service";
type AuthenticatedRequest = {
    user?: {
        sub?: string;
    };
};
export declare class ChannelController {
    private readonly channelService;
    constructor(channelService: ChannelService);
    list(workspaceId: string, req: AuthenticatedRequest): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        type: import(".prisma/client").$Enums.ChannelType;
        private: boolean;
        membersCount: number;
    }[]>;
    create(workspaceId: string, req: AuthenticatedRequest, dto: CreateChannelDto): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        type: import(".prisma/client").$Enums.ChannelType;
        private: boolean;
    }>;
    inviteMember(workspaceId: string, channelRef: string, req: AuthenticatedRequest, dto: AddChannelMemberDto): Promise<{
        channel: string;
        invitedEmail: string;
        invitedBy: string;
    }>;
}
export {};
