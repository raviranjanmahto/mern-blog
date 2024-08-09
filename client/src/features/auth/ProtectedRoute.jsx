import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Component to protect routes requiring authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentUser } = useSelector(state => state.user);

  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Redirect to email verification if email is not verified
  if (!currentUser?.emailVerified)
    return <Navigate to="/verify-email" replace />;

  return children;
};

export default ProtectedRoute;
