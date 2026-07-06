import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import Footer from "@/components/sections/Footer";
import { prisma } from "@/lib/prisma";
import { DEFAULT_PRIVACY_POLICY } from "@/lib/legal-defaults";
import FormattedText from "@/components/ui/FormattedText";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Privacy Policy | Yogabhyasi Wellness Sanctuary",
  description: "Read the Privacy Policy of Yogabhyasi Wellness Sanctuary. Understand how we collect, process, and protect your personal data under the IT Act, 2000 and DPDPA, 2023.",
};

export default async function PrivacyPolicyPage() {
  let policyText = DEFAULT_PRIVACY_POLICY;
  let dbSettings: Record<string, string> = {};

  try {
    const settings = await prisma.siteSetting.findMany();
    settings.forEach((rec) => {
      dbSettings[rec.key] = rec.value;
    });

    if (dbSettings.legal_privacy_policy && dbSettings.legal_privacy_policy.trim() !== "") {
      policyText = dbSettings.legal_privacy_policy;
    }
  } catch (error) {
    console.error("Failed to load privacy policy from DB, using fallback defaults:", error);
  }

  const address = dbSettings.contact_address || "House no-259, park no-3, samaspur sec-51 Gurgaon, Haryana, India";
  const email = dbSettings.contact_email || "rohitok12@gmail.com";
  const whatsapp = dbSettings.contact_whatsapp || "9717996507";
  const phone = dbSettings.contact_phone || "7300634908";

  return (
    <div className="bg-sand-100 min-h-screen flex flex-col pt-24 md:pt-28 font-sans">
      <div className="container mx-auto px-6 md:px-12 flex-grow max-w-4xl py-12 md:py-16">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-sage-600 hover:text-sage-950 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>

        {/* Article Title */}
        <div className="space-y-4 mb-10 border-b border-sage-200/60 pb-8">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold-600 bg-gold-50 border border-gold-200/50 rounded-full px-3 py-1">
            <Shield className="h-3 w-3" /> Legal Compliance
          </div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-sage-950 tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-sage-500 font-light">
            Effective Date: July 6, 2026
          </p>
        </div>

        {/* Legal Text Content */}
        <div className="prose prose-sage max-w-none text-sm md:text-base text-sage-800 font-light leading-relaxed space-y-6">
          <p>
            Welcome to <strong>Yogabhyasi Wellness Sanctuary</strong> (&ldquo;Yogabhyasi&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), accessible via <strong>yogabhyasi.in</strong>. We are committed to protecting and safeguarding the privacy of our visitors, practitioners, and users.
          </p>
          <p>
            This Privacy Policy outlines how we collect, handle, store, disclose, and secure your personal data. This document is formulated in compliance with the **Information Technology Act, 2000** (including Section 43A and Section 72A), the **Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011** (the &ldquo;SPDI Rules&rdquo;), and the **Digital Personal Data Protection Act, 2023** (the &ldquo;DPDPA&rdquo;) of India.
          </p>

          <hr className="my-8 border-sage-200" />

          {/* Dynamic Content Body */}
          <FormattedText text={policyText} />

          {/* Section 9: Grievance Contact Card */}
          <h2 className="font-serif font-bold text-lg md:text-xl text-sage-950 mt-8 mb-4">
            9. Grievance Redressal Mechanism
          </h2>
          <p>
            In compliance with the DPDPA, 2023 and SPDI Rules, 2011, any discrepancies, complaints, or requests regarding your personal data processing can be submitted directly to our Grievance Officer:
          </p>
          <div className="bg-white/50 p-6 rounded-2xl border border-sage-200/50 mt-4 space-y-2">
            <p className="font-bold text-sage-950">Grievance Redressal Officer</p>
            <p className="font-light text-sage-800"><strong>Sanctuary Director:</strong> Rohit Malik</p>
            <p className="font-light text-sage-800"><strong>Address:</strong> {address}</p>
            <p className="font-light text-sage-800"><strong>Email:</strong> {email}</p>
            <p className="font-light text-sage-800"><strong>Phone / WhatsApp:</strong> +91 {phone} / +91 {whatsapp}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer siteSettings={dbSettings} />
    </div>
  );
}
