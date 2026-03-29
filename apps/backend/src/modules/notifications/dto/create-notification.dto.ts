import { IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateNotificationDto {
  @IsUUID()
  userId!: string;

  @IsUUID()
  workspaceId!: string;

  @IsUUID()
  channelId!: string;

  @IsUUID()
  messageId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  mentionKey?: string;

  @IsString()
  @MaxLength(300)
  preview!: string;
}
