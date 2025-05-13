import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    <Card className="pt-0 overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-48 overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content Skeleton */}
      <CardContent className="pt-0 p-4 pb-4">
        <div className="flex justify-between items-center mb-2">
          <Skeleton className="h-5 w-20 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>

        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-4" />

        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      </CardContent>

      {/* Footer Skeleton */}
      <CardFooter className="px-4 py-3 bg-muted/50">
        <Skeleton className="h-10 w-full rounded" />
      </CardFooter>
    </Card>
  );
}
