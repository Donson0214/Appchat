import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MembershipModule } from "../membership/membership.module";
import { MessageController } from "./message.controller";
import { MessageGateway } from "./message.gateway";
import { MessageService } from "./message.service";

@Module({
  imports: [ConfigModule, JwtModule, MembershipModule],
  controllers: [MessageController],
  providers: [MessageService, MessageGateway],
  exports: [MessageService],
})
export class MessageModule {}