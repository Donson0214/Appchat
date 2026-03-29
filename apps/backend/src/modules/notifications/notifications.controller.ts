import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { MarkReadDto } from "./dto/mark-read.dto";
import { NotificationsService } from "./notifications.service";

type AuthenticatedRequest = {
  user?: {
    sub?: string;
  };
};

@UseGuards(JwtAuthGuard)
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async list(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    return this.notificationsService.listForUser(userId);
  }

  @Post("read")
  async markRead(@Req() req: AuthenticatedRequest, @Body() dto: MarkReadDto) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    return this.notificationsService.markRead(userId, dto.ids);
  }

  @Post("read-all")
  async markAllRead(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }

    return this.notificationsService.markRead(userId);
  }
}
