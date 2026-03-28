// src/routes/PublicRoute.jsx
// The OPPOSITE of ProtectedRoute.
// This prevents already-logged-in users from visiting /login or /register.
//
// If you're already logged in and try to go to /login,
// you'll be redirected to /dashboard instead.
//
// USAGE:
//   <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Already logged in → send to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in → show the public page (login, register, etc.)
  return children;
};

export default PublicRoute;
