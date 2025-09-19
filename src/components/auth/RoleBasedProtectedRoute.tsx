import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/SimpleAuthContext";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

interface RoleBasedProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("consumer" | "operator")[];
  redirectTo?: string;
}

const RoleBasedProtectedRoute = ({ 
  children, 
  allowedRoles,
  redirectTo 
}: RoleBasedProtectedRouteProps) => {
  const { user, loading, getUserRole } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = getUserRole();

  if (!userRole || !allowedRoles.includes(userRole)) {
    // Redirect based on user role if no custom redirect specified
    if (!redirectTo) {
      redirectTo = userRole === "operator" ? "/operator-dashboard" : "/browse";
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RoleBasedProtectedRoute;