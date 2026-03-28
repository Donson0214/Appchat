import { PrismaService } from "../../database/prisma/prisma.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageGateway } from "./message.gateway";
export declare class MessageService {
    private readonly prisma;
    private readonly messageGateway;
    constructor(prisma: PrismaService, messageGateway: MessageGateway);
    list(workspaceRef: string, channelRef: string, userId: string): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        author: {
            name: string;
            email: string;
        };
    }[]>;
    create(workspaceRef: string, channelRef: string, userId: string, dto: CreateMessageDto): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        author: {
            name: string;
            email: string;
        };
    }>;
    private resolveChannel;
    private requireChannelMember;
    private toView;
}
