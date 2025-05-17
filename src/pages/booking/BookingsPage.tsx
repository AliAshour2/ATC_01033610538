import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGetAuthStateQuery } from "@/features/auth/authApi";
import { useGetUserBookingsQuery, useCancelBookingMutation } from "@/features/booking/bookingApi";
import { useGetEventsQuery } from "@/features/events/eventApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, TicketCheck, X, ArrowRight, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";

const BookingsPage = () => {
  const navigate = useNavigate();
  const { data: authState } = useGetAuthStateQuery();
  const { data: userBookings, isLoading: bookingsLoading, refetch, error } = useGetUserBookingsQuery(
    authState?.id || "", 
    { skip: !authState }
  );
  const { data: events } = useGetEventsQuery();
  const [cancelBooking] = useCancelBookingMutation();
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Handle case where user is not authenticated
  if (!authState) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">
            Please sign in to view your bookings
          </p>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (bookingsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-muted rounded-md w-1/3 mb-4"></div>
                <div className="h-4 bg-muted rounded-md w-1/2 mb-2"></div>
                <div className="h-4 bg-muted rounded-md w-1/4 mb-4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Function to get event details for a booking
  const getEventDetails = (eventId: string) => {
    return events?.find((event) => event.id === eventId);
  };

  // Function to handle booking cancellation
  const handleCancelBooking = async (bookingId: string) => {
    try {
      setIsCancelling(true);
      await cancelBooking(bookingId).unwrap();
      toast.success("Booking cancelled successfully");
      refetch();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  // Check if the user has any bookings
  const hasBookings = userBookings && userBookings.length > 0;
  
  // Filter active bookings (not cancelled)
  const activeBookings = userBookings?.filter(
    (booking) => booking.status !== "cancelled"
  ) || [];
  
  // Filter past bookings (cancelled or checked in)
  const pastBookings = userBookings?.filter(
    (booking) => booking.status === "cancelled" || booking.checkedIn
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {!hasBookings ? (
          <div className="bg-card border rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Bookings Found</h2>
            <p className="text-muted-foreground mb-6">
              You haven't booked any events yet. Browse our events and book your first event!
            </p>
            <Button onClick={() => navigate("/events")}>
              Browse Events
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Bookings */}
            {activeBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  {activeBookings.map((booking) => {
                    const event = getEventDetails(booking.eventId);
                    if (!event) return null;
                    
                    const eventDate = new Date(event.date);
                    const isExpanded = expandedBooking === booking.id;
                    
                    return (
                      <motion.div
                        key={booking.id}
                        className="bg-card border rounded-lg overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">{event.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(eventDate, "EEEE, MMMM d, yyyy")}
                              </p>
                            </div>
                            <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 items-center text-sm mb-4">
                            <div className="flex items-center">
                              <TicketCheck className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{format(eventDate, "h:mm a")}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                              <span>{event.venue || event.location}</span>
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.3 }}
                            >
                              <Separator className="my-4" />
                              <div className="space-y-3 mb-4">
                                <p className="text-sm">
                                  <span className="font-medium">Booking ID:</span> {booking.id}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Booked On:</span>{" "}
                                  {format(new Date(booking.bookedAt), "MMMM d, yyyy")}
                                </p>
                                <p className="text-sm">
                                  <span className="font-medium">Total Price:</span>{" "}
                                  ${booking.totalPrice.toFixed(2)}
                                </p>
                              </div>
                            </motion.div>
                          )}
                          
                          <div className="flex flex-wrap gap-2 mt-4">
                            <Button
                              size="sm"
                              onClick={() => 
                                navigate(`/booking-confirmation/${booking.eventId}`, {
                                  state: { booking }
                                })
                              }
                            >
                              View Details
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setExpandedBooking(
                                isExpanded ? null : booking.id
                              )}
                            >
                              {isExpanded ? "Show Less" : "Show More"}
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleCancelBooking(booking.id)}
                              disabled={isCancelling}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel Booking
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Past Events</h2>
                <div className="space-y-4 opacity-70">
                  {pastBookings.map((booking) => {
                    const event = getEventDetails(booking.eventId);
                    if (!event) return null;
                    
                    return (
                      <div
                        key={booking.id}
                        className="bg-card border rounded-lg p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(event.date), "MMMM d, yyyy")}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {booking.checkedIn ? "Attended" : "Cancelled"}
                          </Badge>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/events/${event.id}`)}
                        >
                          View Event <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage; 