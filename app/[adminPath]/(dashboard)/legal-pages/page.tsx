import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSiteSettings } from "@/actions/settings";
import LegalPagesClient from "@/components/admin/LegalPagesClient";
import { DEFAULT_PRIVACY_POLICY, DEFAULT_TERMS_OF_SERVICE, DEFAULT_COOKIE_POLICY } from "@/lib/legal-defaults";

export const dynamic = "force-dynamic";

export default async function LegalPagesPage({
  params,
}: {
  params: Promise<{ adminPath: string }>;
}) {
  const { adminPath } = await params;
  const session = await auth();

  if (!session || !session.user) {
    redirect(`/${adminPath}/login`);
  }

  const settingsRes = await getSiteSettings();
  const settings = settingsRes.settings || {};

  return (
    <LegalPagesClient
      initialPrivacyPolicy={settings.legal_privacy_policy || DEFAULT_PRIVACY_POLICY}
      initialTermsOfService={settings.legal_terms_of_service || DEFAULT_TERMS_OF_SERVICE}
      initialCookiePolicy={settings.legal_cookie_policy || DEFAULT_COOKIE_POLICY}
    />
  );
}
