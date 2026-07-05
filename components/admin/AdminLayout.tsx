"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface AdminLayoutProps {
  children: React.ReactNode;
  adminEmail: string;
  adminUsername: string;
}

export default function AdminLayout({ children, adminEmail, adminUsername }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();

  // Flash the top progress bar on every route change
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 600);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-sand-50/50">
      {/* Top progress bar on navigation */}
      <div
        className={`fixed top-0 left-0 right-0 z-[100] h-[3px] bg-gradient-to-r from-sage-600 via-gold-500 to-sage-400 transition-all duration-500 ease-out ${
          isNavigating ? "opacity-100 w-full" : "opacity-0 w-0"
        }`}
        style={{ transformOrigin: "left" }}
      />

      {/* Navigation Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Navbar */}
        <Navbar
          onMenuClick={() => setIsSidebarOpen(true)}
          adminEmail={adminEmail}
          adminUsername={adminUsername}
        />

        {/* Dashboard Pages view — fade in after navigation */}
        <main
          className={`flex-grow p-6 lg:p-10 max-w-7xl w-full mx-auto overflow-x-hidden transition-opacity duration-300 ${
            isNavigating ? "opacity-40 pointer-events-none" : "opacity-100"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
