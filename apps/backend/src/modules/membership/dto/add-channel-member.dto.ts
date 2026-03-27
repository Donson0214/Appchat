import { IsUUID } from "class-validator";

export class AddChannelMemberDto {
  @IsUUID()
  userId!: string;
}