"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AuthHeader, AuthFooterLink, FormInput } from "@/components/shared";
import { routes } from "@/server/config/routes";
import { useState, useTransition } from "react";
import { ZodIssue } from "zod";
import { resetPasswordSchema } from "@/server/modules/user/user.schema";
import { resetPassword, resendResetCode } from "@/services/auth.service";
import { redirect, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

const resetPasswordFormSchema = resetPasswordSchema
  .extend({
    confirmPassword: z.string({ message: "La confirmation est requise" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const [isPending, startTransition] = useTransition();
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<ZodIssue[]>([]);
  const [otpValue, setOtpValue] = useState("");

  const otpError = errors.find((e) => e.path.includes("code"))?.message;

  async function handleResetPassword(formData: FormData) {
    const email = emailFromUrl;
    const code = otpValue;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const validation = resetPasswordFormSchema.safeParse({
      email,
      code,
      newPassword,
      confirmPassword,
    });

    if (!validation.success) {
      setErrors(validation.error.issues);
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    setErrors([]);

    startTransition(async () => {
      const result = await resetPassword({
        email: validation.data.email,
        code: validation.data.code,
        newPassword: validation.data.newPassword,
      });

      if (result.success) {
        toast.success("Mot de passe réinitialisé avec succès !");
        redirect(routes.auth.login);
      }

      toast.error(result.message || "Une erreur s'est produite !");
    });
  }

  async function handleResendCode() {
    if (!emailFromUrl) {
      toast.error("Email manquant. Veuillez recommencer le processus.");
      return;
    }

    setIsResending(true);

    try {
      const result = await resendResetCode({ email: emailFromUrl });

      if (result.success) {
        toast.success("Un nouveau code a été envoyé à votre email.");
      } else {
        toast.error(result.message || "Une erreur s'est produite !");
      }
    } catch {
      toast.error("Une erreur s'est produite !");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form
      action={handleResetPassword}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <AuthHeader
          title="Réinitialiser le mot de passe"
          description="Entrez le code reçu par e-mail et définissez votre nouveau mot de passe"
          showLogo
        />
        <Field data-invalid={!!otpError}>
          <FieldLabel htmlFor="otp">Code de vérification</FieldLabel>
          <InputOTP
            maxLength={6}
            id="otp"
            value={otpValue}
            onChange={setOtpValue}
            containerClassName="gap-4"
          >
            <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-10 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-lg">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup className="gap-2 *:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-10 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-lg">
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {otpError ? (
            <FieldError>{otpError}</FieldError>
          ) : (
            <FieldDescription>
              Vous n&apos;avez pas reçu le code ?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="underline underline-offset-4 hover:text-primary disabled:opacity-50"
              >
                {isResending ? "Envoi en cours..." : "Renvoyer"}
              </button>
            </FieldDescription>
          )}
        </Field>
        <FormInput
          label="Nouveau mot de passe"
          type="password"
          name="newPassword"
          required
          description="Doit contenir au moins 8 caractères."
          errors={errors}
        />
        <FormInput
          label="Confirmer le mot de passe"
          type="password"
          name="confirmPassword"
          required
          errors={errors}
        />
        <Field>
          <Button loading={isPending} type="submit">
            Réinitialiser le mot de passe
          </Button>
        </Field>
        <AuthFooterLink
          text="Vous vous souvenez de votre mot de passe ?"
          linkText="Se connecter"
          href={routes.auth.login}
        />
      </FieldGroup>
    </form>
  );
}
