import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    // Role not authorized for this route
    return <Navigate to="/" replace />;
  }

  // User authorized
  return <Outlet />;
};

export default ProtectedRoute;
