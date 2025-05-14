import ShareEventButtons from "@/components/events/ShareEventButtons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetAuthStateQuery } from "@/features/auth/authApi";
import { useGetEventQuery } from "@/features/events/eventApi";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, Calendar, MapPin, CheckCircle } from "lucide-react";
import EventDetailsSkeleton from "@/components/skeletons/EventDetialsPageSkeleton";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  useCreateBookingMutation,
  useGetUserBookingsQuery,
  type Booking,
} from "@/features/booking/bookingApi";

const EventDetails = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isLoading, error } = useGetEventQuery(eventId as string);
  const { data: authState } = useGetAuthStateQuery();
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Get user's bookings if authenticated
  const { data: userBookings } = useGetUserBookingsQuery(authState?.id || "", {
    skip: !authState,
  });

  // Create booking mutation
  const [createBooking] = useCreateBookingMutation();

  // Check if user has already booked this event
  const isBooked = userBookings?.some(
    (booking: Booking) =>
      booking.eventId === eventId && booking.status !== "cancelled"
  );

  // Improved loading state
  if (isLoading) {
    return <EventDetailsSkeleton />;
  }

  // Error handling
  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-lg text-muted-foreground">
            Failed to load event details
          </p>
          <Button onClick={() => navigate("/")}>Back to Events</Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");

  const handleBookEvent = async () => {
    // Check if user is authenticated
    if (!authState) {
      toast.error("Please sign in to book this event");
      navigate("/login", { state: { from: `/event/${eventId}` } });
      return;
    }

    try {
      setIsBooking(true);
      // Create booking request
      const result = await createBooking({
        eventId: eventId as string,
        userId: authState.id,
        quantity,
        totalPrice: event.price * quantity,
      }).unwrap();

      // Navigate to booking confirmation page with booking data
      navigate(`/booking-confirmation/${eventId}`, { 
        state: { booking: result } 
      });
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error(
        "There was an error while booking this event. Please try again."
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => navigate("/")}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>

            <h1 className="text-4xl font-bold">{event.title}</h1>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="secondary">{event.category}</Badge>
              {event?.tags?.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              )) || []}
            </div>
          </div>

          <div className="rounded-lg overflow-hidden mb-8">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
            <p>{event.description}</p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-semibold mb-4">Venue Information</h2>
            <p>{event.venue || event.location}</p>

            <div className="mt-6">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBUUx1aToMrNcEhm9rX_J0LwS1mr_m3VE8&q=Space+Needle,Seattle+WA"
                ></iframe>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Social Sharing Section */}
            <ShareEventButtons event={event} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
            <div className="mb-6">
              <div className="text-2xl font-bold">
                ${event.price.toFixed(2)}
              </div>
              <div className="text-muted-foreground">per ticket</div>
            </div>

            {/* Add quantity selector */}
            {!isBooked && (
              <div className="mb-6">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium mb-2"
                >
                  Number of Tickets
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 bg-background px-3 py-2"
                  disabled={isBooking}
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "ticket" : "tickets"} ($
                      {(event.price * num).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Date and Time</div>
                  <div className="text-sm text-muted-foreground">
                    {formattedDate} at {formattedTime}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">
                    {event.venue || event.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking button section */}
            {isBooked ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center gap-2 text-primary bg-primary/10 p-3 rounded-md">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">You've booked this event</span>
                </div>
                <Button variant="outline" onClick={() => navigate("/bookings")}>
                  View My Bookings
                </Button>
              </div>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={handleBookEvent}
                disabled={isBooking}
              >
                {isBooking
                  ? "Booking..."
                  : `Book ${quantity > 1 ? quantity + " tickets" : "Now"} - $${(
                      event.price * quantity
                    ).toFixed(2)}`}
              </Button>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Secure checkout • Instant confirmation
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetails;
