import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from "@nestjs/common";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { CreateMessageDto } from "./dto/create-message.dto";
import { QueryMessagesDto } from "./dto/query-messages.dto";
import { MessageService } from "./message.service";

@Controller("channels/:channelId/messages")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  send(
    @CurrentUser("userId") userId: string,
    @Param("channelId", new ParseUUIDPipe()) channelId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messageService.sendMessage(userId, channelId, dto);
  }

  @Get()
  list(
    @CurrentUser("userId") userId: string,
    @Param("channelId", new ParseUUIDPipe()) channelId: string,
    @Query() query: QueryMessagesDto,
  ) {
    return this.messageService.getMessages(userId, channelId, query);
  }
}