import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { FirebaseLoginDto } from "./dto/firebase-login.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            fullName: string | null;
            avatarUrl: string | null;
            provider: import(".prisma/client").$Enums.AuthProvider | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            fullName: string | null;
            avatarUrl: string | null;
            provider: import(".prisma/client").$Enums.AuthProvider | null;
        };
    }>;
    firebase(dto: FirebaseLoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            fullName: string | null;
            avatarUrl: string | null;
            provider: import(".prisma/client").$Enums.AuthProvider | null;
        };
    }>;
}
