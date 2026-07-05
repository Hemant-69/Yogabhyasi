import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ adminPath: string }>;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { adminPath } = await params;
  const session = await auth();

  // Double check authentication on server rendering (fallback for middleware)
  if (!session || !session.user) {
    redirect(`/${adminPath}/login`);
  }

  const adminEmail = session.user.email || "admin@yogabhyasi.com";
  const adminUsername = (session.user as any).username || session.user.name || "admin";

  return (
    <AdminLayout adminEmail={adminEmail} adminUsername={adminUsername}>
      {children}
    </AdminLayout>
  );
}
