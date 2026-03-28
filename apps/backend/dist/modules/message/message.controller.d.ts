import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageService } from "./message.service";
type AuthenticatedRequest = {
    user?: {
        sub?: string;
    };
};
export declare class MessageController {
    private readonly messageService;
    constructor(messageService: MessageService);
    list(workspaceId: string, channelRef: string, req: AuthenticatedRequest): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        author: {
            name: string;
            email: string;
        };
    }[]>;
    create(workspaceId: string, channelRef: string, req: AuthenticatedRequest, dto: CreateMessageDto): Promise<{
        id: string;
        content: string;
        createdAt: Date;
        author: {
            name: string;
            email: string;
        };
    }>;
}
export {};
