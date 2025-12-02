import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/forms/auth/reset-password-form";
import { Skeleton } from "@/components/ui/skeleton";

function ResetPasswordFormSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<ResetPasswordFormSkeleton />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
