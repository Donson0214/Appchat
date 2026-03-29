import { Body, Controller, Delete, Get, Param, Post, Query, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
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

  @Get("workspaces/:workspaceId/channels/:channelRef/messages/:messageId/thread")
  async thread(
    @Param("workspaceId") workspaceId: string,
    @Param("channelRef") channelRef: string,
    @Param("messageId") messageId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.messageService.getThread(workspaceId, channelRef, messageId, userId);
  }

  @Post("workspaces/:workspaceId/channels/:channelRef/messages/:messageId/replies")
  async createReply(
    @Param("workspaceId") workspaceId: string,
    @Param("channelRef") channelRef: string,
    @Param("messageId") messageId: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateMessageDto,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.messageService.createReply(workspaceId, channelRef, messageId, userId, dto);
  }

  @Post("workspaces/:workspaceId/channels/:channelRef/messages/:messageId/reactions")
  async addReaction(
    @Param("workspaceId") workspaceId: string,
    @Param("channelRef") channelRef: string,
    @Param("messageId") messageId: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: { emoji?: string },
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.messageService.addReaction(workspaceId, channelRef, messageId, userId, body.emoji ?? "");
  }

  @Delete("workspaces/:workspaceId/channels/:channelRef/messages/:messageId/reactions/:emoji")
  async removeReaction(
    @Param("workspaceId") workspaceId: string,
    @Param("channelRef") channelRef: string,
    @Param("messageId") messageId: string,
    @Param("emoji") emoji: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.messageService.removeReaction(workspaceId, channelRef, messageId, userId, emoji);
  }

  @Post("workspaces/:workspaceId/channels/:channelRef/messages/:messageId/pin")
  async pinMessage(
    @Param("workspaceId") workspaceId: string,
    @Param("channelRef") channelRef: string,
    @Param("messageId") messageId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.messageService.pinMessage(workspaceId, channelRef, messageId, userId);
  }

  @Delete("workspaces/:workspaceId/channels/:channelRef/messages/:messageId/pin")
  async unpinMessage(
    @Param("workspaceId") workspaceId: string,
    @Param("channelRef") channelRef: string,
    @Param("messageId") messageId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.messageService.unpinMessage(workspaceId, channelRef, messageId, userId);
  }

  @Get("workspaces/:workspaceId/channels/:channelRef/pins")
  async listPins(
    @Param("workspaceId") workspaceId: string,
    @Param("channelRef") channelRef: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.messageService.listPinned(workspaceId, channelRef, userId);
  }

  @Get("workspaces/:workspaceId/search")
  async search(
    @Param("workspaceId") workspaceId: string,
    @Query("scope") scope: string | undefined,
    @Query("q") q: string | undefined,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    const normalizedScope = scope === "people" || scope === "channels" ? scope : "messages";
    return this.messageService.searchWorkspace(workspaceId, userId, q ?? "", normalizedScope);
  }

  @Get("workspaces/:workspaceId/mentions/suggest")
  async suggestMentions(
    @Param("workspaceId") workspaceId: string,
    @Query("q") q: string | undefined,
    @Query("channelRef") channelRef: string | undefined,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.messageService.suggestMentions(workspaceId, userId, q ?? "", channelRef);
  }

  @Post("workspaces/:workspaceId/channels/:channelRef/mentions/resolve")
  async resolveMentions(
    @Param("workspaceId") workspaceId: string,
    @Param("channelRef") channelRef: string,
    @Body() body: { content?: string },
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.messageService.resolveMentionsPreview(
      workspaceId,
      channelRef,
      userId,
      body.content?.toString() ?? "",
    );
  }
}
