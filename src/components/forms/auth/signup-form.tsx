"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field";
import {
  AuthHeader,
  AuthFooterLink,
  AuthFooterLegal,
  OAuthButton,
  FormInput,
} from "@/components/shared";
import { routes } from "@/server/config/routes";
import { useState, useTransition } from "react";
import { ZodIssue } from "zod";
import { createUserSchema } from "@/server/modules/user/user.schema";
import { signup } from "@/services/auth.service";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { Role } from "@/server/modules/user/user.model";

const signupFormSchema = createUserSchema
  .extend({
    confirmPassword: z.string({ message: "La confirmation est requise" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<ZodIssue[]>([]);

  async function handleSignup(formData: FormData) {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const validation = signupFormSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    if (!validation.success) {
      setErrors(validation.error.issues);
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }

    setErrors([]);

    startTransition(async () => {
      const result = await signup({
        firstName: validation.data.firstName,
        lastName: validation.data.lastName,
        email: validation.data.email,
        password: validation.data.password,
        role: Role.USER,
      });

      if (result.success) {
        toast.success("Compte créé avec succès ! Vérifiez votre email.");
        redirect(
          routes.auth.verifyEmail + `?email=${encodeURIComponent(email)}`,
        );
      }

      toast.error(result.message || "Une erreur s'est produite !");
    });
  }

  return (
    <form
      action={handleSignup}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <AuthHeader
          title="Créez votre compte"
          description="Remplissez le formulaire ci-dessous pour créer votre compte"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Nom"
            type="text"
            name="lastName"
            required
            errors={errors}
          />
          <FormInput
            label="Prénom"
            type="text"
            name="firstName"
            required
            errors={errors}
          />
        </div>
        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="m@exemple.com"
          required
          errors={errors}
        />
        <FormInput
          label="Mot de passe"
          type="password"
          name="password"
          required
          description="Doit contenir au moins 8 caractères."
          errors={errors}
        />
        <FormInput
          label="Confirmez le mot de passe"
          type="password"
          required
          name="confirmPassword"
          errors={errors}
        />
        <Field>
          <Button loading={isPending} type="submit">
            Créer le compte
          </Button>
        </Field>
        <FieldSeparator>Ou continuez avec</FieldSeparator>
        <Field>
          <OAuthButton provider="google" action="signup" />
          <AuthFooterLink
            text="Vous avez déjà un compte ?"
            linkText="Connectez-vous"
            href={routes.auth.login}
          />
        </Field>
      </FieldGroup>
      <AuthFooterLegal />
    </form>
  );
}
