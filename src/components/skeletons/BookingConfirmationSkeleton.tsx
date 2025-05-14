import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const BookingConfirmationSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-card border rounded-xl p-8 shadow-lg">
          {/* Checkmark Icon */}
          <div className="flex justify-center mb-6">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>
          
          {/* Title */}
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>
          
          {/* Event Details */}
          <div className="border-t border-b py-6 my-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image */}
              <div className="md:w-1/3">
                <Skeleton className="w-full h-32 rounded-md" />
              </div>
              
              {/* Text Details */}
              <div className="md:w-2/3 space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Price */}
          <div className="flex justify-between mb-8">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          
          {/* Footer */}
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-full max-w-md mx-auto" />
              <Skeleton className="h-3 w-full max-w-sm mx-auto" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Skeleton className="h-10 w-32 mx-auto sm:mx-0" />
              <Skeleton className="h-10 w-40 mx-auto sm:mx-0" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmationSkeleton;