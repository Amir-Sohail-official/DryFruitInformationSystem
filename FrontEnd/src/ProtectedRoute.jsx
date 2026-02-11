import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  
  if (loading) return <p>Loading...</p>;
  
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  // Check if admin access is required
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  return children;
}
