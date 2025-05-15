import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { User } from "@/types";

interface DeleteUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string) => void;
  isLoading?: boolean;
}

export const DeleteUserDialog = ({
  user,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteUserDialogProps) => {
  if (!user) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-600 dark:text-red-500">
            Delete User
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-600 dark:text-zinc-300">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600 dark:text-red-400">{user.name}</span>? This
            action cannot be undone and will remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            className="bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-50"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(user.id)}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? "Deleting..." : "Delete User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
