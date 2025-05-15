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
import { handleError } from "@/helpers/handleError";

const BookingConfirmation = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isLoading: eventLoading } = useGetEventQuery(eventId as string);
  const { data: authState } = useGetAuthStateQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isGeneratingTicket, setIsGeneratingTicket] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const bookingFromRedirect = location.state?.booking;

  const { data: userBookings, isLoading: bookingsLoading, refetch } = useGetUserBookingsQuery(
    authState?.id || "", 
    { skip: !authState }
  );

  useEffect(() => {
    if (bookingFromRedirect) {
      setBooking(bookingFromRedirect);
    }
  }, [bookingFromRedirect]);

  useEffect(() => {
    if (userBookings && eventId && !booking) {
      let eventBooking = userBookings.find(
        b => b.eventId === eventId && b.status === "confirmed"
      );
      
      if (!eventBooking) {
        eventBooking = userBookings.find(b => b.eventId === eventId);
      }
      
      if (eventBooking) {
        setBooking(eventBooking);
      }
    }
  }, [userBookings, eventId, booking]);

  const handleRefreshBookings = async () => {
    if (!authState) return;
    
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Booking data refreshed");
    } catch (error) {
      handleError(error)
      toast.error("Failed to refresh booking data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const isLoading = eventLoading || bookingsLoading;
  if (isLoading) {
    return <BookingConfirmationSkeleton />;
  }

  if (!event || !authState) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Failed to load booking confirmation
          </p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            onClick={() => navigate("/events")}
          >
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            We couldn't find your booking for this event. It may take a moment to process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 mb-8">
            <Button 
              onClick={handleRefreshBookings}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
            >
              <RefreshCw className="h-4 w-4" />
              {isRefreshing ? "Refreshing..." : "Refresh Booking Data"}
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              onClick={() => navigate("/bookings")}
            >
              Check My Bookings
            </Button>
            <Button 
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => navigate(`/events/${eventId}`)}
            >
              Return to Event
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');
  const formattedTime = format(new Date(event.date), 'h:mm a');
  const bookingDate = format(new Date(booking.bookedAt), 'MMMM d, yyyy HH:mm');

  const handleDownloadTicket = () => {
    setIsGeneratingTicket(true);
    setTimeout(() => {
      toast.success("Ticket downloaded successfully");
      setIsGeneratingTicket(false);
    }, 1500);
  };

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
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg">
          {/* Success indicator */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>

          {/* Confirmation message */}
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">
            Booking Confirmed!
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Your ticket{booking.quantity > 1 ? 's' : ''} to {event.title} {booking.quantity > 1 ? 'have' : 'has'} been booked successfully
          </p>

          {/* Event information */}
          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 my-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={event.imageUrl || '/placeholder.jpg'}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-md border border-gray-200 dark:border-gray-700"
                />
              </div>
              <div className="md:w-2/3">
                <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">{event.title}</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span>{formattedTime}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <span>{event.venue || event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking details */}
          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 my-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Booking Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Ticket className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>Booking ID: {booking.id}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>Booked On: {bookingDate}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Ticket className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                <span>Quantity: {booking.quantity} ticket{booking.quantity > 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Price information */}
          <div className="flex justify-between mb-8">
            <span className="text-gray-600 dark:text-gray-400">Total Price:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">${booking.totalPrice.toFixed(2)}</span>
          </div>

          {/* Action buttons for ticket */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <Button 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              onClick={handleDownloadTicket}
              disabled={isGeneratingTicket}
            >
              <Download className="h-4 w-4" />
              {isGeneratingTicket ? "Generating..." : "Download Ticket"}
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleShareBooking}
            >
              <Share2 className="h-4 w-4" />
              Share Booking
            </Button>
          </div>

          {/* Footer information */}
          <div className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              A confirmation has been sent to your email address. You can also
              view your bookings anytime in your account.
            </p>

            <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                onClick={() => navigate("/bookings")}
              >
                View My Bookings
              </Button>
              <Button 
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => navigate("/events")}
              >
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