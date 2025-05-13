import { Timestamp } from "firebase/firestore";
import {type Event  } from "@/types";

// Type for Firebase data (different from the frontend Event type)
type FirebaseEvent = Omit<Event, "id" | "date"> & {
  date: Timestamp;
};

// Helper function to create a Firebase Timestamp for a given date
const createDate = (date: string) => {
  const today = new Date();
  const eventDate = new Date(date);
  // If the date is in the past, move it to next year
  if (eventDate < today) {
    eventDate.setFullYear(today.getFullYear() + 1);
  }
  return Timestamp.fromDate(eventDate);
};

export const mockEvents: FirebaseEvent[] = [
  {
    title: "Web Development Workshop 2025",
    description: "Learn the latest web development technologies and best practices in this hands-on workshop.",
    date: createDate("2025-06-15"),
    location: "Tech Hub, Downtown",
    venue: "Tech Hub Conference Room",
    capacity: 50,
    price: 149.99,
    organizerId: "org123",
    category: "Technology",
    tags: ["web development", "coding", "javascript", "react"],
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop"
  },
  {
    title: "Summer Music Festival",
    description: "A day filled with live music performances from local and international artists.",
    date: createDate("2025-07-20"),
    location: "Central Park",
    venue: "Main Stage, Central Park",
    capacity: 5000,
    price: 89.99,
    organizerId: "org456",
    category: "Music",
    tags: ["music", "festival", "live performance", "outdoor"],
    imageUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop"
  },
  {
    title: "Business Networking Breakfast",
    description: "Connect with local entrepreneurs and business leaders over breakfast.",
    date: createDate("2025-05-30"),
    location: "Grand Hotel",
    venue: "Grand Hotel Ballroom",
    capacity: 100,
    price: 49.99,
    organizerId: "org789",
    category: "Business",
    tags: ["networking", "business", "entrepreneurship"],
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop"
  },
  {
    title: "Yoga in the Park",
    description: "Start your weekend with a relaxing yoga session in the park.",
    date: createDate("2025-06-01"),
    location: "Sunset Park",
    venue: "Sunset Park Lawn",
    capacity: 30,
    price: 15.00,
    organizerId: "org101",
    category: "Health",
    tags: ["yoga", "wellness", "outdoor", "fitness"],
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop"
  },
  {
    title: "Artificial Intelligence Conference",
    description: "Explore the latest developments in AI and machine learning.",
    date: createDate("2025-08-10"),
    location: "Science Center",
    venue: "Science Center Auditorium",
    capacity: 300,
    price: 299.99,
    organizerId: "org202",
    category: "Technology",
    tags: ["ai", "machine learning", "technology", "conference"],
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop"
  },
  {
    title: "Food & Wine Festival",
    description: "Taste exceptional wines paired with gourmet food from top local restaurants.",
    date: createDate("2025-09-05"),
    location: "Riverside Gardens",
    venue: "Riverside Gardens Plaza",
    capacity: 1000,
    price: 75.00,
    organizerId: "org303",
    category: "Food & Drink",
    tags: ["food", "wine", "culinary", "tasting"],
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop"
  },
  {
    title: "Photography Workshop",
    description: "Master the art of photography with professional photographers.",
    date: createDate("2025-06-22"),
    location: "Art Gallery",
    venue: "Art Gallery Workshop Space",
    capacity: 20,
    price: 199.99,
    organizerId: "org404",
    category: "Art",
    tags: ["photography", "art", "workshop", "creative"],
    imageUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&auto=format&fit=crop"
  },
  {
    title: "Startup Pitch Night",
    description: "Watch innovative startups pitch their ideas to investors.",
    date: createDate("2025-07-15"),
    location: "Innovation Hub",
    venue: "Innovation Hub Theater",
    capacity: 150,
    price: 0,
    organizerId: "org505",
    category: "Business",
    tags: ["startup", "business", "entrepreneurship", "pitch"],
    imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop"
  }
];
