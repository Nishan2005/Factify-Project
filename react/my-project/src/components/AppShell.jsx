import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

export default function AppShell() {
  const { pathname } = useLocation();
  const isDarkTop = pathname === "/" || pathname === "/how-it-works";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar dark={isDarkTop} />
      <main className="flex-1">{<Outlet />}</main>
      <Footer />
    </div>
  );
}
