import { useGetEventQuery } from "@/features/events/eventApi";
import { motion } from "framer-motion";
import { Check, Clock, MapPin } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import BookingConfirmationSkeleton from "../skeletons/BookingConfirmationSkeleton";
import { Calendar } from "lucide-react";
import { format } from 'date-fns';
import { Button } from "../ui/button";
const BookingConfirmation = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { data: event, isLoading, error } = useGetEventQuery(eventId as string);
  
  const navigate = useNavigate();

  if (isLoading) {
    return <BookingConfirmationSkeleton />;
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Failed to load booking confirmation</p>
          <Button onClick={() => navigate("/events")}>Back to Events</Button>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-card border rounded-xl p-8 shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Check className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            Your ticket to {event.title} has been booked successfully
          </p>

          <div className="border-t border-b py-6 my-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">                <img
                  src={event.imageUrl || '/placeholder.jpg'}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
              <div className="md:w-2/3">
                <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                <div className="space-y-2 text-sm">                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{format(new Date(event.date), 'HH:mm')}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.venue || event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mb-8">
            <span className="text-muted-foreground">Price:</span>
            <span className="font-semibold">${event.price.toFixed(2)}</span>
          </div>

          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-sm">
              A confirmation has been sent to your email address. You can also
              view your bookings anytime in your account.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={() => navigate("/my-bookings")}>
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
