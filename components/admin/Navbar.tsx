"use client";

import React, { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Menu, User, Bell, ChevronDown, Compass, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onMenuClick: () => void;
  adminEmail: string;
  adminUsername: string;
}

export default function Navbar({ onMenuClick, adminEmail, adminUsername }: NavbarProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const adminPath = (params?.adminPath as string) || "dashboard-x7k92m-admin";

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Parse path for breadcrumbs
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean);
    const adminIndex = segments.indexOf(adminPath);
    const breadcrumbSegments = adminIndex !== -1 ? segments.slice(adminIndex + 1) : segments;

    return breadcrumbSegments.map((segment, index) => {
      const href = "/" + segments.slice(0, segments.indexOf(segment) + 1).join("/");
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return { label, href, isLast: index === breadcrumbSegments.length - 1 };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${adminPath}/login` });
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white/70 backdrop-blur-md border-b border-sage-100 shadow-sm shadow-sage-950/5">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-sage-600 hover:bg-sage-50 lg:hidden focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        <nav className="hidden sm:flex items-center space-x-1.5 text-xs text-sage-500 font-medium tracking-wide">
          <Link href={`/${adminPath}/dashboard`} className="hover:text-sage-950 transition-colors">
            Admin
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={crumb.href}>
              <span className="text-sage-300">/</span>
              {crumb.isLast ? (
                <span className="text-sage-800 font-semibold">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-sage-950 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Notification & Profile Options */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon (Simulated) */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            className="p-2 rounded-full text-sage-600 hover:bg-sage-50 transition-colors relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
          </button>

          <AnimatePresence>
            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2.5 w-80 bg-white border border-sage-100 rounded-2xl shadow-xl z-20 overflow-hidden"
                >
                  <div className="px-4 py-3 bg-sage-50 border-b border-sage-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-sage-800">Notifications</h4>
                  </div>
                  <div className="divide-y divide-sage-50 max-h-64 overflow-y-auto">
                    <div className="p-4 hover:bg-sage-50/50 transition-colors text-xs text-sage-600 cursor-pointer">
                      <p className="font-semibold text-sage-900 mb-0.5">New client query received</p>
                      <p className="text-[10px] text-sage-400">5 minutes ago</p>
                    </div>
                    <div className="p-4 hover:bg-sage-50/50 transition-colors text-xs text-sage-600 cursor-pointer">
                      <p className="font-semibold text-sage-900 mb-0.5">Database seeded successfully</p>
                      <p className="text-[10px] text-sage-400">2 hours ago</p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full hover:bg-sage-50 transition-all duration-200"
          >
            <div className="h-7 w-7 rounded-full bg-sage-600 text-sand-50 flex items-center justify-center font-serif text-sm font-semibold uppercase">
              {adminUsername.charAt(0)}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-sage-900 leading-tight">{adminUsername}</p>
              <p className="text-[9px] text-sage-400 leading-none">{adminEmail}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-sage-500" />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2.5 w-52 bg-white border border-sage-100 rounded-2xl shadow-xl z-20 py-2"
                >
                  <Link
                    href={`/${adminPath}/settings`}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-sage-700 hover:bg-sage-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-sage-400" />
                    <span>Settings</span>
                  </Link>
                  <hr className="my-1 border-sage-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-red-400" />
                    <span>Log out</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
