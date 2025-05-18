import { useState, useEffect } from "react";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  CheckCircle,
  ClipboardCheck,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Trash,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  useGetBookingsQuery,
  useDeleteBookingMutation,
  useUpdateBookingStatusMutation,
  useCheckInBookingMutation,
  type Booking,
} from "@/features/booking/bookingApi";
import { useGetEventsQuery } from "@/features/events/eventApi";
import { useGetUsersQuery } from "@/features/user/userApi";
import { DeleteBookingDialog } from "@/components/admin/admin_bookings/DeleteBookingDialog";
import { BookingStatusDialog } from "@/components/admin/admin_bookings/BookingStatusDialog";
import { CheckInDialog } from "@/components/admin/admin_checkout/CheckInDialog";
import toast from "react-hot-toast";
import type { User, Event } from "@/types";

const AdminBookings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Booking["status"] | "all">(
    "all"
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isCheckInDialogOpen, setIsCheckInDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data: bookings = [], isLoading: isLoadingBookings } =
    useGetBookingsQuery();
  const { data: events = [] } = useGetEventsQuery();
  const { data: users = [] } = useGetUsersQuery();

  const [deleteBooking, { isLoading: isDeleting }] = useDeleteBookingMutation();
  const [updateBookingStatus, { isLoading: isUpdating }] =
    useUpdateBookingStatusMutation();
  const [checkInBooking, { isLoading: isCheckingIn }] =
    useCheckInBookingMutation();

  const [eventMap, setEventMap] = useState<Record<string, Event>>({});
  const [userMap, setUserMap] = useState<Record<string, User>>({});

  // Create lookup maps for events and users
  useEffect(() => {
    if (events.length > 0) {
      const map: Record<string, Event> = {};
      events.forEach((event) => {
        map[event.id] = event;
      });
      setEventMap(map);
    }
  }, [events]);

  useEffect(() => {
    if (users.length > 0) {
      const map: Record<string, User> = {};
      users.forEach((user) => {
        map[user.id] = user;
      });
      setUserMap(map);
    }
  }, [users]);

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      // Match by booking ID
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      // Match by user info if available
      userMap[booking.userId]?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      false ||
      userMap[booking.userId]?.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      false ||
      // Match by event info if available
      eventMap[booking.eventId]?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      false;

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenDeleteDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenStatusDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsStatusDialogOpen(true);
  };

  const handleOpenCheckInDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsCheckInDialogOpen(true);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteBooking(bookingId).unwrap();
      toast.success("Booking deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete booking"
      );
    }
  };

  const handleUpdateStatus = async (
    bookingId: string,
    status: Booking["status"]
  ) => {
    try {
      await updateBookingStatus({ id: bookingId, status }).unwrap();
      toast.success(`Booking status updated to ${status}`);
      setIsStatusDialogOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update booking status"
      );
    }
  };

  const handleCheckIn = async (bookingId: string) => {
    try {
      await checkInBooking(bookingId).unwrap();
      toast.success("Booking checked in successfully");
      setIsCheckInDialogOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to check in booking"
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusBadgeVariant = (
    status: Booking["status"],
    checkedIn?: boolean
  ) => {
    if (checkedIn) return "success";

    switch (status) {
      case "confirmed":
        return "default";
      case "cancelled":
        return "destructive";
      case "pending":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div>
      <PageHeader
        title="Booking Management"
        description="View and manage all bookings"
      />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={statusFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("all")}
                  >
                    All
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Show all bookings</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={
                      statusFilter === "confirmed" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setStatusFilter("confirmed")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Confirmed
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Show confirmed bookings</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("pending")}
                  >
                    <Calendar className="h-4 w-4 mr-1" /> Pending
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Show pending bookings</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={
                      statusFilter === "cancelled" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setStatusFilter("cancelled")}
                  >
                    <XCircle className="h-4 w-4 mr-1" /> Cancelled
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Show cancelled bookings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          {isLoadingBookings ? (
            <div className="p-8 text-center">
              <div className="animate-pulse">Loading bookings...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID/Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Booked On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No bookings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="space-y-1">
                          <div>
                              {eventMap[booking.eventId] ? (
                                <Link
                                  to={`/events/${booking.eventId}`}
                                  className="font-medium text-muted-foreground hover:underline truncate block max-w-[180px]"
                                >
                                  {eventMap[booking.eventId].title}
                                </Link>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Unknown event
                                </span>
                              )}
                            </div>
                            <div className="font-light text-sm">
                              {booking.id.substring(0, 8)}...
                            </div>
                            
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">
                              {userMap[booking.userId]?.name || "Unknown user"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {userMap[booking.userId]?.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              getStatusBadgeVariant(
                                booking.status,
                                booking.checkedIn
                              ) as
                                | "default"
                                | "destructive"
                                | "outline"
                                | "secondary"
                            }
                            className="flex items-center gap-1"
                          >
                            {booking.checkedIn && (
                              <CheckCircle className="h-3 w-3" />
                            )}
                            {booking.checkedIn ? "Checked In" : booking.status}
                          </Badge>
                          {booking.checkedIn && booking.checkedInAt && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(
                                new Date(booking.checkedInAt),
                                "MMM dd, HH:mm"
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{booking.quantity}</TableCell>
                        <TableCell>
                          {formatCurrency(booking.totalPrice)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {format(new Date(booking.bookedAt), "MMM dd, yyyy")}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(booking.bookedAt), "HH:mm")}
                          </div>
                        </TableCell>
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
                              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md min-w-[160px]"
                            >
                              {!booking.checkedIn &&
                                booking.status === "confirmed" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleOpenCheckInDialog(booking)
                                    }
                                    className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                                  >
                                    <ClipboardCheck className="mr-2 h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                                    <span className="text-emerald-600 dark:text-emerald-400">
                                      Check In
                                    </span>
                                  </DropdownMenuItem>
                                )}

                              <DropdownMenuItem
                                onClick={() => handleOpenStatusDialog(booking)}
                                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                              >
                                <Filter className="mr-2 h-4 w-4 text-blue-500 dark:text-blue-400" />
                                Change Status
                              </DropdownMenuItem>

                              {eventMap[booking.eventId] && (
                                <DropdownMenuItem
                                  asChild
                                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700"
                                >
                                  <Link
                                    to={`/events/${booking.eventId}`}
                                    className="flex items-center w-full cursor-pointer px-2 py-1.5 text-sm"
                                  >
                                    <Eye className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    View Event
                                  </Link>
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem
                                onClick={() => handleOpenDeleteDialog(booking)}
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

      <DeleteBookingDialog
        booking={selectedBooking}
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleDeleteBooking}
        isLoading={isDeleting}
      />

      <BookingStatusDialog
        booking={selectedBooking}
        isOpen={isStatusDialogOpen}
        onClose={() => {
          setIsStatusDialogOpen(false);
          setSelectedBooking(null);
        }}
        onSubmit={handleUpdateStatus}
        isLoading={isUpdating}
      />

      <CheckInDialog
        booking={selectedBooking}
        isOpen={isCheckInDialogOpen}
        onClose={() => {
          setIsCheckInDialogOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleCheckIn}
        isLoading={isCheckingIn}
      />
    </div>
  );
};

export default AdminBookings;
