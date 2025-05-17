import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventModal } from "@/components/admin/EventModal";
import { DeleteEventDialog } from "@/components/admin/DeleteEventDialog";

import type { Event } from "@/types";
import {
  Calendar,
  Edit,
  EyeIcon,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash,
} from "lucide-react";
import type { FC } from "react";
import {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} from "@/features/events/eventApi";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import type { EventFormSubmitValues } from "@/components/admin/EventForm";

const AdminEvents: FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events = [], isLoading: isLoadingEvents } = useGetEventsQuery();
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.category &&
        event.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = (event: Event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateEvent = async (data: EventFormSubmitValues) => {
    try {
      await createEvent({
        title: data.title,
        description: data.description,
        date: data.date.toISOString(),
        location: data.location,
        capacity: data.capacity,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl,
        tags: data.tags,
        organizerId: "admin", // Default value, would be replaced with current user ID in a real app
      }).unwrap();
      setIsCreateModalOpen(false);
      toast.success("Event created successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create event"
      );
    }
  };

  const handleUpdateEvent = async (data: EventFormSubmitValues) => {
    if (!selectedEvent) return;

    try {
      await updateEvent({
        id: selectedEvent.id,
        data: {
          title: data.title,
          description: data.description,
          date: data.date.toISOString(),
          location: data.location,
          capacity: data.capacity,
          price: data.price,
          category: data.category,
          imageUrl: data.imageUrl,
          tags: data.tags,
        },
      }).unwrap();
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      toast.success("Event updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update event"
      );
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId).unwrap();
      setIsDeleteDialogOpen(false);
      setSelectedEvent(null);
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete event"
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div>
      <PageHeader
        title="Event Management"
        description="Create and manage events on your platform"
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex justify-between items-center mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden md:inline">Add Event</span>
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          {isLoadingEvents ? (
            <div className="p-8 text-center">
              <div className="animate-pulse">Loading events...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No events found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {event.imageUrl && (
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="h-10 w-20 rounded object-cover"
                                onError={(e) =>
                                  (e.currentTarget.src = "/placeholder.jpg")
                                }
                              />
                            )}
                            <div>
                              <div>{event.title}</div>
                              {event.tags && event.tags.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                  {event.tags.slice(0, 3).map((tag, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                  {event.tags.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      +{event.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {format(new Date(event.date), "MMM dd, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          {event.category && (
                            <Badge variant="secondary">{event.category}</Badge>
                          )}
                        </TableCell>
                        <TableCell>{event.capacity}</TableCell>
                        <TableCell>{formatCurrency(event.price)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md min-w-[150px]"
                            >
                              <DropdownMenuItem
                                asChild
                                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                              >
                                <Link
                                  to={`/events/${event.id}`}
                                  className="flex items-center w-full cursor-pointer px-2 py-1.5 text-sm"
                                >
                                  <EyeIcon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                  View
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleOpenEditModal(event)}
                                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                              >
                                <Edit className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleOpenDeleteDialog(event)}
                                className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 focus:bg-red-50 dark:focus:bg-red-900/30"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </motion.div>

      <EventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
        isLoading={isCreating}
      />

      <EventModal
        event={selectedEvent || undefined}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
        }}
        onSubmit={handleUpdateEvent}
        isLoading={isUpdating}
      />

      <DeleteEventDialog
        event={selectedEvent}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedEvent(null);
        }}
        onConfirm={handleDeleteEvent}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdminEvents;
