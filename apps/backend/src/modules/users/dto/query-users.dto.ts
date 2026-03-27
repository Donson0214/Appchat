import { IsOptional, IsString, MaxLength } from "class-validator";

export class QueryUsersDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  q?: string;
}