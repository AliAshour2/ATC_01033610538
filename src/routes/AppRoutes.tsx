import AuthGuard from "@/components/auth/AuthGuard";
import BookingConfirmation from "@/components/booking/BookingConfirmation";
import AdminLayout from "@/components/layout/AdminLayout";
import MainLayout from "@/components/layout/MainLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import BookingsPage from "@/pages/booking/BookingsPage";
import EventDetails from "@/pages/event/EventDetails";
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
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* 404 Not Found */}
    </Routes>
  );
};

export default AppRoutes;
