"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field";
import {
  AuthHeader,
  AuthFooterLink,
  OAuthButton,
  FormInput,
} from "@/components/shared";
import { routes } from "@/server/config/routes";
import Link from "next/link";
import { useState, useTransition } from "react";
import { ZodIssue } from "zod";
import { loginUserSchema } from "@/server/modules/user/user.schema";
import { signin } from "@/services/auth.service";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<ZodIssue[]>([]);
  // const formRef = React.useRef<HTMLFormElement | undefined>(undefined);
  async function handleSignin(formData: FormData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const validation = loginUserSchema.safeParse({
      email,
      password,
    });
    if (!validation.success) {
      setErrors(validation.error.issues);
      console.log(validation.error.issues);
      toast.error("Veuillez corriger les erreurs dans le formulaire.");
      return;
    }
    startTransition(async () => {
      const result = await signin(validation.data);
      if (result.success) {
        redirect(routes.app.home);
      }
      toast.error(result.message || "une erreur s'est produite !");
      return;
    });
  }
  return (
    <form
      action={handleSignin}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <AuthHeader
          title="Connectez-vous à votre compte"
          description="Entrez votre adresse e-mail ci-dessous pour vous connecter à votre compte"
        />
        <FormInput
          label="E-mail"
          type="email"
          name="email"
          placeholder="m@example.com"
          required
          errors={errors}
        />
        <FormInput
          label="Mot de passe"
          type="password"
          name="password"
          required
          errors={errors}
          labelRight={
            <Link
              href={routes.auth.forgotPassword}
              className="text-sm underline-offset-4 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          }
        />
        <Field>
          <Button loading={isPending} type="submit">
            Se connecter
          </Button>
        </Field>
        <FieldSeparator>Ou continuez avec</FieldSeparator>
        <Field>
          <OAuthButton provider="google" action="login" />
          <AuthFooterLink
            text="Vous n'avez pas de compte ?"
            linkText="Inscrivez-vous"
            href={routes.auth.signup}
          />
        </Field>
      </FieldGroup>
    </form>
  );
}
