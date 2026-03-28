import { BadRequestException, Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Twilio from "twilio";

@Injectable()
export class TwilioOtpService {
  constructor(private readonly configService: ConfigService) {}

  isEnabled(): boolean {
    return this.configService.get<string>("AUTH_OTP_ENABLED") === "true";
  }

  private getClient(): Twilio.Twilio {
    const accountSid = this.configService.get<string>("TWILIO_ACCOUNT_SID");
    const authToken = this.configService.get<string>("TWILIO_AUTH_TOKEN");

    if (!accountSid || !authToken) {
      throw new ServiceUnavailableException("Twilio OTP is not configured");
    }

    return Twilio(accountSid, authToken);
  }

  private getVerifyServiceSid(): string {
    const verifyServiceSid = this.configService.get<string>("TWILIO_VERIFY_SERVICE_SID");

    if (!verifyServiceSid) {
      throw new ServiceUnavailableException("Twilio Verify Service SID is not configured");
    }

    // Twilio Verify Service SID format: VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    if (!/^VA[a-fA-F0-9]{32}$/.test(verifyServiceSid)) {
      throw new ServiceUnavailableException("TWILIO_VERIFY_SERVICE_SID is invalid. Expected format starts with VA...");
    }

    return verifyServiceSid;
  }

  private normalizePhoneNumber(value: string): string {
    const phoneNumber = value.trim();
    const e164Regex = /^\+[1-9]\d{7,14}$/;

    if (!e164Regex.test(phoneNumber)) {
      throw new BadRequestException("Phone number must be E.164 format (example: +639171234567)");
    }

    return phoneNumber;
  }

  async sendOtp(rawPhoneNumber: string): Promise<void> {
    const phoneNumber = this.normalizePhoneNumber(rawPhoneNumber);
    const client = this.getClient();
    const verifyServiceSid = this.getVerifyServiceSid();

    try {
      await client.verify.v2.services(verifyServiceSid).verifications.create({
        to: phoneNumber,
        channel: "sms",
      });
    } catch (error: any) {
      const status = error?.status;
      const message = error?.message ?? "Failed to send OTP";

      if (status === 400) {
        throw new BadRequestException(`Twilio rejected OTP request: ${message}`);
      }

      throw new ServiceUnavailableException(`Twilio OTP service unavailable: ${message}`);
    }
  }

  async verifyOtp(rawPhoneNumber: string, otpCode: string): Promise<void> {
    const phoneNumber = this.normalizePhoneNumber(rawPhoneNumber);
    const code = otpCode.trim();

    if (!code) {
      throw new BadRequestException("OTP code is required");
    }

    const client = this.getClient();
    const verifyServiceSid = this.getVerifyServiceSid();

    let result: { status?: string };
    try {
      result = await client.verify.v2.services(verifyServiceSid).verificationChecks.create({
        to: phoneNumber,
        code,
      });
    } catch (error: any) {
      const status = error?.status;
      const message = error?.message ?? "Failed to verify OTP";

      if (status === 400) {
        throw new BadRequestException(`OTP verification failed: ${message}`);
      }

      throw new ServiceUnavailableException(`Twilio OTP service unavailable: ${message}`);
    }

    if (result.status !== "approved") {
      throw new BadRequestException("Invalid or expired OTP code");
    }
  }
}
