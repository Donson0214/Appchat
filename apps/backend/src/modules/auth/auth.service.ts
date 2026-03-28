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
import { OtpPurpose } from "./dto/send-otp.dto";
import { TwilioOtpService } from "./twilio/twilio-otp.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly twilioOtpService: TwilioOtpService,
    @Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: App,
  ) {}

  async register(dto: RegisterDto) {
    await this.verifyOtpForEmailAuth(dto.phoneNumber, dto.otpCode, OtpPurpose.REGISTER);

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
    await this.verifyOtpForEmailAuth(dto.phoneNumber, dto.otpCode, OtpPurpose.LOGIN);

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

  async sendOtp(phoneNumber: string, purpose: OtpPurpose) {
    if (!this.twilioOtpService.isEnabled()) {
      throw new BadRequestException("OTP verification is disabled");
    }

    await this.twilioOtpService.sendOtp(phoneNumber);
    return { purpose };
  }

  private async verifyOtpForEmailAuth(phoneNumber: string | undefined, otpCode: string | undefined, purpose: OtpPurpose) {
    if (!this.twilioOtpService.isEnabled()) {
      return;
    }

    if (!phoneNumber || !otpCode) {
      throw new BadRequestException(`OTP code and phone number are required for ${purpose.toLowerCase()}`);
    }

    await this.twilioOtpService.verifyOtp(phoneNumber, otpCode);
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
