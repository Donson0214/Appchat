import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SendOtpDto } from "./dto/send-otp.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { FirebaseLoginDto } from "./dto/firebase-login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("login")
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("firebase")
  firebase(@Body() dto: FirebaseLoginDto) {
    return this.authService.loginWithFirebase(dto.idToken);
  }

  @Post("otp/send")
  async sendOtp(@Body() dto: SendOtpDto) {
    await this.authService.sendOtp(dto.phoneNumber, dto.purpose);
    return {
      success: true,
      purpose: dto.purpose,
      message: "OTP sent successfully",
    };
  }
}
