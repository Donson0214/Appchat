import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { JoinWorkspaceDto } from "./dto/join-workspace.dto";
import { WorkspaceService } from "./workspace.service";

type AuthenticatedRequest = {
  user?: {
    sub?: string;
  };
};

@UseGuards(JwtAuthGuard)
@Controller("workspaces")
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateWorkspaceDto) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.workspaceService.createForUser(userId, dto);
  }

  @Get("me")
  async mine(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.workspaceService.findMine(userId);
  }

  @Post("join")
  async join(@Req() req: AuthenticatedRequest, @Body() dto: JoinWorkspaceDto) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("Unauthorized");
    }
    return this.workspaceService.joinForUserByCode(userId, dto);
  }
}
