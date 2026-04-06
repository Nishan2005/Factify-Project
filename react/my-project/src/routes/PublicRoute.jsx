// PublicRoute prevents already-logged-in users from visiting /login or /register.
// If authenticated, redirects to home; otherwise renders the child route.
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
