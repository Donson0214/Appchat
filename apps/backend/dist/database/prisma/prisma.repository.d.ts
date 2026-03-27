import { PrismaService } from "./prisma.service";
export declare class PrismaRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    get db(): PrismaService;
}
