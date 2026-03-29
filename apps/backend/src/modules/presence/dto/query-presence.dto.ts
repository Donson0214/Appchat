import { IsOptional, IsString } from "class-validator";

export class QueryPresenceDto {
  @IsOptional()
  @IsString()
  workspaceRef?: string;
}
