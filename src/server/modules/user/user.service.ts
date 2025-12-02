import { UserUpdateInput } from "@/generated/prisma/models";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/errors";
import { comparePassword, createUserToken, hashPassword } from "@/lib/helpers";
import { emailTemplates, sendEmail } from "@/server/config/email";
import { QueryDataParams } from "@/types/data";
import { OTPService } from "../otp/otp.service";
import { UserRepository } from "./user.repository";
import { CreateUserInput } from "./user.schema";

export class UserService {
  private readonly userRepository: UserRepository;
  private readonly otpService: OTPService;

  constructor() {
    this.userRepository = new UserRepository();
    this.otpService = new OTPService();
  }

  async loginUser(email: string, password: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError("Utilisateur non trouvé");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Email ou mot de passe invalide");
    }

    const token = createUserToken(user);
    return { user, token };
  }

  async registerUser({
    email,
    password,
    role,
    firstName,
    lastName,
  }: CreateUserInput) {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError("Cet email est déjà utilisé");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.userRepository.createUser({
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
    });

    if (!newUser) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }

    const otpCode = this.otpService.generateOTP(email);

    await sendEmail({
      to: email,
      subject: emailTemplates.verificationCode.subject,
      html: emailTemplates.verificationCode.html({
        firstName,
        lastName,
        otpCode,
      }),
    });

    return newUser;
  }

  async verifyUserEmail(email: string, code: string) {
    const isValid = await this.otpService.verifyOTP(email, code);
    if (!isValid) {
      throw new UnauthorizedError("Code de vérification invalide ou expiré");
    }

    const customer = await this.userRepository.findUserByEmail(email);
    if (!customer) {
      throw new NotFoundError("Client non trouvé");
    }

    const updatedUser = await this.userRepository.updateUserInfo(customer.id, {
      isVerified: true,
    });

    if (!updatedUser) {
      throw new ValidationError("Erreur lors de la vérification de l'email");
    }

    const token = createUserToken(updatedUser);

    return {
      user: updatedUser,
      token,
    };
  }

  async resendVerificationCode(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError("Client non trouvé");
    }

    if (user.isVerified) {
      throw new ConflictError("Ce compte est déjà vérifié");
    }

    const otpCode = this.otpService.generateOTP(email);

    await sendEmail({
      to: email,
      subject: emailTemplates.resendVerificationCode.subject,
      html: emailTemplates.resendVerificationCode.html({
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        otpCode,
      }),
    });

    return {
      success: true,
      message: "Un nouveau code de vérification a été envoyé à votre email",
    };
  }

  /**
   * Étape 1 : Demande de réinitialisation de mot de passe
   * Envoie un code OTP à l'email de l'utilisateur
   */
  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return {
        success: true,
        message:
          "Si un compte existe avec cet email, un code de réinitialisation a été envoyé.",
      };
    }

    const otpCode = this.otpService.generateOTP(email);

    await sendEmail({
      to: email,
      subject: emailTemplates.resetPasswordCode.subject,
      html: emailTemplates.resetPasswordCode.html({
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        otpCode,
      }),
    });

    return {
      success: true,
      message:
        "Si un compte existe avec cet email, un code de réinitialisation a été envoyé.",
    };
  }

  /**
   * Étape 2 : Réinitialisation du mot de passe avec le code OTP
   * Vérifie le code OTP et met à jour le mot de passe
   */
  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError("Utilisateur non trouvé");
    }

    const isValid = await this.otpService.verifyOTP(email, code);
    if (!isValid) {
      throw new UnauthorizedError(
        "Code de réinitialisation invalide ou expiré",
      );
    }

    const hashedPassword = await hashPassword(newPassword);

    await this.userRepository.updateUserPassword(user.id, hashedPassword);

    // Envoyer un email de confirmation
    await sendEmail({
      to: email,
      subject: emailTemplates.resetPasswordSuccess.subject,
      html: emailTemplates.resetPasswordSuccess.html({
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
      }),
    });

    return {
      success: true,
      message: "Mot de passe réinitialisé avec succès",
    };
  }

  /**
   * Renvoyer le code de réinitialisation de mot de passe
   */
  async resendPasswordResetCode(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      // Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
      return {
        success: true,
        message:
          "Si un compte existe avec cet email, un nouveau code a été envoyé.",
      };
    }

    const otpCode = this.otpService.generateOTP(email);

    await sendEmail({
      to: email,
      subject: emailTemplates.resetPasswordCode.subject,
      html: emailTemplates.resetPasswordCode.html({
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        otpCode,
      }),
    });

    return {
      success: true,
      message:
        "Si un compte existe avec cet email, un nouveau code a été envoyé.",
    };
  }

  async updateUserInfo(
    userId: string,
    { firstName, lastName }: UserUpdateInput,
  ) {
    const updatedUser = await this.userRepository.updateUserInfo(userId, {
      firstName,
      lastName,
    });
    if (!updatedUser) {
      throw new NotFoundError("Utilisateur non trouvé");
    }
    return updatedUser;
  }

  async deleteUserById(userId: string) {
    await this.userRepository.deleteUserById(userId);
    return;
  }

  async deleteUserByEmail(email: string) {
    await this.userRepository.deleteUserByEmail(email);
    return;
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError("Utilisateur non trouvé");
    }
    return user;
  }

  async getAllUsers({
    limit,
    offset,
    search,
    role,
    ...filters
  }: QueryDataParams) {
    const users = await this.userRepository.getAllUsers({
      limit,
      offset,
      role,
      search,
      ...filters,
    });
    return users;
  }
}
