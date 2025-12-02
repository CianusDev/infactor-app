import { createOTPToken, generateCodeOTP, verifyOTPToken } from "@/lib/helpers";
import { OtpRepository } from "./otp.repository";
import { APP_URL, OTP_VALIDITY_PERIOD } from "@/lib/constant";
import { Role } from "@/generated/prisma/enums";

export class OTPService {
  private readonly otpRepository: OtpRepository;
  constructor() {
    this.otpRepository = new OtpRepository();
  }

  generateOTP(email: string): string {
    const code = generateCodeOTP();
    const expiresAt = new Date(Date.now() + OTP_VALIDITY_PERIOD); // 15 minutes from now
    this.otpRepository.createOtpForUser(email, code, expiresAt);
    return code;
  }

  async verifyOTP(email: string, code: string): Promise<boolean> {
    const otp = await this.otpRepository.getOtpByEmail(email);
    if (!otp) return false;
    if (otp.code !== code) return false;
    if (otp.expiresAt < new Date()) return false;
    // OTP is valid, delete it
    await this.otpRepository.deleteOtpById(otp.id);
    return true;
  }

  generateResetLinkOTP(email: string): string {
    const code = this.generateOTP(email);
    const token = createOTPToken(email, code);
    const resetLink = `${APP_URL}/reset-password?token=${token}`;
    return resetLink;
  }

  generateInviteLinkOTP(
    email: string,
    role: Role,
    storeIds: string[] = [],
  ): string {
    const code = this.generateOTP(email);
    const token = createOTPToken(email, code, {
      role,
      storeIds: storeIds.join(","),
    });
    const inviteLink = `${APP_URL}/admin/accept-invite?token=${token}`;
    return inviteLink;
  }

  async verifyResetLinkOTP(token: string): Promise<boolean> {
    const { email, code } = verifyOTPToken(token);
    if (!email || !code) return false;
    const isValid = await this.verifyOTP(email, code);
    return isValid;
  }

  async verifyInviteLinkOTPWithData(token: string): Promise<
    | {
        isValid: boolean;
        role: Role;
        email: string;
      }
    | boolean
  > {
    const { email, code, data } = verifyOTPToken(token);
    if (!email || !code || !data?.role) return false;
    const isValid = await this.verifyOTP(email, code);
    return {
      isValid,
      role: data.role as Role,
      email,
    };
  }

  async cleanupExpiredOtps(): Promise<void> {
    await this.otpRepository.deleteExpiredOtps();
  }
}
