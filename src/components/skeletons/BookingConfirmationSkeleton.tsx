import { motion } from 'framer-motion';
import { Skeleton } from '../ui/skeleton';

const BookingConfirmationSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-soft relative overflow-hidden p-6">
          {/* Success indicator */}
          <div className="flex justify-center mb-6">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>

          {/* Confirmation message */}
          <div className="text-center mb-8 space-y-2">
            <Skeleton className="h-8 w-64 mx-auto rounded" />
            <Skeleton className="h-4 w-80 mx-auto rounded" />
          </div>

          {/* Event information */}
          <div className="border-y border-border/50 py-6 my-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <Skeleton className="w-full h-32 rounded-md" />
              </div>
              <div className="md:w-2/3 space-y-4">
                <Skeleton className="h-6 w-48 rounded" />
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-3 w-32 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking details */}
          <div className="border-y border-border/50 py-6 my-6">
            <Skeleton className="h-6 w-40 mb-4 rounded" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-3 w-48 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Price information */}
          <div className="flex justify-between mb-8">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>

          {/* Footer information */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-full max-w-md mx-auto rounded" />
              <Skeleton className="h-3 w-full max-w-sm mx-auto rounded" />
            </div>

            <div className="h-[1px] w-full bg-muted/50 my-4" />

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Skeleton className="h-10 w-40 rounded-full" />
              <Skeleton className="h-10 w-40 rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmationSkeleton;