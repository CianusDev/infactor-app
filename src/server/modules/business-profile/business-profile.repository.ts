import { BusinessProfile } from "@/generated/prisma/client";
import { prisma } from "@/server/config/database";
import { CreateBusinessProfileInput, UpdateBusinessProfileInput } from "./business-profile.schema";

export class BusinessProfileRepository {
  async findByUserId(userId: string): Promise<BusinessProfile | null> {
    const profile = await prisma.businessProfile.findUnique({
      where: { userId },
    });
    return profile;
  }

  async create(
    userId: string,
    data: CreateBusinessProfileInput
  ): Promise<BusinessProfile> {
    const profile = await prisma.businessProfile.create({
      data: {
        userId,
        ...data,
      },
    });
    return profile;
  }

  async update(
    userId: string,
    data: UpdateBusinessProfileInput
  ): Promise<BusinessProfile | null> {
    const profile = await prisma.businessProfile.update({
      where: { userId },
      data,
    });
    return profile;
  }

  async upsert(
    userId: string,
    data: CreateBusinessProfileInput
  ): Promise<BusinessProfile> {
    const profile = await prisma.businessProfile.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: data,
    });
    return profile;
  }

  async updateLogo(userId: string, logoUrl: string): Promise<BusinessProfile | null> {
    const profile = await prisma.businessProfile.update({
      where: { userId },
      data: { logo: logoUrl },
    });
    return profile;
  }

  async delete(userId: string): Promise<void> {
    await prisma.businessProfile.delete({
      where: { userId },
    });
  }
}
