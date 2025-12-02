import { ValidationError } from "@/lib/errors";
import z, { ZodError } from "zod";
import {
  createInvoiceSchema,
  invoiceQuerySchema,
  updateInvoiceSchema,
  updateInvoiceStatusSchema,
} from "./invoice.schema";
import { InvoiceService } from "./invoice.service";

export class InvoiceController {
  private readonly service: InvoiceService;

  constructor() {
    this.service = new InvoiceService();
  }

  async getById(invoiceId: string, userId: string) {
    try {
      return await this.service.getById(invoiceId, userId);
    } catch (error) {
      throw error;
    }
  }

  async getAll(userId: string, query: z.infer<typeof invoiceQuerySchema>) {
    try {
      const validated = invoiceQuerySchema.parse(query);
      return await this.service.getAllByUserId(userId, validated);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  async create(userId: string, data: z.infer<typeof createInvoiceSchema>) {
    try {
      const validated = createInvoiceSchema.parse(data);
      return await this.service.create(userId, validated);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  async update(
    invoiceId: string,
    userId: string,
    data: z.infer<typeof updateInvoiceSchema>,
  ) {
    try {
      const validated = updateInvoiceSchema.parse(data);
      return await this.service.update(invoiceId, userId, validated);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  async updateStatus(
    invoiceId: string,
    userId: string,
    data: z.infer<typeof updateInvoiceStatusSchema>,
  ) {
    try {
      const validated = updateInvoiceStatusSchema.parse(data);
      return await this.service.updateStatus(
        invoiceId,
        userId,
        validated.status,
      );
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  async delete(invoiceId: string, userId: string) {
    try {
      return await this.service.delete(invoiceId, userId);
    } catch (error) {
      throw error;
    }
  }

  async getStats(userId: string) {
    try {
      return await this.service.getStats(userId);
    } catch (error) {
      throw error;
    }
  }
}
