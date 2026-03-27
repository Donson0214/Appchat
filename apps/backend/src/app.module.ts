import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { PrismaModule } from "./database/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ChannelModule } from "./modules/channel/channel.module";
import { MembershipModule } from "./modules/membership/membership.module";
import { MessageModule } from "./modules/message/message.module";
import { UsersModule } from "./modules/users/users.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    WorkspaceModule,
    MembershipModule,
    ChannelModule,
    MessageModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}