import { QueryUsersDto } from "./dto/query-users.dto";
import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(userId: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        createdAt: Date;
    }>;
    list(query: QueryUsersDto): Promise<{
        name: string | null;
        id: string;
        email: string;
        createdAt: Date;
    }[]>;
}
