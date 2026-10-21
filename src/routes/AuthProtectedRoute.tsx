import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RouteProps {
  children: ReactNode;
}

export default function AuthProtectedRoute({ children }: RouteProps) {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
