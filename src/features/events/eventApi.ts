import { handleError } from "@/helpers/handleError";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "@firebase/firestore";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  price: number;
  organizerId: string;
  imageUrl?: string;
  category?: string;
  tags?: string[];
}
type CreateEventDto = Omit<Event, "id">;
type UpdateEventDto = Partial<CreateEventDto>;

export const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    getEvents: builder.query<Event[], void>({
      async queryFn() {
        try {
          const eventsRef = collection(db, "events");
          const q = query(eventsRef, orderBy("date", "asc"));
          const querySnapshot = await getDocs(q);
          const events = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate().toISOString(),
          })) as Event[];
          return { data: events };
        } catch (error) {
          return handleError(error);
        }
      },
      providesTags: ["Event"],
    }),

    getEvent: builder.query<Event, string>({
      async queryFn(id) {
        try {
          const docRef = doc(db, "events", id);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            throw new Error("Event not found");
          }
          const event = {
            id: docSnap.id,
            ...docSnap.data(),
            date: docSnap.data().date.toDate().toISOString(),
          } as Event;
          return { data: event };
        } catch (error) {
          return handleError(error);
        }
      },
      providesTags: ["Event"],
    }),

    getEventsByOrganizer: builder.query<Event[], string>({
      async queryFn(organizerId) {
        try {
          const eventsRef = collection(db, "events");
          const q = query(
            eventsRef,
            where("organizerId", "==", organizerId),
            orderBy("date", "asc")
          );
          const querySnapshot = await getDocs(q);
          const events = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate().toISOString(),
          })) as Event[];
          return { data: events };
        } catch (error) {
          return handleError(error);
        }
      },
      providesTags: ["Event"],
    }),

    createEvent: builder.mutation<Event, CreateEventDto>({
      async queryFn(eventData) {
        try {
          const event = {
            ...eventData,
            date: Timestamp.fromDate(new Date(eventData.date)),
          };
          const eventsRef = collection(db, "events");
          const docRef = await addDoc(eventsRef, event);
          return {
            data: {
              id: docRef.id,
              ...eventData,
            },
          };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ["Event"],
    }),

    updateEvent: builder.mutation<void, { id: string; data: UpdateEventDto }>({
      async queryFn({ id, data }) {
        try {
          const docRef = doc(db, "events", id);
          const updateData = {
            ...data,
            ...(data.date && { date: Timestamp.fromDate(new Date(data.date)) }),
          };
          await updateDoc(docRef, updateData);
          return { data: undefined };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ["Event"],
    }),

    deleteEvent: builder.mutation<void, string>({
      async queryFn(id) {
        try {
          const docRef = doc(db, "events", id);
          await deleteDoc(docRef);
          return { data: undefined };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ["Event"],
    }),
  }),
});
