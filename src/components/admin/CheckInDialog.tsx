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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check-In Confirmation</DialogTitle>
          <DialogDescription>
            Check in this booking for {booking.quantity} {booking.quantity > 1 ? "tickets" : "ticket"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center justify-center text-center space-y-2">
          <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
          <p className="text-lg font-medium">Are you sure you want to check in this booking?</p>
          <p className="text-sm text-muted-foreground">
            This will mark the booking as checked in at the current time.
          </p>
          {booking.checkedIn && (
            <div className="mt-4 text-amber-500 bg-amber-50 p-3 rounded-md text-sm">
              This booking was already checked in on {new Date(booking.checkedInAt!).toLocaleString()}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={() => onConfirm(booking.id)} 
            disabled={isLoading || booking.checkedIn}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Processing..." : booking.checkedIn ? "Already Checked In" : "Confirm Check-In"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 