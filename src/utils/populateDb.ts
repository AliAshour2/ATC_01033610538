import { collection, addDoc, getDocs, query, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { mockEvents } from "./mockData";

export async function populateEvents() {
  try {
    console.log("🚀 Starting to populate events...");
    
    // First, clear existing events
    console.log("🗑️ Clearing existing events...");
    const eventsRef = collection(db, "events");
    const existingEvents = await getDocs(query(eventsRef));
    const deletePromises = existingEvents.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Then add new events
    console.log("📝 Adding new events...");
    let addedCount = 0;
    
    for (const event of mockEvents) {
      await addDoc(eventsRef, event);
      addedCount++;
      console.log(`✅ Added event (${addedCount}/${mockEvents.length}): ${event.title}`);
    }
    
    console.log(`✨ Successfully populated ${addedCount} events!`);
    return addedCount;
  } catch (error) {
    console.error("❌ Error populating events:", error);
    throw error;
  }
}
