import z from "zod";

// ============================================
// TEMPLATE CONFIG SCHEMA
// ============================================

export const templateConfigSchema = z.object({
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
// TEMPLATE SCHEMAS
// ============================================

export const createTemplateSchema = z.object({
  name: z.string({ message: "Le nom du template est requis" }).min(1, {
    message: "Le nom du template ne peut pas être vide",
  }),
  description: z.string().optional().nullable(),
  preview: z
    .string()
    .url({ message: "L'URL de prévisualisation est invalide" })
    .optional()
    .nullable(),
  isDefault: z.boolean().optional(),
  config: templateConfigSchema,
});

export const updateTemplateSchema = createTemplateSchema.partial();

export const templateQuerySchema = z.object({
  search: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
  offset: z.coerce.number().int().nonnegative().optional(),
});

// ============================================
// TYPES
// ============================================

export type TemplateConfig = z.infer<typeof templateConfigSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type TemplateQueryInput = z.infer<typeof templateQuerySchema>;
