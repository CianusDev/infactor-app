import { NotFoundError } from "@/lib/errors";
import { DocumentRepository, DocumentWithItems } from "./document.repository";
import {
  CreateDocumentInput,
  DocumentItemInput,
  DocumentQueryInput,
  UpdateDocumentInput,
} from "./document.schema";

export class DocumentService {
  private readonly repository: DocumentRepository;

  constructor() {
    this.repository = new DocumentRepository();
  }

  /**
   * Calcule le total d'une ligne de document
   */
  private calculateItemTotal(item: DocumentItemInput): number {
    return item.quantity * item.unitPrice;
  }

  /**
   * Calcule les totaux du document (subtotal, taxAmount, total)
   */
  private calculateDocumentTotals(
    items: DocumentItemInput[],
    taxRate: number = 20,
    discount: number = 0
  ): { subtotal: number; taxAmount: number; total: number } {
    // Calcul du sous-total (somme des lignes)
    const subtotal = items.reduce((sum, item) => {
      return sum + this.calculateItemTotal(item);
    }, 0);

    // Appliquer la remise
    const subtotalAfterDiscount = Math.max(0, subtotal - discount);

    // Calcul de la TVA
    const taxAmount = (subtotalAfterDiscount * taxRate) / 100;

    // Total TTC
    const total = subtotalAfterDiscount + taxAmount;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }

  /**
   * Récupère un document par ID et vérifie l'ownership
   */
  async getById(documentId: string, userId: string): Promise<DocumentWithItems> {
    const document = await this.repository.findByIdAndUserId(documentId, userId);

    if (!document) {
      throw new NotFoundError("Document non trouvé");
    }

    return document;
  }

  /**
   * Récupère tous les documents d'un utilisateur avec filtres
   */
  async getAllByUserId(userId: string, query: DocumentQueryInput) {
    return await this.repository.findAllByUserId(userId, query);
  }

  /**
   * Crée un nouveau document
   */
  async create(userId: string, data: CreateDocumentInput): Promise<DocumentWithItems> {
    // Calculer les totaux pour chaque item
    const itemsWithTotals = data.items.map((item, index) => ({
      ...item,
      total: this.calculateItemTotal(item),
      order: item.order ?? index,
    }));

    // Calculer les totaux du document
    const { subtotal, taxAmount, total } = this.calculateDocumentTotals(
      itemsWithTotals,
      data.taxRate ?? 20,
      data.discount ?? 0
    );

    // Créer le document
    const document = await this.repository.create(userId, {
      ...data,
      items: itemsWithTotals,
      subtotal,
      taxAmount,
      total,
    });

    return document;
  }

  /**
   * Met à jour un document existant
   */
  async update(
    documentId: string,
    userId: string,
    data: UpdateDocumentInput
  ): Promise<DocumentWithItems> {
    // Vérifier que le document existe et appartient à l'utilisateur
    const existingDocument = await this.repository.findByIdAndUserId(documentId, userId);

    if (!existingDocument) {
      throw new NotFoundError("Document non trouvé");
    }

    let updateData: UpdateDocumentInput & {
      subtotal?: number;
      taxAmount?: number;
      total?: number;
    } = { ...data };

    // Si des items sont fournis, recalculer les totaux
    if (data.items && data.items.length > 0) {
      const itemsWithTotals = data.items.map((item, index) => ({
        ...item,
        total: item.quantity && item.unitPrice ? item.quantity * item.unitPrice : undefined,
        order: item.order ?? index,
      }));

      // Utiliser le nouveau taxRate ou celui existant
      const taxRate = data.taxRate ?? existingDocument.taxRate?.toNumber() ?? 20;
      const discount = data.discount ?? existingDocument.discount?.toNumber() ?? 0;

      // Recalculer seulement si tous les items ont les infos nécessaires
      const validItems = itemsWithTotals.filter(
        (item) => item.quantity !== undefined && item.unitPrice !== undefined
      );

      if (validItems.length === itemsWithTotals.length) {
        const { subtotal, taxAmount, total } = this.calculateDocumentTotals(
          validItems as DocumentItemInput[],
          taxRate,
          discount
        );

        updateData = {
          ...updateData,
          items: itemsWithTotals,
          subtotal,
          taxAmount,
          total,
        };
      }
    } else if (data.taxRate !== undefined || data.discount !== undefined) {
      // Si seuls taxRate ou discount changent, recalculer avec les items existants
      const existingItems = existingDocument.items.map((item) => ({
        description: item.description,
        quantity: item.quantity.toNumber(),
        unitPrice: item.unitPrice.toNumber(),
      }));

      const taxRate = data.taxRate ?? existingDocument.taxRate?.toNumber() ?? 20;
      const discount = data.discount ?? existingDocument.discount?.toNumber() ?? 0;

      const { subtotal, taxAmount, total } = this.calculateDocumentTotals(
        existingItems,
        taxRate,
        discount
      );

      updateData = {
        ...updateData,
        subtotal,
        taxAmount,
        total,
      };
    }

    const updatedDocument = await this.repository.update(documentId, updateData);

    if (!updatedDocument) {
      throw new NotFoundError("Erreur lors de la mise à jour du document");
    }

    return updatedDocument;
  }

  /**
   * Supprime un document
   */
  async delete(documentId: string, userId: string): Promise<void> {
    // Vérifier que le document existe et appartient à l'utilisateur
    const existingDocument = await this.repository.findByIdAndUserId(documentId, userId);

    if (!existingDocument) {
      throw new NotFoundError("Document non trouvé");
    }

    await this.repository.delete(documentId);
  }

  /**
   * Duplique un document
   */
  async duplicate(
    documentId: string,
    userId: string,
    newName?: string
  ): Promise<DocumentWithItems> {
    // Vérifier que le document existe et appartient à l'utilisateur
    const existingDocument = await this.repository.findByIdAndUserId(documentId, userId);

    if (!existingDocument) {
      throw new NotFoundError("Document non trouvé");
    }

    // Générer un nom par défaut si non fourni
    const duplicateName = newName || `${existingDocument.name} (copie)`;

    const duplicatedDocument = await this.repository.duplicate(
      documentId,
      userId,
      duplicateName
    );

    if (!duplicatedDocument) {
      throw new NotFoundError("Erreur lors de la duplication du document");
    }

    return duplicatedDocument;
  }

  /**
   * Récupère le nombre total de documents d'un utilisateur
   */
  async getCount(userId: string): Promise<number> {
    return await this.repository.countByUserId(userId);
  }
}
