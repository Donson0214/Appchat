import { Body, Controller, Get, Param, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateMessageDto } from "./dto/create-message.dto";
import { MessageService } from "./message.service";

type AuthenticatedRequest = {
  user?: {
    sub?: string;
  };
};

@UseGuards(JwtAuthGuard)
@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get("workspaces/:workspaceId/channels/:channelRef/messages")
  async list(
    @Param("workspaceId") workspaceId: string,
    @Param("channelRef") channelRef: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.messageService.list(workspaceId, channelRef, userId);
  }

  @Post("workspaces/:workspaceId/channels/:channelRef/messages")
  async create(
    @Param("workspaceId") workspaceId: string,
    @Param("channelRef") channelRef: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateMessageDto,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.messageService.create(workspaceId, channelRef, userId, dto);
  }
}
