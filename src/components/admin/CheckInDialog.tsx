import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/features/booking/bookingApi";
import { CheckCircle2 } from "lucide-react";

interface CheckInDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isLoading?: boolean;
}

export const CheckInDialog = ({
  booking,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: CheckInDialogProps) => {
  if (!booking) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Check-In Confirmation
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Check in this booking for {booking.quantity} {booking.quantity > 1 ? "tickets" : "ticket"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 dark:text-emerald-400 mb-2" />
          <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
            Are you sure you want to check in this booking?
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            This will mark the booking as checked in at the current time.
          </p>
          {booking.checkedIn && (
            <div className="mt-4 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md text-sm">
              This booking was already checked in on {new Date(booking.checkedInAt!).toLocaleString()}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isLoading}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => onConfirm(booking.id)} 
            disabled={isLoading || booking.checkedIn}
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : booking.checkedIn ? (
              "Already Checked In"
            ) : (
              "Confirm Check-In"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};