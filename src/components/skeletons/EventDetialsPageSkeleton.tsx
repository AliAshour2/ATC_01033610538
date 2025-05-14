import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const EventDetailsSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Skeleton className="h-9 w-32 mb-4" />
            <Skeleton className="h-10 w-full mb-3" />

            <div className="flex flex-wrap gap-2 mt-3">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>

          <Skeleton className="w-full h-[400px] rounded-lg mb-8" />

          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/4" />

            <Separator className="my-8" />

            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-3/4" />

            <div className="mt-6">
              <Skeleton className="w-full h-[300px]" />
            </div>

            <Separator className="my-8" />

            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div>
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
            <div className="mb-6">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-16 mt-1" />
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 mr-2" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40 mt-1" />
                </div>
              </div>

              <div className="flex items-center">
                <Skeleton className="h-4 w-4 mr-2" />
                <div>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-36 mt-1" />
                </div>
              </div>
            </div>

            <Skeleton className="w-full h-10" />

            <Skeleton className="h-3 w-48 mt-6 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsSkeleton;
