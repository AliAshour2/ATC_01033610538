import { authApi } from "@/features/auth/authApi";
import { bookingApi } from "@/features/booking/bookingApi";
import { eventApi } from "@/features/events/eventApi";
import { userApi } from "@/features/user/userApi";
import { configureStore } from "@reduxjs/toolkit";
const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      bookingApi.middleware,
      eventApi.middleware,
      userApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
