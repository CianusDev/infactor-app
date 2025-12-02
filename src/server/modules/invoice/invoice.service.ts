import { InvoiceStatus } from "@/generated/prisma/client";
import { ForbiddenError, NotFoundError, ValidationError } from "@/lib/errors";
import { InvoiceRepository, InvoiceWithItems } from "./invoice.repository";
import {
  CreateInvoiceInput,
  InvoiceItemInput,
  InvoiceQueryInput,
  UpdateInvoiceInput,
} from "./invoice.schema";

export class InvoiceService {
  private readonly repository: InvoiceRepository;

  constructor() {
    this.repository = new InvoiceRepository();
  }

  /**
   * Calcule le total d'une ligne de facture
   */
  private calculateItemTotal(item: InvoiceItemInput): number {
    return item.quantity * item.unitPrice;
  }

  /**
   * Calcule les totaux de la facture (subtotal, taxAmount, total)
   */
  private calculateInvoiceTotals(
    items: InvoiceItemInput[],
    taxRate: number = 20,
    discount: number = 0
  ): { subtotal: number; taxAmount: number; total: number } {
    // Calcul du sous-total (somme des lignes)
    const subtotal = items.reduce((sum, item) => {
      return sum + this.calculateItemTotal(item);
    }, 0);

    // Appliquer la remise
    const subtotalAfterDiscount = subtotal - discount;

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
   * Récupère une facture par ID et vérifie l'ownership
   */
  async getById(invoiceId: string, userId: string): Promise<InvoiceWithItems> {
    const invoice = await this.repository.findByIdAndUserId(invoiceId, userId);

    if (!invoice) {
      throw new NotFoundError("Facture non trouvée");
    }

    return invoice;
  }

  /**
   * Récupère toutes les factures d'un utilisateur avec filtres
   */
  async getAllByUserId(userId: string, query: InvoiceQueryInput) {
    return await this.repository.findAllByUserId(userId, query);
  }

  /**
   * Crée une nouvelle facture
   */
  async create(userId: string, data: CreateInvoiceInput): Promise<InvoiceWithItems> {
    // Générer le numéro de facture
    const invoiceNumber = await this.repository.getNextInvoiceNumber(userId);

    // Calculer les totaux pour chaque item
    const itemsWithTotals = data.items.map((item, index) => ({
      ...item,
      total: this.calculateItemTotal(item),
      order: item.order ?? index,
    }));

    // Calculer les totaux de la facture
    const { subtotal, taxAmount, total } = this.calculateInvoiceTotals(
      itemsWithTotals,
      data.taxRate ?? 20,
      data.discount ?? 0
    );

    // Créer la facture
    const invoice = await this.repository.create(userId, {
      ...data,
      items: itemsWithTotals,
      invoiceNumber,
      subtotal,
      taxAmount,
      total,
    });

    return invoice;
  }

  /**
   * Met à jour une facture existante
   */
  async update(
    invoiceId: string,
    userId: string,
    data: UpdateInvoiceInput
  ): Promise<InvoiceWithItems> {
    // Vérifier que la facture existe et appartient à l'utilisateur
    const existingInvoice = await this.repository.findByIdAndUserId(invoiceId, userId);

    if (!existingInvoice) {
      throw new NotFoundError("Facture non trouvée");
    }

    // Vérifier que la facture est modifiable (uniquement en DRAFT)
    if (existingInvoice.status !== InvoiceStatus.DRAFT) {
      throw new ForbiddenError("Seules les factures en brouillon peuvent être modifiées");
    }

    let updateData: UpdateInvoiceInput & {
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
      const taxRate = data.taxRate ?? existingInvoice.taxRate?.toNumber() ?? 20;
      const discount = data.discount ?? existingInvoice.discount?.toNumber() ?? 0;

      // Recalculer seulement si tous les items ont les infos nécessaires
      const validItems = itemsWithTotals.filter(
        (item) => item.quantity !== undefined && item.unitPrice !== undefined
      );

      if (validItems.length === itemsWithTotals.length) {
        const { subtotal, taxAmount, total } = this.calculateInvoiceTotals(
          validItems as InvoiceItemInput[],
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
      const existingItems = existingInvoice.items.map((item) => ({
        description: item.description,
        quantity: item.quantity.toNumber(),
        unitPrice: item.unitPrice.toNumber(),
      }));

      const taxRate = data.taxRate ?? existingInvoice.taxRate?.toNumber() ?? 20;
      const discount = data.discount ?? existingInvoice.discount?.toNumber() ?? 0;

      const { subtotal, taxAmount, total } = this.calculateInvoiceTotals(
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

    const updatedInvoice = await this.repository.update(invoiceId, updateData);

    if (!updatedInvoice) {
      throw new NotFoundError("Erreur lors de la mise à jour de la facture");
    }

    return updatedInvoice;
  }

  /**
   * Met à jour le statut d'une facture
   */
  async updateStatus(invoiceId: string, userId: string, status: InvoiceStatus) {
    // Vérifier que la facture existe et appartient à l'utilisateur
    const existingInvoice = await this.repository.findByIdAndUserId(invoiceId, userId);

    if (!existingInvoice) {
      throw new NotFoundError("Facture non trouvée");
    }

    // Valider les transitions de statut
    this.validateStatusTransition(existingInvoice.status, status);

    const updatedInvoice = await this.repository.updateStatus(invoiceId, status);
    return updatedInvoice;
  }

  /**
   * Valide les transitions de statut autorisées
   */
  private validateStatusTransition(currentStatus: InvoiceStatus, newStatus: InvoiceStatus) {
    const allowedTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
      [InvoiceStatus.DRAFT]: [InvoiceStatus.SENT, InvoiceStatus.CANCELLED],
      [InvoiceStatus.SENT]: [InvoiceStatus.PAID, InvoiceStatus.OVERDUE, InvoiceStatus.CANCELLED],
      [InvoiceStatus.PAID]: [], // Pas de transition depuis PAID
      [InvoiceStatus.OVERDUE]: [InvoiceStatus.PAID, InvoiceStatus.CANCELLED],
      [InvoiceStatus.CANCELLED]: [], // Pas de transition depuis CANCELLED
    };

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new ValidationError(
        `Transition de statut non autorisée : ${currentStatus} → ${newStatus}`
      );
    }
  }

  /**
   * Supprime une facture
   */
  async delete(invoiceId: string, userId: string): Promise<void> {
    // Vérifier que la facture existe et appartient à l'utilisateur
    const existingInvoice = await this.repository.findByIdAndUserId(invoiceId, userId);

    if (!existingInvoice) {
      throw new NotFoundError("Facture non trouvée");
    }

    // Seules les factures en brouillon ou annulées peuvent être supprimées
    if (
      existingInvoice.status !== InvoiceStatus.DRAFT &&
      existingInvoice.status !== InvoiceStatus.CANCELLED
    ) {
      throw new ForbiddenError("Seules les factures en brouillon ou annulées peuvent être supprimées");
    }

    await this.repository.delete(invoiceId);
  }

  /**
   * Récupère les statistiques des factures d'un utilisateur
   */
  async getStats(userId: string) {
    const [totalCount, draftCount, sentCount, paidCount, overdueCount, totalRevenue] =
      await Promise.all([
        this.repository.countByUserId(userId),
        this.repository.countByStatus(userId, InvoiceStatus.DRAFT),
        this.repository.countByStatus(userId, InvoiceStatus.SENT),
        this.repository.countByStatus(userId, InvoiceStatus.PAID),
        this.repository.countByStatus(userId, InvoiceStatus.OVERDUE),
        this.repository.getTotalRevenue(userId),
      ]);

    return {
      totalCount,
      draftCount,
      sentCount,
      paidCount,
      overdueCount,
      totalRevenue,
    };
  }
}
