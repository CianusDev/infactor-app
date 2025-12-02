import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TemplateSkeletonProps {
  className?: string;
}

/**
 * Skeleton de chargement pour une carte de template
 */
export function TemplateSkeleton({ className }: TemplateSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Preview skeleton */}
      <div className="aspect-[4/3] w-full">
        <Skeleton className="h-full w-full rounded-none" />
      </div>

      <CardHeader className="pb-2">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-3/4" />
        {/* Badge skeleton */}
        <Skeleton className="h-5 w-16 rounded-full" />
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description skeleton */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />

        {/* Config preview skeleton */}
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton de chargement pour la liste des templates
 */
interface TemplateListSkeletonProps {
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function TemplateListSkeleton({
  count = 6,
  columns = 3,
  className,
}: TemplateListSkeletonProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {Array.from({ length: count }).map((_, index) => (
        <TemplateSkeleton key={index} />
      ))}
    </div>
  );
}
