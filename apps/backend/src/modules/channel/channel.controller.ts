import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateChannelDto } from "./dto/create-channel.dto";
import { ChannelService } from "./channel.service";

@Controller()
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post("workspaces/:workspaceId/channels")
  create(
    @CurrentUser("userId") userId: string,
    @Param("workspaceId", new ParseUUIDPipe()) workspaceId: string,
    @Body() dto: CreateChannelDto,
  ) {
    return this.channelService.createChannel(userId, workspaceId, dto);
  }

  @Get("workspaces/:workspaceId/channels")
  list(
    @CurrentUser("userId") userId: string,
    @Param("workspaceId", new ParseUUIDPipe()) workspaceId: string,
  ) {
    return this.channelService.listChannels(userId, workspaceId);
  }

  @Post("channels/:channelId/join")
  join(
    @CurrentUser("userId") userId: string,
    @Param("channelId", new ParseUUIDPipe()) channelId: string,
  ) {
    return this.channelService.joinChannel(userId, channelId);
  }

  @Post("channels/:channelId/leave")
  leave(
    @CurrentUser("userId") userId: string,
    @Param("channelId", new ParseUUIDPipe()) channelId: string,
  ) {
    return this.channelService.leaveChannel(userId, channelId);
  }
}