import AuthGuard from "@/components/auth/AuthGuard";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import AdminLayout from "@/components/layout/AdminLayout";
import MainLayout from "@/components/layout/MainLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminBookings from "@/pages/admin/AdminBookings";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import UnauthorizedPage from "@/pages/auth/UnauthorizedPage";
import BookingsPage from "@/pages/booking/BookingsPage";
import EventDetails from "@/pages/event/EventDetails";
import NotFoundPage from "@/pages/error/NotFoundPage";
import HomePage from "@/pages/home/HomePage";
import { UserRole } from "@/types";
import { Routes, Route } from "react-router";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="booking-confirmation/:eventId"
          element={
            <AuthGuard>
              <BookingConfirmation />
            </AuthGuard>
          }
        />
        <Route
          path="/bookings"
          element={
            <AuthGuard>
              <BookingsPage />
            </AuthGuard>
          }
        />
      </Route>

      {/* Admin Layout Protected Route */}
      <Route
        path="/admin"
        element={
          <AuthGuard allowedRoles={[UserRole.ADMIN]}>
            <AdminLayout />
          </AuthGuard>
          // <AdminLayout />
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="bookings" element={<AdminBookings />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
