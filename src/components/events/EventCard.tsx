// /* eslint-disable react-refresh/only-export-components */
// import { motion } from "framer-motion";
// import { Calendar } from "lucide-react";
// import { Link } from "react-router-dom";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";

// import type { ReactNode } from "react";
// import { formatDate } from "@/utils/utils";
// import { Badge } from "../ui/badge";
// import type { Event } from "@/types";

// // Main wrapper
// function EventCardRoot({
//   children,
//   index,
// }: {
//   children: ReactNode;
//   index: number;
// }) {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3, delay: index * 0.05 }}
//     >
//       <Card className="pt-0 pb-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
//         {children}
//       </Card>
//     </motion.div>
//   );
// }

// // Image section
// function EventCardImage({ src, alt }: { src: string; alt: string }) {
//   return (
//     <div className="h-48 overflow-hidden">
//       <img
//         src={src}
//         alt={alt}
//         className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
//       />
//     </div>
//   );
// }

// // Content section
// function EventCardContent({ event }: { event: Event }) {
//   return (
//     <CardContent className="p-4">
//       <div className="flex justify-between items-center mb-2">
//         <Badge className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-100">
//           {event.category}
//         </Badge>
//         <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
//           <Calendar className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
//           {formatDate(event.date)}
//         </div>
//       </div>
//       <h3 className="text-lg font-bold line-clamp-2 mb-2 text-gray-800 dark:text-gray-100">
//         {event.title}
//       </h3>
//       <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-2">
//         {event.description}
//       </p>
//       <div className="flex items-center justify-between">
//         <span className="font-semibold text-gray-900 dark:text-gray-50">
//           ${event.price.toFixed(2)}
//         </span>
//         <span className="text-sm text-gray-500 dark:text-gray-400">
//           {event.venue}
//         </span>
//       </div>
//     </CardContent>
//   );
// }

// // Footer section
// function EventCardFooter({
//   eventId,
//   isBooked,
// }: {
//   eventId: string;
//   isBooked?: boolean;
// }) {
//   return (
//     <CardFooter className="mt-2 px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex justify-between">
//       {isBooked ? (
//         <Badge className="ml-auto bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-100">
//           Booked
//         </Badge>
//       ) : (
//         <div className="w-full">
//           <Link to={`/events/${eventId}`}>
//             <Button className="w-full bg-blue-500 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
//               View Details
//             </Button>
//           </Link>
//         </div>
//       )}
//     </CardFooter>
//   );
// }

// // Compound object
// export const EventCard = {
//   Root: EventCardRoot,
//   Image: EventCardImage,
//   Content: EventCardContent,
//   Footer: EventCardFooter,
// };


/* eslint-disable react-refresh/only-export-components */
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket } from "lucide-react";
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
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="p-0 h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl">
        {children}
      </Card>
    </motion.div>
  );
}

// Image section
function EventCardImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="h-48 overflow-hidden relative">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}

// Content section
function EventCardContent({ event }: { event: Event }) {
  return (
    <CardContent className="p-5 flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <Badge 
          className="px-2 py-1 text-xs font-medium bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 rounded-lg"
          variant="outline"
        >
          {event.category}
        </Badge>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-1 rounded-md">
          <Calendar className="h-3 w-3 mr-1.5" />
          {formatDate(event.date)}
        </div>
      </div>
      
      <h3 className="text-xl font-bold line-clamp-2 mb-3 text-gray-900 dark:text-gray-100">
        {event.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4 flex-1">
        {event.description}
      </p>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-2">
          <Ticket className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="font-semibold text-gray-900 dark:text-gray-50">
            ${event.price.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="truncate max-w-[120px]">{event.venue}</span>
        </div>
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
    <CardFooter className="px-5 py-4 bg-gray-50/50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
      {isBooked ? (
        <div className="w-full flex items-center justify-center space-x-2">
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-lg">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Booked
          </Badge>
        </div>
      ) : (
        <Link to={`/events/${eventId}`} className="w-full">
          <Button 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
            size="sm"
          >
            View Details
          </Button>
        </Link>
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