import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/features/booking/bookingApi";

interface DeleteBookingDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isLoading?: boolean;
}

export const DeleteBookingDialog = ({
  booking,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteBookingDialogProps) => {
  if (!booking) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white rounded-lg shadow-lg p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-red-600">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-700 mt-2">
            This will permanently delete booking ID:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-800">
              {booking.id.substring(0, 8)}...
            </span>
            <br />
            <span className="text-red-500 font-medium">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex justify-end gap-3">
          <AlertDialogCancel
            disabled={isLoading}
            className="border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => onConfirm(booking.id)}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "Deleting..." : "Delete Booking"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
