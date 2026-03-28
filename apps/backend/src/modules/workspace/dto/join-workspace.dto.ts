import { IsString, Length, Matches } from "class-validator";

export class JoinWorkspaceDto {
  @IsString()
  @Length(6, 16)
  @Matches(/^[A-Z0-9-]+$/)
  code!: string;
}
