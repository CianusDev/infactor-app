import { cn } from "@/lib/utils";
import { Logo } from "./logo";

interface AuthHeaderProps {
  title: string;
  description?: string;
  showLogo?: boolean;
  className?: string;
}

export function AuthHeader({
  title,
  description,
  showLogo = false,
  className,
}: AuthHeaderProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      {showLogo && <Logo />}
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && (
        <p className="text-muted-foreground text-sm text-balance">{description}</p>
      )}
    </div>
  );
}
