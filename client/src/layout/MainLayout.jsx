import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div
        className={`flex-1 mt-16 ${
          isAuthPage ? "flex items-center justify-center" : ""
        }`}
      >
        <Outlet />
      </div>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default MainLayout;
