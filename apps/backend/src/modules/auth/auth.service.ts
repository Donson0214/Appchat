import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { getAuth } from "firebase-admin/auth";
import type { App } from "firebase-admin/app";
import { StringValue } from "ms";
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
    const email = dto.email.toLowerCase().trim();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException("Email already in use");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name: dto.name?.trim() || null,
      },
    });

    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.buildAuthResponse(user);
  }

  async loginWithFirebase(idToken: string) {
    const decoded = await getAuth(this.firebaseAdmin).verifyIdToken(idToken, true);
    const email = decoded.email?.toLowerCase().trim();

    if (!email) {
      throw new UnauthorizedException("Firebase token missing email");
    }

    const user = await this.prisma.user.upsert({
      where: { email },
      create: {
        email,
        name: decoded.name ?? null,
        passwordHash: null,
      },
      update: {
        name: decoded.name ?? undefined,
      },
    });

    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("JWT_SECRET") ?? "dev-secret",
      expiresIn: (this.configService.get<string>("JWT_EXPIRES_IN") ?? "7d") as StringValue,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
