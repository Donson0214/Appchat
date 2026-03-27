import { IsEnum, IsOptional, IsUUID } from "class-validator";
import { WorkspaceRole } from "@prisma/client";

export class AddWorkspaceMemberDto {
  @IsUUID()
  userId!: string;

  @IsOptional()
  @IsEnum(WorkspaceRole)
  role?: WorkspaceRole;
}