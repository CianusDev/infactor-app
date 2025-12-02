import nodemailer from "nodemailer";
import { envConfig } from "./env";
import { APP_NAME } from "@/lib/constant";

const appName = APP_NAME;

/**
 * Configuration SMTP pour Gmail
 */
export const smtpConfig = {
  host: "smtp.gmail.com",
  port: 587, // TLS est plus compatible avec Render que SSL (465)
  secure: false, // false pour port 587
  auth: {
    user: envConfig.GMAIL_USER,
    pass: envConfig.GMAIL_APP_PASSWORD,
  },
};

/**
 * Créer un transporteur Nodemailer pour Gmail
 */
export const createGmailTransporter = () => {
  return nodemailer.createTransport(smtpConfig);
};

/**
 * Options par défaut pour les emails
 */
export const defaultEmailOptions = {
  from: `"${appName}" <${envConfig.GMAIL_USER}}>`,
};

/**
 * Fonction utilitaire pour envoyer un email
 */
export const sendEmail = async (options: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  const transporter = createGmailTransporter();

  const mailOptions = {
    ...defaultEmailOptions,
    ...options,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email envoyé avec succès:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};

/**
 * Vérifier la connexion SMTP
 */
export const verifySmtpConnection = async (): Promise<boolean> => {
  try {
    const transporter = createGmailTransporter();
    await transporter.verify();
    console.log("✅ Connexion SMTP Gmail vérifiée avec succès");
    return true;
  } catch (error) {
    console.error("❌ Erreur de connexion SMTP Gmail:", error);
    return false;
  }
};

/**
 * Templates d'emails pré-définis
 */
export const emailTemplates = {
  resetPasswordAdmin: {
    subject: "Réinitialisation de votre mot de passe administrateur",
    html: (resetLink: string) => `
      <p>Bonjour,</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe administrateur. Cliquez sur le lien ci-dessous pour procéder :</p>
      <a href="${resetLink}">Réinitialiser mon mot de passe</a>
      <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
      <p>Cordialement,<br/>L'équipe ${appName}</p>
    `,
  },
  verificationCode: {
    subject: `Code de vérification - ${appName}`,
    html: ({
      firstName,
      lastName,
      otpCode,
    }: {
      firstName?: string;
      lastName?: string;
      otpCode: string;
    }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Code de vérification</h1>
        <p>Bonjour ${firstName || ""} ${lastName || ""},</p>
        <p>Voici votre code de vérification :</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #4F46E5; font-size: 32px  ; letter-spacing: 8px; margin: 0;">${otpCode}</h2>
        </div>
        <p style="color: #6b7280;">Ce code expirera dans 10 minutes.</p>
        <p>Cordialement,<br/>L'équipe ${appName}</p>
      </div>
    `,
  },
  resendVerificationCode: {
    subject: `Nouveau code de vérification - ${appName}`,
    html: ({
      firstName,
      lastName,
      otpCode,
    }: {
      firstName?: string;
      lastName?: string;
      otpCode: string;
    }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Nouveau code de vérification</h1>
        <p>Bonjour ${firstName || ""} ${lastName || ""},</p>
        <p>Voici votre nouveau code de vérification :</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #4F46E5; font-size: 32px; letter-spacing: 8px; margin: 0;">${otpCode}</h2>
        </div>
        <p style="color: #6b7280;">Ce code expirera dans 10 minutes.</p>
        <p>Cordialement,<br/>L'équipe ${appName}</p>
      </div>
    `,
  },
  resetPasswordCode: {
    subject: `Code de réinitialisation de mot de passe - ${appName}`,
    html: ({
      firstName,
      lastName,
      otpCode,
    }: {
      firstName?: string;
      lastName?: string;
      otpCode: string;
    }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Réinitialisation de mot de passe</h1>
        <p>Bonjour ${firstName || ""} ${lastName || ""},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe. Voici votre code de vérification :</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #4F46E5; font-size: 32px; letter-spacing: 8px; margin: 0;">${otpCode}</h2>
        </div>
        <p style="color: #6b7280;">Ce code expirera dans 10 minutes.</p>
        <p style="color: #ef4444;">Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
        <p>Cordialement,<br/>L'équipe ${appName}</p>
      </div>
    `,
  },
  resetPasswordSuccess: {
    subject: `Mot de passe modifié avec succès - ${appName}`,
    html: ({
      firstName,
      lastName,
    }: {
      firstName?: string;
      lastName?: string;
    }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Mot de passe modifié</h1>
        <p>Bonjour ${firstName || ""} ${lastName || ""},</p>
        <p>Votre mot de passe a été modifié avec succès.</p>
        <p style="color: #6b7280;">Si vous n'êtes pas à l'origine de cette modification, veuillez nous contacter immédiatement.</p>
        <p>Cordialement,<br/>L'équipe ${appName}</p>
      </div>
    `,
  },
};
