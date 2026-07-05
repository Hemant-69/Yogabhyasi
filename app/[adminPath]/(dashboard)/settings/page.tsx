import React from "react";
import { auth } from "@/lib/auth";
import SettingsClient from "@/components/admin/SettingsClient";
import { redirect } from "next/navigation";
import { getSiteSettings } from "@/actions/settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ adminPath: string }>;
}) {
  const { adminPath } = await params;
  const session = await auth();

  if (!session || !session.user) {
    redirect(`/${adminPath}/login`);
  }

  const currentUsername = (session.user as any).username || session.user.name || "admin";
  const currentEmail = session.user.email || "admin@yogabhyasi.com";

  const settingsRes = await getSiteSettings();
  const initialSiteSettings = settingsRes.settings || {};

  return (
    <SettingsClient
      currentUsername={currentUsername}
      currentEmail={currentEmail}
      initialSiteSettings={initialSiteSettings}
    />
  );
}
