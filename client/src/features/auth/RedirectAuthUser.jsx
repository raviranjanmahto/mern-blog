import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Component to redirect authenticated users to the home page
const RedirectAuthUser = ({ children }) => {
  const { isAuthenticated, currentUser } = useSelector(state => state.user);

  // Redirect to home page if authenticated and email is verified
  if (isAuthenticated && currentUser?.emailVerified)
    return <Navigate to="/" replace />;

  return children;
};

export default RedirectAuthUser;
