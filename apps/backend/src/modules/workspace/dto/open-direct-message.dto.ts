import { IsUUID } from "class-validator";

export class OpenDirectMessageDto {
  @IsUUID()
  memberId!: string;
}

