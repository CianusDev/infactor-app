import z from "zod";
import { InvoiceStatus } from "@/generated/prisma/client";

// ============================================
// INVOICE ITEM SCHEMAS
// ============================================

export const invoiceItemSchema = z.object({
  description: z.string({ message: "La description est requise" }).min(1, {
    message: "La description ne peut pas être vide",
  }),
  quantity: z
    .number({ message: "La quantité est requise" })
    .positive({ message: "La quantité doit être positive" }),
  unitPrice: z
    .number({ message: "Le prix unitaire est requis" })
    .nonnegative({ message: "Le prix unitaire ne peut pas être négatif" }),
  total: z
    .number({ message: "Le total est requis" })
    .nonnegative({ message: "Le total ne peut pas être négatif" })
    .optional(),
  order: z.number().int().nonnegative().optional(),
});

export const updateInvoiceItemSchema = invoiceItemSchema.partial().extend({
  id: z.string().optional(),
});

// ============================================
// INVOICE SCHEMAS
// ============================================

export const createInvoiceSchema = z.object({
  // Infos client
  clientName: z.string({ message: "Le nom du client est requis" }).min(1, {
    message: "Le nom du client ne peut pas être vide",
  }),
  clientEmail: z.string().email({ message: "Email client invalide" }).optional().nullable(),
  clientPhone: z.string().optional().nullable(),
  clientAddress: z.string().optional().nullable(),
  clientCity: z.string().optional().nullable(),
  clientPostalCode: z.string().optional().nullable(),
  clientCountry: z.string().optional().nullable(),
  clientSiret: z
    .string()
    .regex(/^[0-9]{14}$/, { message: "Le SIRET client doit contenir 14 chiffres" })
    .optional()
    .nullable(),
  clientVatNumber: z
    .string()
    .regex(/^[A-Z]{2}[0-9A-Z]{2,13}$/, { message: "Le numéro de TVA client est invalide" })
    .optional()
    .nullable(),

  // Dates
  issueDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional().nullable(),

  // Montants
  taxRate: z
    .number()
    .min(0, { message: "Le taux de TVA ne peut pas être négatif" })
    .max(100, { message: "Le taux de TVA ne peut pas dépasser 100%" })
    .optional()
    .nullable(),
  discount: z
    .number()
    .nonnegative({ message: "La remise ne peut pas être négative" })
    .optional()
    .nullable(),
  currency: z.string().default("EUR"),

  // Options
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  templateId: z.string().optional().nullable(),

  // Lignes de facture
  items: z
    .array(invoiceItemSchema)
    .min(1, { message: "La facture doit contenir au moins une ligne" }),
});

export const updateInvoiceSchema = z.object({
  // Infos client
  clientName: z.string().min(1, { message: "Le nom du client ne peut pas être vide" }).optional(),
  clientEmail: z.string().email({ message: "Email client invalide" }).optional().nullable(),
  clientPhone: z.string().optional().nullable(),
  clientAddress: z.string().optional().nullable(),
  clientCity: z.string().optional().nullable(),
  clientPostalCode: z.string().optional().nullable(),
  clientCountry: z.string().optional().nullable(),
  clientSiret: z
    .string()
    .regex(/^[0-9]{14}$/, { message: "Le SIRET client doit contenir 14 chiffres" })
    .optional()
    .nullable(),
  clientVatNumber: z
    .string()
    .regex(/^[A-Z]{2}[0-9A-Z]{2,13}$/, { message: "Le numéro de TVA client est invalide" })
    .optional()
    .nullable(),

  // Dates
  issueDate: z.coerce.date().optional(),
  dueDate: z.coerce.date().optional().nullable(),

  // Montants
  taxRate: z
    .number()
    .min(0, { message: "Le taux de TVA ne peut pas être négatif" })
    .max(100, { message: "Le taux de TVA ne peut pas dépasser 100%" })
    .optional()
    .nullable(),
  discount: z
    .number()
    .nonnegative({ message: "La remise ne peut pas être négative" })
    .optional()
    .nullable(),
  currency: z.string().optional(),

  // Options
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),
  templateId: z.string().optional().nullable(),

  // Lignes de facture
  items: z.array(updateInvoiceItemSchema).optional(),
});

export const updateInvoiceStatusSchema = z.object({
  status: z.nativeEnum(InvoiceStatus, {
    message: "Statut de facture invalide",
  }),
});

export const invoiceQuerySchema = z.object({
  status: z.nativeEnum(InvoiceStatus).optional(),
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
  sortBy: z.enum(["createdAt", "issueDate", "dueDate", "total", "invoiceNumber"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// ============================================
// TYPES
// ============================================

export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;
export type UpdateInvoiceItemInput = z.infer<typeof updateInvoiceItemSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type UpdateInvoiceStatusInput = z.infer<typeof updateInvoiceStatusSchema>;
export type InvoiceQueryInput = z.infer<typeof invoiceQuerySchema>;
