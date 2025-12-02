import { Suspense } from "react";
import { OTPForm } from "@/components/forms/auth/otp-form";
import { Skeleton } from "@/components/ui/skeleton";

function OTPFormSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="flex justify-center gap-2">
        <Skeleton className="h-12 w-10" />
        <Skeleton className="h-12 w-10" />
        <Skeleton className="h-12 w-10" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-12 w-10" />
        <Skeleton className="h-12 w-10" />
        <Skeleton className="h-12 w-10" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function OTPPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<OTPFormSkeleton />}>
          <OTPForm />
        </Suspense>
      </div>
    </div>
  );
}
