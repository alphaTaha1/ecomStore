import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ isAuthenticated = false, children }) {
  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  return children ?? <Outlet />;
}
