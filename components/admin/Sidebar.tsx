"use client";

import React from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Mail,
  Sparkles,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const adminPath = (params?.adminPath as string) || "dashboard-x7k92m-admin";

  const menuItems = [
    {
      name: "Dashboard",
      href: `/${adminPath}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: "Messages",
      href: `/${adminPath}/messages`,
      icon: Mail,
    },
    {
      name: "Services",
      href: `/${adminPath}/services`,
      icon: Sparkles,
    },
    {
      name: "Team Members",
      href: `/${adminPath}/team`,
      icon: Users,
    },
    {
      name: "Settings",
      href: `/${adminPath}/settings`,
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${adminPath}/login` });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sage-950 text-sand-100 border-r border-sage-800">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sage-800">
        <div className="p-2 rounded-xl bg-gold-600/20 text-gold-400">
          <Compass className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-serif font-bold text-lg tracking-wide leading-tight">Yogabhyasi</h2>
          <span className="text-[10px] font-semibold tracking-wider text-sage-400 uppercase">Admin Panel</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-sage-800 text-gold-400 shadow-md shadow-black/10"
                  : "text-sage-300 hover:bg-sage-900/60 hover:text-sand-100"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-gold-400" : "text-sage-400 group-hover:text-sand-100 transition-colors")} />
              <span>{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activeSideIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500 rounded-r-md"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-sage-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-medium text-sage-400 hover:bg-red-950/30 hover:text-red-300 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 shrink-0 text-sage-400 group-hover:text-red-300" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden lg:block w-64 h-screen shrink-0 sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-0 bottom-0 left-0 w-64 z-50 lg:hidden shadow-2xl"
          >
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg bg-sage-900 text-sage-300 hover:text-sand-100 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
