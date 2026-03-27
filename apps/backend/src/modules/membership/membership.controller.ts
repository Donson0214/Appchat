import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { AddChannelMemberDto } from "./dto/add-channel-member.dto";
import { AddWorkspaceMemberDto } from "./dto/add-workspace-member.dto";
import { UpdateWorkspaceMemberRoleDto } from "./dto/update-workspace-member-role.dto";
import { MembershipService } from "./membership.service";

@Controller()
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  @Post("workspaces/:workspaceId/members")
  addWorkspaceMember(
    @CurrentUser("userId") userId: string,
    @Param("workspaceId", new ParseUUIDPipe()) workspaceId: string,
    @Body() dto: AddWorkspaceMemberDto,
  ) {
    return this.membershipService.addWorkspaceMember(userId, workspaceId, dto);
  }

  @Patch("workspaces/:workspaceId/members/:targetUserId/role")
  updateRole(
    @CurrentUser("userId") userId: string,
    @Param("workspaceId", new ParseUUIDPipe()) workspaceId: string,
    @Param("targetUserId", new ParseUUIDPipe()) targetUserId: string,
    @Body() dto: UpdateWorkspaceMemberRoleDto,
  ) {
    return this.membershipService.updateWorkspaceMemberRole(
      userId,
      workspaceId,
      targetUserId,
      dto,
    );
  }

  @Delete("workspaces/:workspaceId/members/:targetUserId")
  removeWorkspaceMember(
    @CurrentUser("userId") userId: string,
    @Param("workspaceId", new ParseUUIDPipe()) workspaceId: string,
    @Param("targetUserId", new ParseUUIDPipe()) targetUserId: string,
  ) {
    return this.membershipService.removeWorkspaceMember(userId, workspaceId, targetUserId);
  }

  @Post("channels/:channelId/members")
  addChannelMember(
    @CurrentUser("userId") userId: string,
    @Param("channelId", new ParseUUIDPipe()) channelId: string,
    @Body() dto: AddChannelMemberDto,
  ) {
    return this.membershipService.addUserToPrivateChannel(userId, channelId, dto);
  }

  @Delete("channels/:channelId/members/:targetUserId")
  removeChannelMember(
    @CurrentUser("userId") userId: string,
    @Param("channelId", new ParseUUIDPipe()) channelId: string,
    @Param("targetUserId", new ParseUUIDPipe()) targetUserId: string,
  ) {
    return this.membershipService.removeUserFromChannel(userId, channelId, targetUserId);
  }
}