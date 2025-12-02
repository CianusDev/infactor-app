import { FieldDescription } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AuthFooterProps {
  className?: string;
  children?: React.ReactNode;
}

interface AuthFooterLinkProps {
  text: string;
  linkText: string;
  href: string;
  className?: string;
}

interface AuthFooterLegalProps {
  className?: string;
  termsHref?: string;
  privacyHref?: string;
}

export function AuthFooter({ className, children }: AuthFooterProps) {
  return (
    <FieldDescription className={cn("text-center", className)}>
      {children}
    </FieldDescription>
  );
}

export function AuthFooterLink({
  text,
  linkText,
  href,
  className,
}: AuthFooterLinkProps) {
  return (
    <AuthFooter className={className}>
      {text}{" "}
      <Link href={href} className="underline underline-offset-4">
        {linkText}
      </Link>
    </AuthFooter>
  );
}

export function AuthFooterLegal({
  className,
  termsHref = "/terms",
  privacyHref = "/privacy",
}: AuthFooterLegalProps) {
  return (
    <FieldDescription className={cn("px-6 text-center", className)}>
      En cliquant sur continuer, vous acceptez nos{" "}
      <Link href={termsHref} className="underline underline-offset-4">
        Conditions d&apos;utilisation
      </Link>{" "}
      et notre{" "}
      <Link href={privacyHref} className="underline underline-offset-4">
        Politique de confidentialité
      </Link>
      .
    </FieldDescription>
  );
}
