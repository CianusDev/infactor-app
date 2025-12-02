import { z } from "zod";

// Schéma de validation pour les variables d'environnement
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  DATABASE_URL: z.url({
    message: "DATABASE_URL must be a valid URL",
  }),
  JWT_SECRET: z
    .string({
      message: "JWT_SECRET is required",
    })
    .min(16, { message: "JWT_SECRET must be at least 16 characters long" }),
  ADMIN_EMAIL: z.email({
    message: "ADMIN_EMAIL must be a valid email address",
  }),
  ADMIN_PASSWORD: z.string({
    message: "ADMIN_PASSWORD is required",
  }),
  SESSION_SECRET: z
    .string({
      message: "SESSION_SECRET is required",
    })
    .min(16, {
      message: "SESSION_SECRET must be at least 16 characters long",
    }),
  CLOUDINARY_CLOUD_NAME: z.string({
    message: "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is required",
  }),
  CLOUDINARY_API_KEY: z.string({
    message: "NEXT_PUBLIC_CLOUDINARY_API_KEY is required",
  }),
  CLOUDINARY_API_SECRET: z.string({
    message: "CLOUDINARY_API_SECRET is required",
  }),
  GMAIL_USER: z.email({
    message: "GMAIL_USER must be a valid email address",
  }),
  GMAIL_APP_PASSWORD: z.string({
    message: "GMAIL_APP_PASSWORD is required",
  }),
  API_URL: z.url({
    message: "API_URL must be a valid URL",
  }),
});

// Type inféré du schéma
type EnvConfig = z.infer<typeof envSchema>;

// Validation et parsing des variables d'environnement
const validateEnv = (): EnvConfig => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`,
      );
      throw new Error(
        `Invalid environment variables:\n${errorMessages.join("\n")}`,
      );
    }
    throw error;
  }
};

export const envConfig = validateEnv();
