import { OTP } from "@/generated/prisma/client";
import { prisma } from "@/server/config/database";

export class OtpRepository {
  async createOtpForUser(
    email: string,
    code: string,
    expiresAt: Date,
  ): Promise<OTP> {
    const otp = await prisma.oTP.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });
    return otp;
  }
  async getOtpByEmail(email: string): Promise<OTP | null> {
    return prisma.oTP.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });
  }
  async deleteOtpByEmail(email: string): Promise<void> {
    await prisma.oTP.deleteMany({
      where: { email },
    });
  }
  async deleteOtpById(id: string): Promise<void> {
    await prisma.oTP.deleteMany({
      where: { id },
    });
  }
  async deleteExpiredOtps(): Promise<void> {
    const now = new Date();
    await prisma.oTP.deleteMany({
      where: {
        expiresAt: {
          lt: now,
        },
      },
    });
  }
}
