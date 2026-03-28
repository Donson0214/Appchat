import { IsEnum, IsString } from "class-validator";

export enum OtpPurpose {
  REGISTER = "REGISTER",
  LOGIN = "LOGIN",
}

export class SendOtpDto {
  @IsString()
  phoneNumber!: string;

  @IsEnum(OtpPurpose)
  purpose!: OtpPurpose;
}
