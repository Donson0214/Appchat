import { CreateChannelDto } from "./dto/create-channel.dto";
import { ChannelService } from "./channel.service";
export declare class ChannelController {
    private readonly channelService;
    constructor(channelService: ChannelService);
    create(userId: string, workspaceId: string, dto: CreateChannelDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ChannelType;
        createdById: string;
    }>;
    list(userId: string, workspaceId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
        description: string | null;
        type: import(".prisma/client").$Enums.ChannelType;
        createdById: string;
    }[]>;
    join(userId: string, channelId: string): Promise<{
        id: string;
        userId: string;
        joinedAt: Date;
        channelId: string;
    }>;
    leave(userId: string, channelId: string): Promise<{
        success: boolean;
    }>;
}
