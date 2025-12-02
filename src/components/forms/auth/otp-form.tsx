"use client";

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
import { cn } from "@/lib/utils";
import { AuthHeader, AuthFooterLegal } from "@/components/shared";
import { routes } from "@/server/config/routes";
import { useState, useTransition } from "react";
import { ZodIssue } from "zod";
import { verifyUserEmailSchema } from "@/server/modules/user/user.schema";
import { verifyEmail, resendVerificationCode } from "@/services/auth.service";
import { redirect, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function OTPForm({ className, ...props }: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";

  const [isPending, startTransition] = useTransition();
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<ZodIssue[]>([]);
  const [otpValue, setOtpValue] = useState("");

  const otpError = errors.find((e) => e.path.includes("code"))?.message;

  async function handleVerifyEmail() {
    const email = emailFromUrl;
    const code = otpValue;

    const validation = verifyUserEmailSchema.safeParse({
      email,
      code,
    });

    if (!validation.success) {
      setErrors(validation.error.issues);
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    setErrors([]);

    startTransition(async () => {
      const result = await verifyEmail(validation.data);

      if (result.success) {
        toast.success("Email vérifié avec succès !");
        redirect(routes.app.home);
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
      const result = await resendVerificationCode({ email: emailFromUrl });

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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={handleVerifyEmail}>
        <FieldGroup>
          <AuthHeader
            title="Entrez le code de vérification"
            description="Nous avons envoyé un code à 6 chiffres à votre adresse e-mail"
            showLogo
          />
          <Field data-invalid={!!otpError}>
            <FieldLabel htmlFor="otp" className="sr-only">
              Code de vérification
            </FieldLabel>
            <InputOTP
              maxLength={6}
              id="otp"
              value={otpValue}
              onChange={setOtpValue}
              containerClassName="gap-4"
            >
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            {otpError ? (
              <FieldError className="text-center">{otpError}</FieldError>
            ) : (
              <FieldDescription className="text-center">
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
          <Field>
            <Button loading={isPending} type="submit">
              Vérifier
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <AuthFooterLegal />
    </div>
  );
}
