import { PrismaService } from "../../database/prisma/prisma.service";
import { MembershipService } from "../membership/membership.service";
import { CreateChannelDto } from "./dto/create-channel.dto";
export declare class ChannelService {
    private readonly prisma;
    private readonly membershipService;
    constructor(prisma: PrismaService, membershipService: MembershipService);
    createChannel(userId: string, workspaceId: string, dto: CreateChannelDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ChannelType;
        createdById: string;
    }>;
    listChannels(userId: string, workspaceId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ChannelType;
        createdById: string;
    }[]>;
    joinChannel(userId: string, channelId: string): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        channelId: string;
    }>;
    leaveChannel(userId: string, channelId: string): Promise<{
        success: boolean;
    }>;
}
