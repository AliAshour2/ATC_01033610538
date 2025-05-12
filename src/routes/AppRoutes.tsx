import AuthGuard from "@/components/auth/AuthGuard";
import AdminLayout from "@/components/layout/AdminLayout";
import MainLayout from "@/components/layout/MainLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { UserRole } from "@/types";
import { Routes, Route } from "react-router";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />} />

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
