"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { AuthHeader, AuthFooterLink, FormInput } from "@/components/shared";
import { routes } from "@/server/config/routes";
import { useState, useTransition } from "react";
import { ZodIssue } from "zod";
import { forgotPasswordSchema } from "@/server/modules/user/user.schema";
import { forgotPassword } from "@/services/auth.service";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<ZodIssue[]>([]);

  async function handleForgotPassword(formData: FormData) {
    const email = formData.get("email") as string;

    const validation = forgotPasswordSchema.safeParse({ email });

    if (!validation.success) {
      setErrors(validation.error.issues);
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    setErrors([]);

    startTransition(async () => {
      const result = await forgotPassword(validation.data);

      if (result.success) {
        toast.success(
          "Un code de réinitialisation a été envoyé à votre email.",
        );
        redirect(
          routes.auth.resetPassword + `?email=${encodeURIComponent(email)}`,
        );
      }

      toast.error(result.message || "Une erreur s'est produite !");
    });
  }

  return (
    <form
      action={handleForgotPassword}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <AuthHeader
          title="Mot de passe oublié ?"
          description="Entrez votre adresse e-mail et nous vous enverrons un code pour réinitialiser votre mot de passe"
          showLogo
        />
        <FormInput
          label="E-mail"
          type="email"
          name="email"
          placeholder="m@example.com"
          required
          errors={errors}
        />
        <Field>
          <Button loading={isPending} type="submit">
            Envoyer le code
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
