import { UserUpdateInput } from "@/generated/prisma/models";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/errors";
import {
  comparePassword,
  createUserToken,
  generateRandomPassword,
  hashPassword,
} from "@/lib/helpers";
import { emailTemplates, sendEmail } from "@/server/config/email";
import { QueryDataParams } from "@/types/data";
import { OTPService } from "../otp/otp.service";
import { UserRepository } from "./user.repository";
import { CreateUserInput } from "./user.schema";

export class UserService {
  private readonly userRepository: UserRepository;
  private readonly optService: OTPService;
  constructor() {
    this.userRepository = new UserRepository();
    this.optService = new OTPService();
  }

  async loginUser(email: string, password: string) {
    // Implémentation de la connexion utilisateur
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError("Utilisateur non trouvé");
    }
    // Vérification du mot de passe avec timing constant pour éviter les timing attacks
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
    // Implémentation de l'inscription utilisateur
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError("Cet email est déjà utilisé");
    }
    const hashedPassword = await hashPassword(password);
    // Créer un nouvel utilisateur
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

    // Générer un code OTP
    const otpCode = this.optService.generateOTP(email);

    // Envoyer email avec code OTP
    await sendEmail({
      to: email,
      subject: emailTemplates.verificationCode.subject,
      html: emailTemplates.verificationCode.html({
        firstName,
        lastName,
        otpCode,
      }),
    });

    return {
      success: true,
      message:
        "Inscription réussie. Un code de vérification a été envoyé à votre email.",
      data: {
        user: newUser,
      },
    };
  }

  async verifyUserEmail(email: string, code: string) {
    // Vérifier le code OTP
    const isValid = await this.optService.verifyOTP(email, code);
    if (!isValid) {
      throw new UnauthorizedError("Code de vérification invalide ou expiré");
    }

    // Mettre à jour le statut de vérification du client
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

    // Générer le token après vérification réussie
    const token = createUserToken(updatedUser);

    return {
      success: true,
      message: "Email vérifié avec succès",
      data: {
        user: updatedUser,
        token,
      },
    };
  }

  async resendVerificationCode(email: string) {
    // Vérifier si le client existe
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new NotFoundError("Client non trouvé");
    }

    if (user.isVerified) {
      throw new ConflictError("Ce compte est déjà vérifié");
    }

    // Générer un nouveau code OTP
    const otpCode = this.optService.generateOTP(email);

    // Envoyer email avec le nouveau code
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

  async resetUserPassword(email: string) {
    // Vérifier si le client existe
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || !user.email) {
      throw new NotFoundError("Email introuvable");
    }

    const newPassword = generateRandomPassword(8);
    const hashedPassword = await hashPassword(newPassword);

    // Mettre à jour le mot de passe en base
    await this.userRepository.updateUserPassword(user.id, hashedPassword);

    // Envoyer l'email avec le nouveau mot de passe
    await sendEmail({
      to: email,
      subject: emailTemplates.resetPasswordCustomer.subject,
      html: emailTemplates.resetPasswordCustomer.html({
        firstName: user.firstName || undefined,
        lastName: user.lastName || undefined,
        newPassword,
      }),
    });

    return true;
  }

  async updateUserInfo(
    userId: string,
    { firstName, lastName }: UserUpdateInput,
  ) {
    // Implémentation de la mise à jour des informations utilisateur
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
    // Implémentation de la suppression utilisateur par ID
    await this.userRepository.deleteUserById(userId);
    return;
  }

  async deleteUserByEmail(email: string) {
    // Implémentation de la suppression utilisateur par email
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
