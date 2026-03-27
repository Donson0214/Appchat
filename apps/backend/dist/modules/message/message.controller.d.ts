import { CreateMessageDto } from "./dto/create-message.dto";
import { QueryMessagesDto } from "./dto/query-messages.dto";
import { MessageService } from "./message.service";
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    send(userId: string, channelId: string, dto: CreateMessageDto): Promise<{
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
    list(userId: string, channelId: string, query: QueryMessagesDto): Promise<{
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
