import { Invoice, InvoiceItem, InvoiceStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/server/config/database";
import { GetAllDataResponse } from "@/types/data";
import { CreateInvoiceInput, InvoiceQueryInput, UpdateInvoiceInput } from "./invoice.schema";

export type InvoiceWithItems = Invoice & {
  items: InvoiceItem[];
};

export class InvoiceRepository {
  async findById(invoiceId: string): Promise<InvoiceWithItems | null> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { items: { orderBy: { order: "asc" } } },
    });
    return invoice;
  }

  async findByIdAndUserId(invoiceId: string, userId: string): Promise<InvoiceWithItems | null> {
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, userId },
      include: { items: { orderBy: { order: "asc" } } },
    });
    return invoice;
  }

  async findByInvoiceNumber(userId: string, invoiceNumber: string): Promise<Invoice | null> {
    const invoice = await prisma.invoice.findUnique({
      where: {
        userId_invoiceNumber: {
          userId,
          invoiceNumber,
        },
      },
    });
    return invoice;
  }

  async findAllByUserId(
    userId: string,
    query: InvoiceQueryInput
  ): Promise<GetAllDataResponse<InvoiceWithItems[]>> {
    const { status, search, limit, offset, sortBy = "createdAt", sortOrder = "desc" } = query;

    const where: Prisma.InvoiceWhereInput = {
      userId,
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { invoiceNumber: { contains: search, mode: "insensitive" } },
              { clientName: { contains: search, mode: "insensitive" } },
              { clientEmail: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: { items: { orderBy: { order: "asc" } } },
        skip: offset ?? 0,
        take: limit ?? undefined,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      data: invoices,
      total,
      limit: limit ?? total,
      offset: offset ?? 0,
    };
  }

  async getNextInvoiceNumber(userId: string): Promise<string> {
    const lastInvoice = await prisma.invoice.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { invoiceNumber: true },
    });

    if (!lastInvoice) {
      return "FAC-0001";
    }

    // Extraire le numéro de la dernière facture
    const match = lastInvoice.invoiceNumber.match(/FAC-(\d+)/);
    if (!match) {
      return "FAC-0001";
    }

    const nextNumber = parseInt(match[1], 10) + 1;
    return `FAC-${nextNumber.toString().padStart(4, "0")}`;
  }

  async create(
    userId: string,
    data: CreateInvoiceInput & {
      invoiceNumber: string;
      subtotal: number;
      taxAmount: number;
      total: number;
    }
  ): Promise<InvoiceWithItems> {
    const { items, ...invoiceData } = data;

    const invoice = await prisma.invoice.create({
      data: {
        userId,
        invoiceNumber: invoiceData.invoiceNumber,
        clientName: invoiceData.clientName,
        clientEmail: invoiceData.clientEmail,
        clientPhone: invoiceData.clientPhone,
        clientAddress: invoiceData.clientAddress,
        clientCity: invoiceData.clientCity,
        clientPostalCode: invoiceData.clientPostalCode,
        clientCountry: invoiceData.clientCountry,
        clientSiret: invoiceData.clientSiret,
        clientVatNumber: invoiceData.clientVatNumber,
        issueDate: invoiceData.issueDate ?? new Date(),
        dueDate: invoiceData.dueDate,
        subtotal: invoiceData.subtotal,
        taxRate: invoiceData.taxRate ?? 20,
        taxAmount: invoiceData.taxAmount,
        discount: invoiceData.discount ?? 0,
        total: invoiceData.total,
        currency: invoiceData.currency ?? "EUR",
        notes: invoiceData.notes,
        terms: invoiceData.terms,
        templateId: invoiceData.templateId,
        items: {
          create: items.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.total ?? item.quantity * item.unitPrice,
            order: item.order ?? index,
          })),
        },
      },
      include: { items: { orderBy: { order: "asc" } } },
    });

    return invoice;
  }

  async update(
    invoiceId: string,
    data: UpdateInvoiceInput & {
      subtotal?: number;
      taxAmount?: number;
      total?: number;
    }
  ): Promise<InvoiceWithItems | null> {
    const { items, ...invoiceData } = data;

    // Si des items sont fournis, on les remplace tous
    if (items && items.length > 0) {
      // Supprimer les anciens items
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId },
      });

      // Mettre à jour la facture et créer les nouveaux items
      const invoice = await prisma.invoice.update({
        where: { id: invoiceId },
        data: {
          ...invoiceData,
          items: {
            create: items.map((item, index) => ({
              description: item.description!,
              quantity: item.quantity!,
              unitPrice: item.unitPrice!,
              total: item.total ?? item.quantity! * item.unitPrice!,
              order: item.order ?? index,
            })),
          },
        },
        include: { items: { orderBy: { order: "asc" } } },
      });

      return invoice;
    }

    // Sinon, on met juste à jour les infos de la facture
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: invoiceData,
      include: { items: { orderBy: { order: "asc" } } },
    });

    return invoice;
  }

  async updateStatus(invoiceId: string, status: InvoiceStatus): Promise<Invoice | null> {
    const invoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status },
    });
    return invoice;
  }

  async delete(invoiceId: string): Promise<void> {
    await prisma.invoice.delete({
      where: { id: invoiceId },
    });
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.invoice.count({
      where: { userId },
    });
    return count;
  }

  async countByStatus(userId: string, status: InvoiceStatus): Promise<number> {
    const count = await prisma.invoice.count({
      where: { userId, status },
    });
    return count;
  }

  async getTotalRevenue(userId: string): Promise<number> {
    const result = await prisma.invoice.aggregate({
      where: { userId, status: InvoiceStatus.PAID },
      _sum: { total: true },
    });
    return result._sum.total?.toNumber() ?? 0;
  }
}
