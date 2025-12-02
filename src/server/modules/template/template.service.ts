import { NotFoundError } from "@/lib/errors";
import { TemplateRepository } from "./template.repository";
import { CreateTemplateInput, TemplateQueryInput, UpdateTemplateInput } from "./template.schema";

export class TemplateService {
  private readonly repository: TemplateRepository;

  constructor() {
    this.repository = new TemplateRepository();
  }

  /**
   * Récupère un template par ID
   */
  async getById(templateId: string) {
    const template = await this.repository.findById(templateId);

    if (!template) {
      throw new NotFoundError("Template non trouvé");
    }

    return template;
  }

  /**
   * Récupère tous les templates
   */
  async getAll(query: TemplateQueryInput) {
    return await this.repository.findAll(query);
  }

  /**
   * Récupère le template par défaut
   */
  async getDefault() {
    const template = await this.repository.findDefault();
    return template;
  }

  /**
   * Crée un nouveau template (admin only)
   */
  async create(data: CreateTemplateInput) {
    const template = await this.repository.create(data);
    return template;
  }

  /**
   * Met à jour un template (admin only)
   */
  async update(templateId: string, data: UpdateTemplateInput) {
    const existingTemplate = await this.repository.findById(templateId);

    if (!existingTemplate) {
      throw new NotFoundError("Template non trouvé");
    }

    const updatedTemplate = await this.repository.update(templateId, data);
    return updatedTemplate;
  }

  /**
   * Supprime un template (admin only)
   */
  async delete(templateId: string) {
    const existingTemplate = await this.repository.findById(templateId);

    if (!existingTemplate) {
      throw new NotFoundError("Template non trouvé");
    }

    // Empêcher la suppression du template par défaut
    if (existingTemplate.isDefault) {
      throw new Error("Impossible de supprimer le template par défaut");
    }

    await this.repository.delete(templateId);
  }
}
