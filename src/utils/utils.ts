import { format, parseISO } from "date-fns";
export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

export function formatTime(timeString: string): string {
  try {
    // If it's already in 12-hour format, return as is
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }
    
    // Otherwise parse and format
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes || "00"} ${ampm}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeString;
  }
}