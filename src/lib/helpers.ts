import { Role, User } from "@/generated/prisma/client";
import { envConfig } from "@/server/config/env";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";
import { ADMIN_TOKEN_VALIDITY_PERIOD, TOKEN_VALIDITY_PERIOD } from "./constant";

const secret = envConfig.JWT_SECRET!;
/**
 * Hashe un mot de passe en utilisant bcryptjs
 * @param password - Le mot de passe à hasher
 * @param saltRounds - Le nombre de rounds pour le salt (par défaut: 10)
 * @returns Le mot de passe hashé
 */
export const hashPassword = async (
  password: string,
  saltRounds: number = 10,
): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch {
    throw new Error("Erreur lors du hashage du mot de passe");
  }
};

/**
 * Compare un mot de passe en clair avec un hash
 * @param password - Le mot de passe en clair
 * @param hashedPassword - Le hash à comparer
 * @returns true si le mot de passe correspond, false sinon
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch {
    throw new Error("Erreur lors de la comparaison du mot de passe");
  }
};

/**
 * Crée un token JWT pour un utilisateur (Freelance, Company, Admin)
 * @param user - L'utilisateur pour lequel créer le token
 * @param role - Le rôle de l'utilisateur ('freelance', 'company', 'admin')
 * @param expiresIn - Durée de validité du token (par défaut: '7d' pour freelance/company, '1d' pour admin)
 * @returns Le token JWT signé
 */
export const createUserToken = (user: User): string => {
  try {
    let defaultExpiresIn = TOKEN_VALIDITY_PERIOD;
    const role = user.role;
    if (role === Role.ADMIN) defaultExpiresIn = ADMIN_TOKEN_VALIDITY_PERIOD;
    const options: SignOptions = { expiresIn: defaultExpiresIn };
    return jwt.sign({ user, role }, secret, options);
  } catch {
    throw new Error("Erreur lors de la création du token utilisateur");
  }
};

export const verifyUserToken = (
  token: string,
): {
  user: User | null;
} => {
  try {
    const decoded = jwt.verify(token, secret) as {
      user: User;
      role: Role;
    };
    return { user: decoded.user };
  } catch {
    return { user: null };
  }
};

export const createOTPToken = (
  email: string,
  code: string,
  data?: Record<string, string | undefined>,
  expiresIn: StringValue = "10m",
): string => {
  try {
    const options: SignOptions = { expiresIn };
    return jwt.sign({ email, code, data }, secret, options);
  } catch {
    throw new Error("Erreur lors de la création du token OTP");
  }
};

export const verifyOTPToken = (
  token: string,
): {
  email: string | null;
  code: string | null;
  data: Record<string, string> | null;
} => {
  try {
    const decoded = jwt.verify(token, secret) as {
      email: string;
      code: string;
      data?: Record<string, string>;
    };
    return {
      email: decoded.email,
      code: decoded.code,
      data: decoded.data || null,
    };
  } catch {
    return { email: null, code: null, data: null };
  }
};

/**
 * Génère un OTP (One Time Password) de la longueur spécifiée
 * @param length - La longueur du OTP (par défaut: 6)
 * @returns Un OTP sous forme de chaîne de caractères
 */
export const generateCodeOTP = (length: number = 6): string => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
};

export const generateRandomPassword = (length: number = 8): string => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return password;
};

export class Logger {
  static log(message: string) {
    console.log(`[LOG - ${new Date().toISOString()}]: ${message}`);
  }

  static error(message: string) {
    console.error(`[ERROR - ${new Date().toISOString()}]: ${message}`);
  }

  static warn(message: string) {
    console.warn(`[WARN - ${new Date().toISOString()}]: ${message}`);
  }
}
