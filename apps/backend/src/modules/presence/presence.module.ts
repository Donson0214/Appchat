import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PresenceController } from "./presence.controller";
import { PresenceGateway } from "./presence.gateway";
import { PresenceService } from "./presence.service";

@Module({
  imports: [JwtModule],
  controllers: [PresenceController],
  providers: [PresenceService, PresenceGateway],
  exports: [PresenceService],
})
export class PresenceModule {}
