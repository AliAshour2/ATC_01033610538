import { useGetAuthStateQuery } from "@/features/auth/authApi";
import type { UserRole } from "@/types";
import { Navigate, useLocation } from "react-router";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const AuthGuard = ({ children, allowedRoles }: AuthGuardProps) => {
  const { data: user, isLoading } = useGetAuthStateQuery();

  const location = useLocation();

  if (!isLoading && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }
   return <>{children}</>;
}; 

export default AuthGuard;
