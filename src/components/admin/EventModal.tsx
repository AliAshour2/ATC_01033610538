import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventForm, { type EventFormValues } from "./EventForm";
import type { Event } from "@/types";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormValues) => void;
  isLoading?: boolean;
  event?: Event;
}

export const EventModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  event,
}: EventModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create New Event"}</DialogTitle>
          <DialogDescription>
            {event
              ? "Update event details. Click save when you're done."
              : "Fill out the form below to create a new event."}
          </DialogDescription>
        </DialogHeader>
        <EventForm
          defaultValues={event ? {
            ...event,
            date: event.date ? new Date(event.date) : undefined,
            tags: event.tags ? event.tags.join(", ") : ""
          } : undefined}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}; 