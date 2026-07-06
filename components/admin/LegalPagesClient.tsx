"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { updateLegalPages } from "@/actions/settings";
import { Shield, Scale, Cookie, Loader2, RotateCcw, ExternalLink, Info } from "lucide-react";
import {
  DEFAULT_PRIVACY_POLICY,
  DEFAULT_TERMS_OF_SERVICE,
  DEFAULT_COOKIE_POLICY,
} from "@/lib/legal-defaults";

interface LegalPagesClientProps {
  initialPrivacyPolicy: string;
  initialTermsOfService: string;
  initialCookiePolicy: string;
}

type TabKey = "privacy" | "terms" | "cookie";

const TABS: { key: TabKey; label: string; icon: typeof Shield; field: string; pageSlug: string; defaultContent: string }[] = [
  {
    key: "privacy",
    label: "Privacy Policy",
    icon: Shield,
    field: "legal_privacy_policy",
    pageSlug: "/privacy-policy",
    defaultContent: DEFAULT_PRIVACY_POLICY,
  },
  {
    key: "terms",
    label: "Terms of Service",
    icon: Scale,
    field: "legal_terms_of_service",
    pageSlug: "/terms-of-service",
    defaultContent: DEFAULT_TERMS_OF_SERVICE,
  },
  {
    key: "cookie",
    label: "Cookie Policy",
    icon: Cookie,
    field: "legal_cookie_policy",
    pageSlug: "/cookie-policy",
    defaultContent: DEFAULT_COOKIE_POLICY,
  },
];

export default function LegalPagesClient({
  initialPrivacyPolicy,
  initialTermsOfService,
  initialCookiePolicy,
}: LegalPagesClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("privacy");
  const [isSaving, setIsSaving] = useState(false);

  const [values, setValues] = useState({
    privacy: initialPrivacyPolicy || DEFAULT_PRIVACY_POLICY,
    terms: initialTermsOfService || DEFAULT_TERMS_OF_SERVICE,
    cookie: initialCookiePolicy || DEFAULT_COOKIE_POLICY,
  });

  const activeTabDef = TABS.find((t) => t.key === activeTab)!;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateLegalPages({
        legal_privacy_policy: values.privacy,
        legal_terms_of_service: values.terms,
        legal_cookie_policy: values.cookie,
      });

      if (result.success) {
        toast.success(`${activeTabDef.label} saved successfully.`);
      } else {
        toast.error(result.error || "Failed to save legal page content.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setValues((prev) => ({ ...prev, [activeTab]: activeTabDef.defaultContent }));
    toast.info(`${activeTabDef.label} reset to default content.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif font-bold text-3xl text-sage-950 tracking-wide">Legal Pages</h1>
        <p className="text-sm text-sage-600 font-light mt-1">
          Edit the content of your public legal pages. Changes are saved to the database and reflected instantly on the website.
        </p>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 bg-blue-50/70 border border-blue-200/50 rounded-2xl p-4">
        <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-800 font-light leading-relaxed">
          <strong className="font-bold">Formatting Guide:</strong> Use <code className="bg-blue-100 px-1 rounded font-mono">## Heading</code> for section headings,{" "}
          <code className="bg-blue-100 px-1 rounded font-mono">* Item</code> for bullet points, and{" "}
          <code className="bg-blue-100 px-1 rounded font-mono">**bold text**</code> for bold. The contact info card at the bottom of each page is auto-populated from your Site Settings.
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-sage-100 pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all ${
                isActive
                  ? "bg-white border border-sage-200 border-b-white text-sage-950 shadow-sm"
                  : "text-sage-500 hover:text-sage-800 hover:bg-sage-50"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Editor Card */}
      <Card variant="glass" className="p-6 border border-sage-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {React.createElement(activeTabDef.icon, { className: "h-4 w-4 text-sage-600" })}
            <div>
              <h3 className="font-serif font-bold text-base text-sage-950">{activeTabDef.label}</h3>
              <p className="text-[10px] text-sage-400 font-light">
                Editing content body — intro and contact card are automatically injected
              </p>
            </div>
          </div>
          <a
            href={activeTabDef.pageSlug}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-gold-600 hover:text-gold-700 border border-gold-200/50 bg-gold-50 rounded-full px-3 py-1.5 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Preview Page
          </a>
        </div>

        <textarea
          value={values[activeTab]}
          onChange={(e) =>
            setValues((prev) => ({ ...prev, [activeTab]: e.target.value }))
          }
          rows={28}
          spellCheck={false}
          className="w-full px-4 py-3 text-xs font-mono rounded-xl border border-sage-200 bg-white text-sage-900 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all resize-y leading-relaxed"
          placeholder="Enter page content using markdown-style formatting..."
        />

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-sage-50">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-sage-600 hover:text-sage-800 border border-sage-200 bg-white/60 hover:bg-white rounded-xl transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Default
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-xl bg-sage-600 hover:bg-sage-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save {activeTabDef.label}</span>
            )}
          </button>
        </div>
      </Card>
    </div>
  );
}
