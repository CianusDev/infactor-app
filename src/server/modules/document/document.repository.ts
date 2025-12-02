import { prisma } from "@/server/config/database";
import { DocumentQueryInput } from "./document.schema";
import { Prisma } from "@/generated/prisma/client";

// Type pour un document avec ses items
export type DocumentWithItems = Prisma.DocumentGetPayload<{
  include: { items: true; template: true };
}>;

export class DocumentRepository {
  /**
   * Créer un nouveau document
   */
  async create(
    userId: string,
    data: {
      name: string;
      templateId?: string | null;
      styleConfig?: object | null;
      companyName?: string | null;
      companyAddress?: string | null;
      companyCity?: string | null;
      companyPostalCode?: string | null;
      companyCountry?: string | null;
      companyPhone?: string | null;
      companyEmail?: string | null;
      companySiret?: string | null;
      companyVatNumber?: string | null;
      companyLogo?: string | null;
      clientName: string;
      clientEmail?: string | null;
      clientPhone?: string | null;
      clientAddress?: string | null;
      clientCity?: string | null;
      clientPostalCode?: string | null;
      clientCountry?: string | null;
      clientSiret?: string | null;
      clientVatNumber?: string | null;
      invoiceNumber?: string | null;
      issueDate?: Date;
      dueDate?: Date | null;
      subtotal: number;
      taxRate?: number | null;
      taxAmount?: number | null;
      discount?: number | null;
      total: number;
      currency?: string;
      notes?: string | null;
      terms?: string | null;
      items: {
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
        order?: number;
      }[];
    }
  ): Promise<DocumentWithItems> {
    const { items, styleConfig, ...documentData } = data;

    return await prisma.document.create({
      data: {
        ...documentData,
        styleConfig: styleConfig as Prisma.InputJsonValue,
        userId,
        items: {
          create: items.map((item, index) => ({
            ...item,
            order: item.order ?? index,
          })),
        },
      },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
        template: true,
      },
    });
  }

  /**
   * Trouver un document par ID
   */
  async findById(id: string): Promise<DocumentWithItems | null> {
    return await prisma.document.findUnique({
      where: { id },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
        template: true,
      },
    });
  }

  /**
   * Trouver un document par ID et userId (vérification ownership)
   */
  async findByIdAndUserId(
    id: string,
    userId: string
  ): Promise<DocumentWithItems | null> {
    return await prisma.document.findFirst({
      where: { id, userId },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
        template: true,
      },
    });
  }

  /**
   * Récupérer tous les documents d'un utilisateur
   */
  async findAllByUserId(
    userId: string,
    query: DocumentQueryInput
  ): Promise<{
    data: DocumentWithItems[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const { search, limit = 20, offset = 0, sortBy = "createdAt", sortOrder = "desc" } = query;

    // Construction du filtre
    const where: Prisma.DocumentWhereInput = {
      userId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { clientName: { contains: search, mode: "insensitive" } },
          { invoiceNumber: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    // Exécuter la requête et le comptage en parallèle
    const [data, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          items: {
            orderBy: { order: "asc" },
          },
          template: true,
        },
        orderBy: { [sortBy]: sortOrder },
        take: limit,
        skip: offset,
      }),
      prisma.document.count({ where }),
    ]);

    return { data, total, limit, offset };
  }

  /**
   * Mettre à jour un document
   */
  async update(
    id: string,
    data: {
      name?: string;
      templateId?: string | null;
      styleConfig?: object | null;
      companyName?: string | null;
      companyAddress?: string | null;
      companyCity?: string | null;
      companyPostalCode?: string | null;
      companyCountry?: string | null;
      companyPhone?: string | null;
      companyEmail?: string | null;
      companySiret?: string | null;
      companyVatNumber?: string | null;
      companyLogo?: string | null;
      clientName?: string;
      clientEmail?: string | null;
      clientPhone?: string | null;
      clientAddress?: string | null;
      clientCity?: string | null;
      clientPostalCode?: string | null;
      clientCountry?: string | null;
      clientSiret?: string | null;
      clientVatNumber?: string | null;
      invoiceNumber?: string | null;
      issueDate?: Date;
      dueDate?: Date | null;
      subtotal?: number;
      taxRate?: number | null;
      taxAmount?: number | null;
      discount?: number | null;
      total?: number;
      currency?: string;
      notes?: string | null;
      terms?: string | null;
      items?: {
        id?: string;
        description?: string;
        quantity?: number;
        unitPrice?: number;
        total?: number;
        order?: number;
      }[];
    }
  ): Promise<DocumentWithItems | null> {
    const { items, styleConfig, ...documentData } = data;

    // Si des items sont fournis, on les remplace
    if (items) {
      // Supprimer les anciens items
      await prisma.documentItem.deleteMany({
        where: { documentId: id },
      });

      // Créer les nouveaux items
      await prisma.documentItem.createMany({
        data: items.map((item, index) => ({
          documentId: id,
          description: item.description || "",
          quantity: item.quantity || 0,
          unitPrice: item.unitPrice || 0,
          total: item.total || 0,
          order: item.order ?? index,
        })),
      });
    }

    // Mettre à jour le document
    return await prisma.document.update({
      where: { id },
      data: {
        ...documentData,
        ...(styleConfig !== undefined && {
          styleConfig: styleConfig as Prisma.InputJsonValue,
        }),
      },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
        template: true,
      },
    });
  }

  /**
   * Supprimer un document
   */
  async delete(id: string): Promise<void> {
    await prisma.document.delete({
      where: { id },
    });
  }

  /**
   * Dupliquer un document
   */
  async duplicate(
    id: string,
    userId: string,
    newName: string
  ): Promise<DocumentWithItems | null> {
    const original = await this.findByIdAndUserId(id, userId);

    if (!original) {
      return null;
    }

    // Créer une copie du document
    return await prisma.document.create({
      data: {
        name: newName,
        userId,
        templateId: original.templateId,
        styleConfig: original.styleConfig as Prisma.InputJsonValue,
        companyName: original.companyName,
        companyAddress: original.companyAddress,
        companyCity: original.companyCity,
        companyPostalCode: original.companyPostalCode,
        companyCountry: original.companyCountry,
        companyPhone: original.companyPhone,
        companyEmail: original.companyEmail,
        companySiret: original.companySiret,
        companyVatNumber: original.companyVatNumber,
        companyLogo: original.companyLogo,
        clientName: original.clientName,
        clientEmail: original.clientEmail,
        clientPhone: original.clientPhone,
        clientAddress: original.clientAddress,
        clientCity: original.clientCity,
        clientPostalCode: original.clientPostalCode,
        clientCountry: original.clientCountry,
        clientSiret: original.clientSiret,
        clientVatNumber: original.clientVatNumber,
        invoiceNumber: null, // Reset le numéro de facture
        issueDate: new Date(), // Date actuelle
        dueDate: original.dueDate,
        subtotal: original.subtotal,
        taxRate: original.taxRate,
        taxAmount: original.taxAmount,
        discount: original.discount,
        total: original.total,
        currency: original.currency,
        notes: original.notes,
        terms: original.terms,
        items: {
          create: original.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total,
            order: item.order,
          })),
        },
      },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
        template: true,
      },
    });
  }

  /**
   * Compter les documents d'un utilisateur
   */
  async countByUserId(userId: string): Promise<number> {
    return await prisma.document.count({
      where: { userId },
    });
  }
}
