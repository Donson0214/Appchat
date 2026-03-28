import { PrismaService } from "../../database/prisma/prisma.service";
import { AddChannelMemberDto } from "./dto/add-channel-member.dto";
import { CreateChannelDto } from "./dto/create-channel.dto";
export declare class ChannelService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listForWorkspace(workspaceRef: string, userId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        type: import(".prisma/client").$Enums.ChannelType;
        private: boolean;
        membersCount: number;
    }[]>;
    createInWorkspace(workspaceRef: string, userId: string, dto: CreateChannelDto): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string;
        type: import(".prisma/client").$Enums.ChannelType;
        private: boolean;
    }>;
    addMember(workspaceRef: string, channelRef: string, requesterId: string, dto: AddChannelMemberDto): Promise<{
        channel: string;
        invitedEmail: string;
        invitedBy: string;
    }>;
    private normalizeChannelName;
    private resolveWorkspace;
    private requireWorkspaceMember;
    private findChannel;
}
