import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "../../database/prisma/prisma.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { firebaseAdminProvider } from "./firebase/firebase-admin.provider";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET") ?? "",
        signOptions: {
          expiresIn:
            (configService.get<string>("JWT_EXPIRES_IN") as
              | `${number}ms`
              | `${number}s`
              | `${number}m`
              | `${number}h`
              | `${number}d`) ?? "15m",
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, firebaseAdminProvider],
  exports: [AuthService],
})
export class AuthModule {}
