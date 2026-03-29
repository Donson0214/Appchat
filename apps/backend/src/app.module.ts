import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./database/prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ChannelModule } from "./modules/channel/channel.module";
import { MessageModule } from "./modules/message/message.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { PresenceModule } from "./modules/presence/presence.module";
import { WorkspaceModule } from "./modules/workspace/workspace.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ChannelModule,
    MessageModule,
    NotificationsModule,
    PresenceModule,
    WorkspaceModule,
  ],
})
export class AppModule {}
