import { ValidationError } from "@/lib/errors";
import z, { ZodError } from "zod";
import {
  createTemplateSchema,
  templateQuerySchema,
  updateTemplateSchema,
} from "./template.schema";
import { TemplateService } from "./template.service";

export class TemplateController {
  private readonly service: TemplateService;

  constructor() {
    this.service = new TemplateService();
  }

  async getById(templateId: string) {
    try {
      return await this.service.getById(templateId);
    } catch (error) {
      throw error;
    }
  }

  async getAll(query: z.infer<typeof templateQuerySchema>) {
    try {
      const validated = templateQuerySchema.parse(query);
      return await this.service.getAll(validated);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", ")
        );
      }
      throw error;
    }
  }

  async getDefault() {
    try {
      return await this.service.getDefault();
    } catch (error) {
      throw error;
    }
  }

  async create(data: z.infer<typeof createTemplateSchema>) {
    try {
      const validated = createTemplateSchema.parse(data);
      return await this.service.create(validated);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", ")
        );
      }
      throw error;
    }
  }

  async update(templateId: string, data: z.infer<typeof updateTemplateSchema>) {
    try {
      const validated = updateTemplateSchema.parse(data);
      return await this.service.update(templateId, validated);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", ")
        );
      }
      throw error;
    }
  }

  async delete(templateId: string) {
    try {
      return await this.service.delete(templateId);
    } catch (error) {
      throw error;
    }
  }
}
