import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {  UserRole, type User } from '@/types';
import { handleError } from '@/helpers/handleError';

interface UpdateUserDto {
  name?: string;
  role?: UserRole;
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      async queryFn() {
        try {
          const usersRef = collection(db, 'users');
          const querySnapshot = await getDocs(usersRef);
          const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as User[];
          return { data: users };
        } catch (error) {
          return handleError(error);
        }
      },
      providesTags: ['User'],
    }),

    getUser: builder.query<User, string>({
      async queryFn(id) {
        try {
          const docRef = doc(db, 'users', id);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            throw new Error('User not found');
          }
          const user = { id: docSnap.id, ...docSnap.data() } as User;
          return { data: user };
        } catch (error) {
          return handleError(error);
        }
      },
      providesTags: ['User'],
    }),

    updateUser: builder.mutation<void, { id: string; data: UpdateUserDto }>({
      async queryFn({ id, data }) {
        try {
          const docRef = doc(db, 'users', id);
          const updateData = {
            ...(data.name && { name: data.name }),
            ...(data.role && { role: data.role }),
          };
          await updateDoc(docRef, updateData);
          return { data: undefined };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation<void, string>({
      async queryFn(id) {
        try {
          const docRef = doc(db, 'users', id);
          await deleteDoc(docRef);
          return { data: undefined };
        } catch (error) {
          return handleError(error);
        }
      },
      invalidatesTags: ['User'],
    }),

    getUsersByRole: builder.query<User[], UserRole>({
      async queryFn(role) {
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('role', '==', role));
          const querySnapshot = await getDocs(q);
          const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as User[];
          return { data: users };
        } catch (error) {
          return handleError(error);
        }
      },
      providesTags: ['User'],
    }),
  }),
});