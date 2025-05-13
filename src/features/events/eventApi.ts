import { handleError } from "@/helpers/handleError";
import { db } from "@/lib/firebase";
import type { EventFilters } from "@/types";
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

import type { Event } from '@/types';
type CreateEventDto = Omit<Event, "id">;
type UpdateEventDto = Partial<CreateEventDto>;

export const eventApi = createApi({
  reducerPath: "eventApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Event"],
  endpoints: (builder) => ({
    getEvents: builder.query<Event[], EventFilters | void>({
      async queryFn(filters: EventFilters = {}) {
        try {
          const eventsRef = collection(db, "events");
          
          // Start with base query
          let baseQuery = query(eventsRef, orderBy("date", "asc"));
          
          // Build composite queries if filters are present
          if (filters.category || filters.tags?.length || filters.dateFrom || filters.dateTo) {
            const conditions = [];

            if (filters.category) {
              conditions.push(where("category", "==", filters.category));
            }

            if (filters.tags && filters.tags.length > 0) {
              // Firestore only supports one array-contains-any per query
              conditions.push(where("tags", "array-contains-any", filters.tags.slice(0, 10)));
            }

            if (filters.dateFrom) {
              const fromDate = new Date(filters.dateFrom);
              fromDate.setHours(0, 0, 0, 0);
              conditions.push(where("date", ">=", Timestamp.fromDate(fromDate)));
            }

            if (filters.dateTo) {
              const toDate = new Date(filters.dateTo);
              toDate.setHours(23, 59, 59, 999);
              conditions.push(where("date", "<=", Timestamp.fromDate(toDate)));
            }

            baseQuery = query(eventsRef, ...conditions, orderBy("date", "asc"));
          }

          const querySnapshot = await getDocs(baseQuery);
          let events = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              date: data.date.toDate().toISOString(),
              // Ensure venue is properly mapped from location if needed
              venue: data.venue || data.location,
            } as Event;
          });

          // Apply search filter client-side (Firestore doesn't support full-text search natively)
          if (filters.search) {
            const term = filters.search.toLowerCase();
            events = events.filter((event) =>
              event.title.toLowerCase().includes(term) || 
              event.description.toLowerCase().includes(term) ||
              event.venue?.toLowerCase().includes(term) ||
              event.category?.toLowerCase().includes(term)
            );
          }

          // Sort events by date
          events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useGetEventsByOrganizerQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
