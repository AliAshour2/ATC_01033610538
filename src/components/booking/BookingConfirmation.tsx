import { useGetEventQuery } from "@/features/events/eventApi";
import { useGetUserBookingsQuery } from "@/features/booking/bookingApi";
import { useGetAuthStateQuery } from "@/features/auth/authApi";
import { motion } from "framer-motion";
import { Check, Clock, MapPin, Ticket, Download, Share2, RefreshCw } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import BookingConfirmationSkeleton from "../skeletons/BookingConfirmationSkeleton";
import { Calendar } from "lucide-react";
import { format } from 'date-fns';
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import type { Booking } from "@/features/booking/bookingApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * BookingConfirmation Component
 * 
 * This component displays the booking confirmation details after a user
 * successfully books an event. It fetches the booking details using 
 * the user's ID and event ID, then displays the ticket information.
 */
const BookingConfirmation = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isLoading: eventLoading } = useGetEventQuery(eventId as string);
  const { data: authState } = useGetAuthStateQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isGeneratingTicket, setIsGeneratingTicket] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Extract booking data from location state if available (passed from EventDetails)
  const bookingFromRedirect = location.state?.booking;

  // Get user's bookings if authenticated
  const { data: userBookings, isLoading: bookingsLoading, refetch } = useGetUserBookingsQuery(
    authState?.id || "", 
    { skip: !authState }
  );

  // If we have booking data from redirect, use it immediately
  useEffect(() => {
    if (bookingFromRedirect) {
      setBooking(bookingFromRedirect);
    }
  }, [bookingFromRedirect]);

  // Find the specific booking when data is available
  useEffect(() => {
    if (userBookings && eventId && !booking) {
      console.log("Looking for booking with eventId:", eventId);
      console.log("Available bookings:", userBookings);

      // First try to find a confirmed booking
      let eventBooking = userBookings.find(
        b => b.eventId === eventId && b.status === "confirmed"
      );
      
      // If not found, look for any booking for this event
      if (!eventBooking) {
        eventBooking = userBookings.find(b => b.eventId === eventId);
      }
      
      if (eventBooking) {
        console.log("Found booking:", eventBooking);
        setBooking(eventBooking);
      } else {
        console.log("No booking found for this event");
      }
    }
  }, [userBookings, eventId, booking]);

  // Function to manually refresh booking data
  const handleRefreshBookings = async () => {
    if (!authState) return;
    
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Booking data refreshed");
    } catch (error) {
      console.error("Error refreshing bookings:", error);
      toast.error("Failed to refresh booking data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Render loading skeleton while data is being fetched
  const isLoading = eventLoading || bookingsLoading;
  if (isLoading) {
    return <BookingConfirmationSkeleton />;
  }

  // Handle missing data
  if (!event || !authState) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Failed to load booking confirmation</p>
          <Button onClick={() => navigate("/events")}>Back to Events</Button>
        </div>
      </div>
    );
  }

  // If no booking was found for this event and user
  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">
            We couldn't find your booking for this event. It may take a moment to process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 mb-8">
            <Button 
              onClick={handleRefreshBookings}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {isRefreshing ? "Refreshing..." : "Refresh Booking Data"}
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button onClick={() => navigate("/bookings")}>
              Check My Bookings
            </Button>
            <Button variant="outline" onClick={() => navigate(`/events/${eventId}`)}>
              Return to Event
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Format dates for display
  const formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');
  const formattedTime = format(new Date(event.date), 'h:mm a');
  const bookingDate = format(new Date(booking.bookedAt), 'MMMM d, yyyy HH:mm');

  // Handle ticket download functionality
  const handleDownloadTicket = () => {
    setIsGeneratingTicket(true);
    // Simulate ticket generation (would be replaced with actual PDF generation in production)
    setTimeout(() => {
      toast.success("Ticket downloaded successfully");
      setIsGeneratingTicket(false);
    }, 1500);
  };

  // Handle booking sharing functionality
  const handleShareBooking = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My booking for ${event.title}`,
          text: `I just booked tickets for ${event.title} on ${formattedDate}!`,
          url: window.location.href
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      toast.success("Booking URL copied to clipboard");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-card border rounded-xl p-8 shadow-lg">
          {/* Success indicator */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Confirmation message */}
          <h1 className="text-3xl font-bold text-center mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Your ticket{booking.quantity > 1 ? 's' : ''} to {event.title} {booking.quantity > 1 ? 'have' : 'has'} been booked successfully
          </p>

          {/* Event information */}
          <div className="border-t border-b py-6 my-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={event.imageUrl || '/placeholder.jpg'}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
              <div className="md:w-2/3">
                <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{formattedTime}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.venue || event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking details */}
          <div className="border-t border-b py-6 my-6">
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-muted-foreground">
                <Ticket className="h-4 w-4 mr-2" />
                <span>Booking ID: {booking.id}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Booked On: {bookingDate}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Ticket className="h-4 w-4 mr-2" />
                <span>Quantity: {booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Price information */}
          <div className="flex justify-between mb-8">
            <span className="text-muted-foreground">Total Price:</span>
            <span className="font-semibold">${booking.totalPrice.toFixed(2)}</span>
          </div>

          {/* Action buttons for ticket */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button 
              className="flex items-center gap-2" 
              onClick={handleDownloadTicket}
              disabled={isGeneratingTicket}
            >
              <Download className="h-4 w-4" />
              {isGeneratingTicket ? "Generating..." : "Download Ticket"}
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleShareBooking}
            >
              <Share2 className="h-4 w-4" />
              Share Booking
            </Button>
          </div>

          {/* Footer information */}
          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-sm">
              A confirmation has been sent to your email address. You can also
              view your bookings anytime in your account.
            </p>

            <Separator className="my-4" />

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={() => navigate("/bookings")}>
                View My Bookings
              </Button>
              <Button variant="outline" onClick={() => navigate("/events")}>
                Browse More Events
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmation;
