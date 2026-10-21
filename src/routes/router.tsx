import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import SignUp from "../pages/signup/SignUp";
import Layout from "../layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import AuthProtectedRoute from "./AuthProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthProtectedRoute>
        <Login />
      </AuthProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthProtectedRoute>
        <SignUp />
      </AuthProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);

export default router;
