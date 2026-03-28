import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AddChannelMemberDto } from "./dto/add-channel-member.dto";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { ChannelService } from "./channel.service";

type AuthenticatedRequest = {
  user?: {
    sub?: string;
  };
};

@UseGuards(JwtAuthGuard)
@Controller()
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get("workspaces/:workspaceId/channels")
  async list(
    @Param("workspaceId") workspaceId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.channelService.listForWorkspace(workspaceId, userId);
  }

  @Post("workspaces/:workspaceId/channels")
  async create(
    @Param("workspaceId") workspaceId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateChannelDto,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.channelService.createInWorkspace(workspaceId, userId, dto);
  }

  @Post("workspaces/:workspaceId/channels/:channelRef/members")
  async inviteMember(
    @Param("workspaceId") workspaceId: string,
    @Param("channelRef") channelRef: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: AddChannelMemberDto,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.channelService.addMember(workspaceId, channelRef, userId, dto);
  }
}
