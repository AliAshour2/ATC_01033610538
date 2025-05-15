/* eslint-disable react-refresh/only-export-components */
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import type { ReactNode } from "react";
import { formatDate } from "@/utils/utils";
import { Badge } from "../ui/badge";
import type { Event } from "@/types";

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
      <Card className="pt-0 pb-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        {children}
      </Card>
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
        <Badge className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-100">
          {event.category}
        </Badge>
        <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
          <Calendar className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
          {formatDate(event.date)}
        </div>
      </div>
      <h3 className="text-lg font-bold line-clamp-2 mb-2 text-gray-800 dark:text-gray-100">
        {event.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
        {event.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-900 dark:text-gray-50">
          ${event.price.toFixed(2)}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {event.venue}
        </span>
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
    <CardFooter className="mt-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-between">
      {isBooked ? (
        <Badge className="ml-auto bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100">
          Booked
        </Badge>
      ) : (
        <div className="w-full">
          <Link to={`/events/${eventId}`}>
            <Button className="w-full bg-blue-500 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
              View Details
            </Button>
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