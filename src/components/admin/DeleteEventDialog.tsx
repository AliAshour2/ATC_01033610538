import {
  AlertDialog,
  // AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types";

interface DeleteEventDialogProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  isLoading?: boolean;
}

export const DeleteEventDialog = ({
  event,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteEventDialogProps) => {
  if (!event) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600 dark:text-red-500">
            Are you sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-600 dark:text-zinc-300">
            This will permanently delete the event{" "}
            <span className="font-semibold text-red-600 dark:text-red-400">"{event.title}"</span>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            className="bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50"
          >
            Cancel
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => onConfirm(event.id)}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete Event"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
