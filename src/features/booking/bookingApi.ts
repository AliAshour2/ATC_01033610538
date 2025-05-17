import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleError } from "@/helpers/handleError";

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  status: "pending" | "confirmed" | "cancelled";
  quantity: number;
  totalPrice: number;
  bookedAt: string;
  checkedIn?: boolean;
  checkedInAt?: string;
}

type CreateBookingDto = Omit<Booking, "id" | "status" | "bookedAt">;

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], void>({
      async queryFn() {
        try {
          const bookingsRef = collection(db, "bookings");
          const q = query(
            bookingsRef,
            orderBy("bookedAt", "desc")
          );
          const querySnapshot = await getDocs(q);
          const bookings = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Booking[];
          return { data: bookings };
        } catch (error) {
          return handleError(error);
        }
      },
      providesTags: ["Booking"],
    }),

    getUserBookings: builder.query<Booking[], string>({
      async queryFn(userId) {
        try {
          if (!userId) {
            return { data: [] };
          }
          
          const bookingsRef = collection(db, "bookings");
          
          try {
            // First try with compound query (requires index)
            const q = query(
              bookingsRef,
              where("userId", "==", userId),
              orderBy("bookedAt", "desc")
            );
            
            const querySnapshot = await getDocs(q);
            const bookings = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Booking[];
            
            return { data: bookings };
          } catch (indexError: unknown) {
            if ((indexError as { code: string }).code === 'failed-precondition') {
              // Fall back to simple query if index is missing
              const simpleQ = query(
                bookingsRef,
                where("userId", "==", userId)
              );
              
              const querySnapshot = await getDocs(simpleQ);
              const bookings = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as Booking[];
              
              // Sort manually in memory
              bookings.sort((a, b) => 
                new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
              );
              
              return { data: bookings };
            }
            throw indexError;
          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
          return handleError(error);
        }
      },
      providesTags: ["Booking"],
    }),

    getEventBookings: builder.query<Booking[], string>({
      async queryFn(eventId) {
        try {
          const bookingsRef = collection(db, "bookings");
          const q = query(
            bookingsRef,
            where("eventId", "==", eventId),
            orderBy("bookedAt", "desc")
          );
          const querySnapshot = await getDocs(q);
          const bookings = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Booking[];
          return { data: bookings };
        } catch (error) {
          return handleError(error);
        }
      },
      providesTags: ["Booking"],
    }),

    createBooking: builder.mutation<Booking, CreateBookingDto>({
      async queryFn(bookingData) {
        try {
          const booking = {
            ...bookingData,
            status: "confirmed" as const,
            bookedAt: new Date().toISOString(),
            checkedIn: false,
          };
          const bookingsRef = collection(db, "bookings");
          const docRef = await addDoc(bookingsRef, booking);
          return { data: { id: docRef.id, ...booking } };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ["Booking"],
    }),

    updateBookingStatus: builder.mutation<
      void,
      { id: string; status: Booking["status"] }
    >({
      async queryFn({ id, status }) {
        try {
          const docRef = doc(db, "bookings", id);
          await updateDoc(docRef, { status });
          return { data: undefined };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ["Booking"],
    }),

    checkInBooking: builder.mutation<void, string>({
      async queryFn(bookingId) {
        try {
          const docRef = doc(db, "bookings", bookingId);
          await updateDoc(docRef, {
            checkedIn: true,
            checkedInAt: new Date().toISOString(),
          });
          return { data: undefined };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ["Booking"],
    }),

    cancelBooking: builder.mutation<void, string>({
      async queryFn(id) {
        try {
          const docRef = doc(db, "bookings", id);
          await updateDoc(docRef, { status: "cancelled" });
          return { data: undefined };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ["Booking"],
    }),

    deleteBooking: builder.mutation<void, string>({
      async queryFn(id) {
        try {
          const docRef = doc(db, "bookings", id);
          await deleteDoc(docRef);
          return { data: undefined };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useCancelBookingMutation,
  useCheckInBookingMutation,
  useCreateBookingMutation,
  useDeleteBookingMutation,
  useGetEventBookingsQuery,
  useUpdateBookingStatusMutation,
  useGetUserBookingsQuery,
} = bookingApi;
