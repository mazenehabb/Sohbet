import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: RouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
