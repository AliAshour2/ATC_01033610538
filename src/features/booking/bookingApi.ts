import { db } from "@/lib/firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { handleError } from "@/helpers/handleError";

interface Booking {
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
    getUserBookings: builder.query<Booking[], string>({
      async queryFn(userId) {
        try {
          const bookingsRef = collection(db, 'bookings');
          const q = query(
            bookingsRef,
            where('userId', '==', userId),
            orderBy('bookedAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const bookings = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Booking[];
          return { data: bookings };
        } catch (error) {
          return handleError(error);
        }
      },
      providesTags: ['Booking'],
    }),
    
    getEventBookings: builder.query<Booking[], string>({
      async queryFn(eventId) {
        try {
          const bookingsRef = collection(db, 'bookings');
          const q = query(
            bookingsRef,
            where('eventId', '==', eventId),
            orderBy('bookedAt', 'desc')
          );
          const querySnapshot = await getDocs(q);
          const bookings = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Booking[];
          return { data: bookings };
        } catch (error) {
          return handleError(error);
        }
      },
      providesTags: ['Booking'],
    }),

    createBooking: builder.mutation<Booking, CreateBookingDto>({
      async queryFn(bookingData) {
        try {
          const booking = {
            ...bookingData,
            status: 'confirmed' as const,
            bookedAt: new Date().toISOString(),
            checkedIn: false,
          };
          const bookingsRef = collection(db, 'bookings');
          const docRef = await addDoc(bookingsRef, booking);
          return { data: { id: docRef.id, ...booking } };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ['Booking'],
    }),


    updateBookingStatus: builder.mutation<void, { id: string; status: Booking['status'] }>({
      async queryFn({ id, status }) {
        try {
          const docRef = doc(db, 'bookings', id);
          await updateDoc(docRef, { status });
          return { data: undefined };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ['Booking'],
    }),

        checkInBooking: builder.mutation<void, string>({
      async queryFn(bookingId) {
        try {
          const docRef = doc(db, 'bookings', bookingId);
          await updateDoc(docRef, {
            checkedIn: true,
            checkedInAt: new Date().toISOString(),
          });
          return { data: undefined };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ['Booking'],
    }),

    cancelBooking: builder.mutation<void, string>({
      async queryFn(id) {
        try {
          const docRef = doc(db, 'bookings', id);
          await updateDoc(docRef, { status: 'cancelled' });
          return { data: undefined };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ['Booking'],
    }),

    



  }),
});
