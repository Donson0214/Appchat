import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { HeartbeatDto } from "./dto/heartbeat.dto";
import { SetStatusDto } from "./dto/set-status.dto";
import { PresenceService } from "./presence.service";

type AuthenticatedRequest = {
  user?: {
    sub?: string;
  };
};

@UseGuards(JwtAuthGuard)
@Controller("presence")
export class PresenceController {
  constructor(private readonly presenceService: PresenceService) {}

  @Post("heartbeat")
  async heartbeat(@Req() req: AuthenticatedRequest, @Body() dto: HeartbeatDto) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    return this.presenceService.heartbeat(userId, dto.workspaceRef);
  }

  @Post("status")
  async setStatus(@Req() req: AuthenticatedRequest, @Body() dto: SetStatusDto) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    return this.presenceService.setStatus(userId, dto);
  }

  @Get("workspaces/:workspaceRef/members")
  async listWorkspacePresence(@Req() req: AuthenticatedRequest, @Param("workspaceRef") workspaceRef: string) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    return this.presenceService.listWorkspacePresence(workspaceRef, userId);
  }
}
