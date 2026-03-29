import { IsOptional, IsString } from "class-validator";

export class HeartbeatDto {
  @IsOptional()
  @IsString()
  workspaceRef?: string;
}
