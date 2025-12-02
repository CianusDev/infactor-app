import { ValidationError } from "@/lib/errors";
import z, { ZodError } from "zod";
import {
  createBusinessProfileSchema,
  updateBusinessProfileSchema,
  uploadLogoSchema,
} from "./business-profile.schema";
import { BusinessProfileService } from "./business-profile.service";

export class BusinessProfileController {
  private readonly service: BusinessProfileService;

  constructor() {
    this.service = new BusinessProfileService();
  }

  async getProfile(userId: string) {
    try {
      return await this.service.getByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  async createOrUpdateProfile(
    userId: string,
    data: z.infer<typeof createBusinessProfileSchema>
  ) {
    try {
      const validated = createBusinessProfileSchema.parse(data);
      return await this.service.createOrUpdate(userId, validated);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", ")
        );
      }
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    data: z.infer<typeof updateBusinessProfileSchema>
  ) {
    try {
      const validated = updateBusinessProfileSchema.parse(data);
      return await this.service.update(userId, validated);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", ")
        );
      }
      throw error;
    }
  }

  async uploadLogo(userId: string, data: z.infer<typeof uploadLogoSchema>) {
    try {
      const validated = uploadLogoSchema.parse(data);
      return await this.service.updateLogo(userId, validated.logo);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", ")
        );
      }
      throw error;
    }
  }

  async deleteProfile(userId: string) {
    try {
      return await this.service.delete(userId);
    } catch (error) {
      throw error;
    }
  }
}
