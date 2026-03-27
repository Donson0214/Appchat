import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import type { App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { PrismaService } from "../../database/prisma/prisma.service";
import { FIREBASE_ADMIN } from "./firebase/firebase-admin.provider";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: App,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException("Email already in use");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        passwordHash,
        provider: "EMAIL",
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.buildAuthResponse(user);
  }

  async loginWithFirebase(idToken: string) {
    const decoded = await getAuth(this.firebaseAdmin).verifyIdToken(idToken, true);
    const email = decoded.email?.toLowerCase();

    if (!email) {
      throw new UnauthorizedException("Firebase token missing email");
    }

    const fullName = decoded.name ?? null;
    const avatarUrl = decoded.picture ?? null;

    const user = await this.prisma.user.upsert({
      where: { email },
      create: {
        email,
        fullName,
        avatarUrl,
        provider: "GOOGLE",
      },
      update: {
        fullName: fullName ?? undefined,
        avatarUrl: avatarUrl ?? undefined,
        provider: "GOOGLE",
      },
    });

    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: User) {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_SECRET") ?? "",
      expiresIn:
        (this.configService.get<string>("JWT_EXPIRES_IN") as
          | `${number}ms`
          | `${number}s`
          | `${number}m`
          | `${number}h`
          | `${number}d`) ?? "15m",
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        provider: user.provider,
      },
    };
  }
}
