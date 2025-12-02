import { Role } from "@/generated/prisma/enums";
import z from "zod";

export const createUserSchema = z.object({
  firstName: z.string({ message: "Le prénom est requis" }).optional(),
  lastName: z.string({ message: "Le nom de famille est requis" }).optional(),
  email: z.email({ message: "Adresse e-mail invalide" }),
  password: z.string({ message: "Le mot de passe est requis" }).min(8, {
    message: "Le mot de passe doit comporter au moins 8 caractères",
  }),
  role: z
    .enum(Role, {
      message: "Le rôle de l'utilisateur est invalide",
    })
    .default(Role.USER),
});

export const loginUserSchema = z.object({
  email: z.email({ message: "Adresse e-mail invalide" }),
  password: z.string({ message: "Le mot de passe est requis" }),
});

export const updateUserSchema = z.object({
  firstName: z.string({ message: "Le prénom est requis" }).optional(),
  lastName: z.string({ message: "Le nom de famille est requis" }).optional(),
  // password: z
  //   .string({ message: "Le mot de passe est requis" })
  //   .min(8, {
  //     message: "Le mot de passe doit comporter au moins 8 caractères",
  //   })
  //   .optional(),
});

export const verifyUserEmailSchema = z.object({
  email: z.email({ message: "Adresse e-mail invalide" }),
  code: z.string({ message: "Le code de vérification est requis" }).length(6, {
    message: "Le code de vérification doit comporter 6 caractères",
  }),
});

export const resendVerificationCodeSchema = z.object({
  email: z.email({ message: "Adresse e-mail invalide" }),
});

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Adresse e-mail invalide" }),
});

export const resetPasswordSchema = z.object({
  email: z.email({ message: "Adresse e-mail invalide" }),
  code: z
    .string({ message: "Le code de réinitialisation est requis" })
    .length(6, {
      message: "Le code de réinitialisation doit comporter 6 caractères",
    }),
  newPassword: z
    .string({ message: "Le nouveau mot de passe est requis" })
    .min(8, {
      message: "Le nouveau mot de passe doit comporter au moins 8 caractères",
    }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type VerifyUserEmailInput = z.infer<typeof verifyUserEmailSchema>;
export type ResendVerificationCodeInput = z.infer<
  typeof resendVerificationCodeSchema
>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
