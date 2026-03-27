import { IsUUID } from "class-validator";

export class WsJoinChannelDto {
  @IsUUID()
  channelId!: string;
}