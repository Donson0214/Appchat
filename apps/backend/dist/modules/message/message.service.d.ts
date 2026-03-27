import { PrismaService } from "../../database/prisma/prisma.service";
import { MembershipService } from "../membership/membership.service";
import { CreateMessageDto } from "./dto/create-message.dto";
import { QueryMessagesDto } from "./dto/query-messages.dto";
export declare class MessageService {
    private readonly prisma;
    private readonly membershipService;
    constructor(prisma: PrismaService, membershipService: MembershipService);
    ensureChannelMember(userId: string, channelId: string): Promise<void>;
    sendMessage(userId: string, channelId: string, dto: CreateMessageDto): Promise<{
        user: {
            name: string | null;
            id: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        channelId: string;
        content: string;
    }>;
    getMessages(userId: string, channelId: string, query: QueryMessagesDto): Promise<{
        data: ({
            user: {
                name: string | null;
                id: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            channelId: string;
            content: string;
        })[];
        nextCursor: string | null;
    }>;
}
