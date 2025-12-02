import z from "zod";

export const createOTPSchema = z.object({
  email: z.email({ message: "Format d'email invalide" }),
  code: z
    .string()
    .min(4, { message: "Le code doit contenir au moins 4 caractères" }),
});

export const verifyOTPSchema = z.object({
  email: z.email({ message: "Format d'email invalide" }),
  code: z
    .string()
    .min(4, { message: "Le code doit contenir au moins 4 caractères" }),
});

export const generateOTPSchema = z.object({
  email: z.email({ message: "Format d'email invalide" }),
});
