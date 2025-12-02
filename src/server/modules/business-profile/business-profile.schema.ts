import z from "zod";

export const createBusinessProfileSchema = z.object({
  companyName: z.string({ message: "Le nom de l'entreprise est requis" }).optional(),
  address: z.string({ message: "L'adresse est requise" }).optional(),
  city: z.string({ message: "La ville est requise" }).optional(),
  postalCode: z.string({ message: "Le code postal est requis" }).optional(),
  country: z.string({ message: "Le pays est requis" }).optional(),
  phone: z.string({ message: "Le téléphone est requis" }).optional(),
  siret: z
    .string()
    .regex(/^[0-9]{14}$/, { message: "Le SIRET doit contenir 14 chiffres" })
    .optional()
    .nullable(),
  vatNumber: z
    .string()
    .regex(/^[A-Z]{2}[0-9A-Z]{2,13}$/, { message: "Le numéro de TVA est invalide" })
    .optional()
    .nullable(),
  logo: z.string().url({ message: "L'URL du logo est invalide" }).optional().nullable(),
  brandColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, { message: "La couleur doit être au format hexadécimal (#RRGGBB)" })
    .optional(),
});

export const updateBusinessProfileSchema = createBusinessProfileSchema.partial();

export const uploadLogoSchema = z.object({
  logo: z.string().url({ message: "L'URL du logo est invalide" }),
});

export type CreateBusinessProfileInput = z.infer<typeof createBusinessProfileSchema>;
export type UpdateBusinessProfileInput = z.infer<typeof updateBusinessProfileSchema>;
export type UploadLogoInput = z.infer<typeof uploadLogoSchema>;
