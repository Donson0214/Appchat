import { IsArray, IsOptional, IsUUID } from "class-validator";

export class MarkReadDto {
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  ids?: string[];
}
