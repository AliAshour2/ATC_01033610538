import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EventForm, { type EventFormSubmitValues } from "./EventForm";
import type { Event } from "@/types";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormSubmitValues) => void;
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
    <Dialog  open={isOpen} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto bg-gray-700">
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
            title: event.title,
            description: event.description,
            date: event.date ? new Date(event.date) : undefined,
            location: event.location,
            capacity: event.capacity,
            price: event.price,
            category: event.category,
            imageUrl: event.imageUrl,
            organizerId: event.organizerId,
            tags: event.tags ? event.tags.join(", ") : ""
          } : undefined}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}; 