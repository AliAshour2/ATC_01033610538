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
import { EventModal } from "@/components/admin/admin_events/EventModal";
import { DeleteEventDialog } from "@/components/admin/admin_events/DeleteEventDialog";

import type { Event } from "@/types";
import {
  Calendar,
  Edit,
  EyeIcon,
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash,
  Filter,
  RefreshCw,
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
import type { EventFormSubmitValues } from "@/components/admin/admin_events/EventForm";
import AdminEventTableSkeleton from "@/components/skeletons/AdminEventTableSkeleton";

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
    <div className="space-y-8 pb-10">
      <PageHeader
        title={
          <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
            Event Management
          </span>
        }
        description="Create and manage events on your platform"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground z-10" />
            </div>
            <Input
              placeholder="Search events..."
              className="pl-10 w-full bg-background/50 backdrop-blur-sm border-border/50 focus-visible:ring-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80"
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
            <Button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add Event</span>
            </Button>
          </div>
        </div>

        <div className="bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-soft overflow-hidden">
          {isLoadingEvents ? (
            // <div className="p-12 text-center">
            //   <div className="inline-block p-3 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-4">
            //     <RefreshCw className="h-6 w-6 text-primary-500 animate-spin" />
            //   </div>
            //   <p className="text-muted-foreground font-medium">Loading events...</p>
            // </div>
            <AdminEventTableSkeleton/>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Event</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Capacity</TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-12 text-muted-foreground"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="p-3 rounded-full bg-muted/50">
                            <Search className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <p className="font-medium">No events found</p>
                          <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEvents.map((event) => (
                      <TableRow 
                        key={event.id}
                        className="group hover:bg-muted/30 transition-colors duration-150"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            {event.imageUrl && (
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="h-12 w-20 rounded-md object-cover ring-1 ring-border/50 group-hover:ring-primary-300 dark:group-hover:ring-primary-700 transition-all duration-200"
                                onError={(e) =>
                                  (e.currentTarget.src = "/placeholder.jpg")
                                }
                              />
                            )}
                            <div>
                              <div className="font-semibold text-foreground group-hover:text-primary-500 transition-colors duration-150">{event.title}</div>
                              {event.tags && event.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {event.tags.slice(0, 3).map((tag, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs px-1.5 py-0 h-5 bg-background/80 border-border/50 text-muted-foreground hover:text-foreground transition-colors duration-150"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                  {event.tags.length > 3 && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs px-1.5 py-0 h-5 bg-background/80 border-border/50 text-muted-foreground hover:text-foreground transition-colors duration-150"
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
                          <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors duration-150">
                            <Calendar className="h-4 w-4 text-primary-400" />
                            {format(new Date(event.date), "MMM dd, yyyy")}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors duration-150">{event.location}</TableCell>
                        <TableCell>
                          {event.category && (
                            <Badge variant="secondary" className="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-800/50 transition-colors duration-150">
                              {event.category}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors duration-150">{event.capacity}</TableCell>
                        <TableCell className="font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-150">{formatCurrency(event.price)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 p-1.5 bg-background/95 backdrop-blur-sm border border-border/50 shadow-lg rounded-lg"
                            >
                              <DropdownMenuItem
                                asChild
                                className="flex items-center rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-muted/80 focus:bg-muted/80 transition-colors duration-150"
                              >
                                <Link
                                  to={`/events/${event.id}`}
                                  className="flex items-center w-full"
                                >
                                  <EyeIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                  View
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleOpenEditModal(event)}
                                className="flex items-center rounded-md px-2 py-2 text-sm cursor-pointer hover:bg-muted/80 focus:bg-muted/80 transition-colors duration-150"
                              >
                                <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => handleOpenDeleteDialog(event)}
                                className="flex items-center rounded-md px-2 py-2 text-sm cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20 transition-colors duration-150"
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
