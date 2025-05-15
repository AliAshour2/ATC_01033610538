import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Booking } from "@/features/booking/bookingApi";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react"; // Lucide icon import

interface BookingStatusDialogProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (bookingId: string, status: Booking["status"]) => void;
  isLoading?: boolean;
}

export const BookingStatusDialog = ({
  booking,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: BookingStatusDialogProps) => {
  const [status, setStatus] = useState<Booking["status"]>(
    booking?.status || "pending"
  );

  if (!booking) return null;

  const handleSubmit = () => {
    onSubmit(booking.id, status);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as Booking["status"]);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
        if (open && booking) setStatus(booking.status);
      }}
    >
      <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            Update Booking Status
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Change the status of booking ID: {booking.id.substring(0, 8)}...
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="status"
              className="text-right text-gray-700 dark:text-gray-300"
            >
              Status
            </Label>
            <Select
              value={status}
              onValueChange={handleStatusChange}
              disabled={isLoading}
            >
              <SelectTrigger className="col-span-3 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectGroup>
                  <SelectItem
                    value="pending"
                    className="hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                      Pending
                    </span>
                  </SelectItem>
                  <SelectItem
                    value="confirmed"
                    className="hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      Confirmed
                    </span>
                  </SelectItem>
                  <SelectItem
                    value="cancelled"
                    className="hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      Cancelled
                    </span>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
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
            onClick={handleSubmit}
            disabled={isLoading || status === booking.status}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Updating...
              </span>
            ) : (
              "Update Status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
