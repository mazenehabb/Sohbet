import { RouterProvider } from "react-router-dom";
import "./App.css";
import router from "./routes/router";
import { Toast } from "@heroui/react";
function App() {
  return (
    <>
      <Toast.Provider
        className="sohbet-toast-region"
        placement="top end"
        gap={12}
        maxVisibleToasts={3}
        width="min(24rem, calc(100vw - 2rem))"
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
