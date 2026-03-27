import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import type { App } from "firebase-admin/app";
import { PrismaService } from "../../database/prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly firebaseAdmin;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, firebaseAdmin: App);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            fullName: string | null;
            avatarUrl: string | null;
            provider: import(".prisma/client").$Enums.AuthProvider;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            fullName: string | null;
            avatarUrl: string | null;
            provider: import(".prisma/client").$Enums.AuthProvider;
        };
    }>;
    loginWithFirebase(idToken: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            fullName: string | null;
            avatarUrl: string | null;
            provider: import(".prisma/client").$Enums.AuthProvider;
        };
    }>;
    private buildAuthResponse;
}
