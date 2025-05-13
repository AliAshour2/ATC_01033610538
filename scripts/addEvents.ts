import { collection, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { mockEvents } from "../utils/mockData";

async function addEventsToFirebase() {
  try {
    console.log("Starting to add events...");
    const eventsRef = collection(db, "events");

    for (const event of mockEvents) {
      await addDoc(eventsRef, event);
      console.log(`Added event: ${event.title}`);
    }

    console.log("All events added successfully!");
  } catch (error) {
    console.error("Error adding events:", error);
  }
}

// Run the function
addEventsToFirebase();
