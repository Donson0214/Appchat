import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { NotificationsModule } from "../notifications/notifications.module";
import { MessageController } from "./message.controller";
import { MessageGateway } from "./message.gateway";
import { MessageService } from "./message.service";

@Module({
  imports: [JwtModule, NotificationsModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
})
export class MessageModule {}
