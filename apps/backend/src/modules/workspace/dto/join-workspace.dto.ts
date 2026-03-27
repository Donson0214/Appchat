import { IsString, Length } from "class-validator";

export class JoinWorkspaceDto {
  @IsString()
  @Length(10, 10)
  inviteCode!: string;
}