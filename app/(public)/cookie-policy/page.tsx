import React from "react";
import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";
import Footer from "@/components/sections/Footer";
import { prisma } from "@/lib/prisma";
import { DEFAULT_COOKIE_POLICY } from "@/lib/legal-defaults";
import FormattedText from "@/components/ui/FormattedText";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cookie Policy | Yogabhyasi Wellness Sanctuary",
  description: "Read the Cookie Policy of Yogabhyasi Wellness Sanctuary. Learn how we use cookies, session states, and site analytics to improve your experience on yogabhyasi.in.",
};

export default async function CookiePolicyPage() {
  let cookieText = DEFAULT_COOKIE_POLICY;
  let dbSettings: Record<string, string> = {};

  try {
    const settings = await prisma.siteSetting.findMany();
    settings.forEach((rec) => {
      dbSettings[rec.key] = rec.value;
    });

    if (dbSettings.legal_cookie_policy && dbSettings.legal_cookie_policy.trim() !== "") {
      cookieText = dbSettings.legal_cookie_policy;
    }
  } catch (error) {
    console.error("Failed to load cookie policy from DB, using fallback defaults:", error);
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
            <Cookie className="h-3 w-3" /> Cookie Settings
          </div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-sage-950 tracking-tight leading-tight">
            Cookie Policy
          </h1>
          <p className="text-xs text-sage-500 font-light">
            Effective Date: July 6, 2026
          </p>
        </div>

        {/* Legal Text Content */}
        <div className="prose prose-sage max-w-none text-sm md:text-base text-sage-800 font-light leading-relaxed space-y-6">
          <p>
            This Cookie Policy explains how <strong>Yogabhyasi Wellness Sanctuary</strong> (&ldquo;Yogabhyasi&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), accessible via <strong>yogabhyasi.in</strong>, uses cookies, local storage, and similar web tracking technologies.
          </p>
          <p>
            We believe in being transparent about how we collect and process details when you navigate our site. This policy outlines what cookies are, why we use them, and your controls for managing cookie settings.
          </p>

          <hr className="my-8 border-sage-200" />

          {/* Dynamic Content Body */}
          <FormattedText text={cookieText} />

          {/* Contact Card */}
          <h2 className="font-serif font-bold text-lg md:text-xl text-sage-950 mt-8 mb-4">
            7. Inquiry and Contact Information
          </h2>
          <p>
            If you have questions about our use of cookies or this policy, please write to us at:
          </p>
          <div className="bg-white/50 p-6 rounded-2xl border border-sage-200/50 mt-4 space-y-2">
            <p className="font-bold text-sage-950">Yogabhyasi Wellness Sanctuary</p>
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
