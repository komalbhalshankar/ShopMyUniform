import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/admin-login" replace />;
  }

  // Logged in, but not an admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin is allowed
  return children;
}

export default AdminRoute;