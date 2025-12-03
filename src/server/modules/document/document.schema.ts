import z from "zod";

// ============================================
// DOCUMENT ITEM SCHEMAS
// ============================================

export const documentItemSchema = z.object({
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

export const updateDocumentItemSchema = documentItemSchema.partial().extend({
  id: z.string().optional(),
});

// ============================================
// STYLE CONFIG SCHEMA
// ============================================

export const styleConfigSchema = z.object({
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
  layout: z.enum(["classic", "modern", "minimal"]).optional(),
  showLogo: z.boolean().optional(),
  logoUrl: z.string().url().optional().nullable(),
  headerPosition: z.enum(["left", "center", "right"]).optional(),
  footerText: z.string().optional(),
});

// ============================================
// DOCUMENT SCHEMAS
// ============================================

export const createDocumentSchema = z.object({
  // Nom du document
  name: z.string({ message: "Le nom du document est requis" }).min(1, {
    message: "Le nom du document ne peut pas être vide",
  }),

  // Template et style
  templateId: z.string().optional().nullable(),
  styleConfig: styleConfigSchema.optional().nullable(),

  // Infos émetteur (entreprise/freelance)
  companyName: z.string().optional().nullable(),
  companyAddress: z.string().optional().nullable(),
  companyCity: z.string().optional().nullable(),
  companyPostalCode: z.string().optional().nullable(),
  companyCountry: z.string().optional().nullable(),
  companyPhone: z.string().optional().nullable(),
  companyEmail: z
    .string()
    .email({ message: "Email entreprise invalide" })
    .optional()
    .nullable(),
  companySiret: z
    .string()
    .regex(/^[0-9]{14}$/, { message: "Le SIRET doit contenir 14 chiffres" })
    .optional()
    .nullable(),
  companyVatNumber: z
    .string()
    .regex(/^[A-Z]{2}[0-9A-Z]{2,13}$/, {
      message: "Le numéro de TVA est invalide",
    })
    .optional()
    .nullable(),
  companyLogo: z
    .string()
    .url({ message: "URL du logo invalide" })
    .optional()
    .nullable(),

  // Infos client
  clientName: z.string({ message: "Le nom du client est requis" }).min(1, {
    message: "Le nom du client ne peut pas être vide",
  }),
  clientEmail: z
    .string()
    .email({ message: "Email client invalide" })
    .optional()
    .nullable(),
  clientPhone: z.string().optional().nullable(),
  clientAddress: z.string().optional().nullable(),
  clientCity: z.string().optional().nullable(),
  clientPostalCode: z.string().optional().nullable(),
  clientCountry: z.string().optional().nullable(),
  clientSiret: z
    .string()
    .regex(/^[0-9]{14}$/, {
      message: "Le SIRET client doit contenir 14 chiffres",
    })
    .optional()
    .nullable(),
  clientVatNumber: z
    .string()
    .regex(/^[A-Z]{2}[0-9A-Z]{2,13}$/, {
      message: "Le numéro de TVA client est invalide",
    })
    .optional()
    .nullable(),

  // Infos facture
  invoiceNumber: z.string().optional().nullable(),
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

  // Notes
  notes: z.string().optional().nullable(),
  terms: z.string().optional().nullable(),

  // Lignes du document
  items: z
    .array(documentItemSchema)
    .min(1, { message: "Le document doit contenir au moins une ligne" }),
});

export const updateDocumentSchema = createDocumentSchema.partial();

export const documentQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "name"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// ============================================
// TYPES
// ============================================

export type StyleConfig = z.infer<typeof styleConfigSchema>;
export type DocumentItemInput = z.infer<typeof documentItemSchema>;
export type UpdateDocumentItemInput = z.infer<typeof updateDocumentItemSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type DocumentQueryInput = z.infer<typeof documentQuerySchema>;
