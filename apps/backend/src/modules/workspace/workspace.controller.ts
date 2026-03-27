import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { JoinWorkspaceDto } from "./dto/join-workspace.dto";
import { WorkspaceService } from "./workspace.service";

@Controller("workspaces")
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  create(@CurrentUser("userId") userId: string, @Body() dto: CreateWorkspaceDto) {
    return this.workspaceService.createWorkspace(userId, dto);
  }

  @Post("join")
  join(@CurrentUser("userId") userId: string, @Body() dto: JoinWorkspaceDto) {
    return this.workspaceService.joinWorkspace(userId, dto);
  }

  @Get()
  list(@CurrentUser("userId") userId: string) {
    return this.workspaceService.listUserWorkspaces(userId);
  }

  @Get(":workspaceId/members")
  listMembers(
    @CurrentUser("userId") userId: string,
    @Param("workspaceId", new ParseUUIDPipe()) workspaceId: string,
  ) {
    return this.workspaceService.listWorkspaceMembers(userId, workspaceId);
  }
}
