import Footer from "./footer/Footer";
import NavBar from "./navbar/NavBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <NavBar />

      <Outlet />

      <Footer />
    </>
  );
}
