import { PrismaService } from "../../database/prisma/prisma.service";
import { QueryUsersDto } from "./dto/query-users.dto";
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        name: string | null;
        id: string;
        email: string;
        createdAt: Date;
    }>;
    listUsers(query: QueryUsersDto): Promise<{
        name: string | null;
        id: string;
        email: string;
        createdAt: Date;
    }[]>;
}
