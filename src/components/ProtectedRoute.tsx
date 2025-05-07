
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type UserRole = "admin" | "evaluator" | "assistant";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user has the required role
  if (currentUser && currentUser.role !== requiredRole) {
    // Redirect to the appropriate dashboard based on role
    if (currentUser.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (currentUser.role === "evaluator") {
      return <Navigate to="/evaluator" replace />;
    } else if (currentUser.role === "assistant") {
      return <Navigate to="/assistant" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
