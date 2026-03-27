import { Module } from "@nestjs/common";
import { MembershipModule } from "../membership/membership.module";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";

@Module({
  imports: [MembershipModule],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}