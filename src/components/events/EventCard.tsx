/* eslint-disable react-refresh/only-export-components */
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import type { ReactNode } from "react";
import { formatDate } from "@/utils/utils";
import { Badge } from "../ui/badge";



// Main wrapper
function EventCardRoot({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="overflow-hidden card-hover">{children}</Card>
    </motion.div>
  );
}

// Image section
function EventCardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="h-48 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
    </div>
  );
}

// Content section
function EventCardContent({ event }: { event: Event }) {
  return (
    <CardContent className="p-4">
      <div className="flex justify-between items-center mb-2">
        <Badge variant="secondary">{event.category}</Badge>
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(event.date)}
        </div>
      </div>
      <h3 className="text-lg font-bold line-clamp-2 mb-2">{event.title}</h3>
      <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
        {event.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-semibold">${event.price.toFixed(2)}</span>
        <span className="text-sm text-muted-foreground">{event.venue}</span>
      </div>
    </CardContent>
  );
}

// Footer section
function EventCardFooter({
  eventId,
  isBooked,
}: {
  eventId: string;
  isBooked?: boolean;
}) {
  return (
    <CardFooter className="px-4 py-3 bg-muted/50 flex justify-between">
      {isBooked ? (
        <Badge className="ml-auto">Booked</Badge>
      ) : (
        <div className="w-full">
          <Link to={`/events/${eventId}`}>
            <Button className="w-full">View Details</Button>
          </Link>
        </div>
      )}
    </CardFooter>
  );
}

// Compound object
export const EventCard = {
  Root: EventCardRoot,
  Image: EventCardImage,
  Content: EventCardContent,
  Footer: EventCardFooter,
};