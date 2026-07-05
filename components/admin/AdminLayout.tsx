"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface AdminLayoutProps {
  children: React.ReactNode;
  adminEmail: string;
  adminUsername: string;
}

export default function AdminLayout({ children, adminEmail, adminUsername }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-sand-50/50">
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

        {/* Dashboard Pages view */}
        <main className="flex-grow p-6 lg:p-10 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
