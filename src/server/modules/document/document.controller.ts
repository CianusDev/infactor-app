import { ZodError } from "zod";
import { ValidationError } from "@/lib/errors";
import { DocumentService } from "./document.service";
import {
  createDocumentSchema,
  updateDocumentSchema,
  documentQuerySchema,
} from "./document.schema";

export class DocumentController {
  private readonly service: DocumentService;

  constructor() {
    this.service = new DocumentService();
  }

  /**
   * Récupère un document par ID
   */
  async getById(documentId: string, userId: string) {
    return await this.service.getById(documentId, userId);
  }

  /**
   * Récupère tous les documents d'un utilisateur avec filtres
   */
  async getAll(userId: string, query: unknown) {
    try {
      const validatedQuery = documentQuerySchema.parse(query);
      return await this.service.getAllByUserId(userId, validatedQuery);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  /**
   * Crée un nouveau document
   */
  async create(userId: string, data: unknown) {
    try {
      const validatedData = createDocumentSchema.parse(data);
      return await this.service.create(userId, validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  /**
   * Met à jour un document existant
   */
  async update(documentId: string, userId: string, data: unknown) {
    try {
      const validatedData = updateDocumentSchema.parse(data);
      return await this.service.update(documentId, userId, validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  /**
   * Supprime un document
   */
  async delete(documentId: string, userId: string) {
    await this.service.delete(documentId, userId);
    return { success: true, message: "Document supprimé avec succès" };
  }

  /**
   * Duplique un document
   */
  async duplicate(documentId: string, userId: string, newName?: string) {
    return await this.service.duplicate(documentId, userId, newName);
  }

  /**
   * Récupère le nombre total de documents d'un utilisateur
   */
  async getCount(userId: string) {
    const count = await this.service.getCount(userId);
    return { count };
  }
}
