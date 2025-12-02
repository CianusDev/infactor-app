import { Role } from "@/generated/prisma/enums";
import { ValidationError } from "@/lib/errors";
import z, { ZodError } from "zod";
import {
  createUserSchema,
  forgotPasswordSchema,
  loginUserSchema,
  resendVerificationCodeSchema,
  resetPasswordSchema,
  updateUserSchema,
  verifyUserEmailSchema,
} from "./user.schema";
import { UserService } from "./user.service";

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(data: z.infer<typeof loginUserSchema>) {
    try {
      const validated = loginUserSchema.parse(data);
      return await this.userService.loginUser(
        validated.email,
        validated.password,
      );
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  async register(data: z.infer<typeof createUserSchema>) {
    try {
      const validated = createUserSchema.parse({
        role: data.role,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      return await this.userService.registerUser(validated);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  /**
   * Étape 1 : Demande de réinitialisation de mot de passe (forgot-password)
   * Envoie un code OTP à l'email
   */
  async forgotPassword(data: z.infer<typeof forgotPasswordSchema>) {
    try {
      const validated = forgotPasswordSchema.parse(data);
      return await this.userService.requestPasswordReset(validated.email);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  /**
   * Étape 2 : Réinitialisation du mot de passe avec le code OTP (reset-password)
   * Vérifie le code et met à jour le mot de passe
   */
  async resetPassword(data: z.infer<typeof resetPasswordSchema>) {
    try {
      const validated = resetPasswordSchema.parse(data);
      return await this.userService.resetPassword(
        validated.email,
        validated.code,
        validated.newPassword,
      );
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  /**
   * Renvoyer le code de réinitialisation de mot de passe
   */
  async resendPasswordResetCode(data: z.infer<typeof forgotPasswordSchema>) {
    try {
      const validated = forgotPasswordSchema.parse(data);
      return await this.userService.resendPasswordResetCode(validated.email);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  async resendVerificationCode(
    data: z.infer<typeof resendVerificationCodeSchema>,
  ) {
    try {
      const { email } = resendVerificationCodeSchema.parse(data);
      return await this.userService.resendVerificationCode(email);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  async verifyEmail(data: z.infer<typeof verifyUserEmailSchema>) {
    try {
      const { email, code } = verifyUserEmailSchema.parse(data);
      return await this.userService.verifyUserEmail(email, code);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  async getAllUsers(params: {
    limit?: number;
    offset?: number;
    search?: string;
    role?: Role;
  }) {
    try {
      return await this.userService.getAllUsers(params);
    } catch (error) {
      throw error;
    }
  }

  async updateUserInfo(
    data: z.infer<typeof updateUserSchema> & { userId: string },
  ) {
    try {
      const validated = updateUserSchema.parse({
        firstName: data.firstName,
        lastName: data.lastName,
      });

      return await this.userService.updateUserInfo(data.userId, {
        ...validated,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationError(
          error.issues.map((e) => e.message).join(", "),
        );
      }
      throw error;
    }
  }

  async deleteUserById(userId: string) {
    try {
      return await this.userService.deleteUserById(userId);
    } catch (error) {
      throw error;
    }
  }
}
