"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/Card";
import { toast } from "sonner";
import { updateAdminProfile, changeAdminPassword, updateSiteSettings } from "@/actions/settings";
import { User, Lock, Loader2, Settings, Globe } from "lucide-react";
import { useRouter } from "next/navigation";

interface SettingsClientProps {
  currentUsername: string;
  currentEmail: string;
  initialSiteSettings: Record<string, string>;
}

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Password confirmation is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function SettingsClient({
  currentUsername,
  currentEmail,
  initialSiteSettings,
}: SettingsClientProps) {
  const router = useRouter();
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isSiteSubmitting, setIsSiteSubmitting] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: currentUsername,
      email: currentEmail,
    },
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Site Settings Form
  const {
    register: registerSite,
    handleSubmit: handleSiteSubmit,
    formState: { errors: siteErrors },
  } = useForm({
    defaultValues: {
      contact_address: initialSiteSettings.contact_address || "",
      contact_phone: initialSiteSettings.contact_phone || "",
      contact_whatsapp: initialSiteSettings.contact_whatsapp || "",
      contact_email: initialSiteSettings.contact_email || "",
      hours_weekdays: initialSiteSettings.hours_weekdays || "",
      hours_saturdays: initialSiteSettings.hours_saturdays || "",
      hours_sundays: initialSiteSettings.hours_sundays || "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsProfileSubmitting(true);
    try {
      const result = await updateAdminProfile(data);
      if (result.success) {
        toast.success("Profile updated successfully.");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsPasswordSubmitting(true);
    try {
      const result = await changeAdminPassword(data);
      if (result.success) {
        toast.success("Password changed successfully.");
        resetPassword();
      } else {
        toast.error(result.error || "Failed to change password.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const onSiteSubmit = async (data: any) => {
    setIsSiteSubmitting(true);
    try {
      const result = await updateSiteSettings(data);
      if (result.success) {
        toast.success("Site coordinates & hours updated successfully.");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update site details.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSiteSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div>
        <h1 className="font-serif font-bold text-3xl text-sage-950 tracking-wide">Settings</h1>
        <p className="text-sm text-sage-600 font-light mt-1">
          Manage your administrator profile details, credentials, sanctuary contact info, and practice schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Profile Settings */}
        <div className="lg:col-span-6">
          <Card variant="glass" className="p-6 border border-sage-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-sage-50 text-sage-600 border border-sage-100">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-sage-950">Admin Profile</h3>
                <p className="text-[10px] text-sage-400 font-medium">Update account identifier and email address</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-5 flex-grow flex flex-col justify-between">
              <div className="space-y-4">
                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">
                    Username
                  </label>
                  <input
                    type="text"
                    {...registerProfile("username")}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                  {profileErrors.username && (
                    <p className="text-xs font-semibold text-red-500">{profileErrors.username.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...registerProfile("email")}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                  {profileErrors.email && (
                    <p className="text-xs font-semibold text-red-500">{profileErrors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-sage-50">
                <button
                  type="submit"
                  disabled={isProfileSubmitting}
                  className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-sage-600 hover:bg-sage-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5"
                >
                  {isProfileSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right: Change Password */}
        <div className="lg:col-span-6">
          <Card variant="glass" className="p-6 border border-sage-100 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-sage-50 text-sage-600 border border-sage-100">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-sage-950">Security</h3>
                <p className="text-[10px] text-sage-400 font-medium">Update account password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...registerPassword("currentPassword")}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-xs font-semibold text-red-500">{passwordErrors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...registerPassword("newPassword")}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                />
                {passwordErrors.newPassword && (
                  <p className="text-xs font-semibold text-red-500">{passwordErrors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...registerPassword("confirmPassword")}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-xs font-semibold text-red-500">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>

              <div className="pt-6 mt-6 border-t border-sage-50">
                <button
                  type="submit"
                  disabled={isPasswordSubmitting}
                  className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-sage-600 hover:bg-sage-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5"
                >
                  {isPasswordSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      {/* Row 2: Site Settings & Hours */}
      <div>
        <Card variant="glass" className="p-6 border border-sage-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-sage-50 text-sage-600 border border-sage-100">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-sage-950">Site Details & Practice Hours</h3>
              <p className="text-[10px] text-sage-400 font-medium">Configure contact sanctuary coordinates and operating hours shown on the homepage</p>
            </div>
          </div>

          <form onSubmit={handleSiteSubmit(onSiteSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Column 1: Contact coordinates */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-sage-800 uppercase tracking-wider border-b border-sage-50 pb-2">Contact Sanctuary Info</h4>
                
                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Sanctuary Address</label>
                  <textarea
                    rows={2}
                    placeholder="Enter full physical address"
                    {...registerSite("contact_address", { required: "Address is required" })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all resize-none"
                  />
                  {siteErrors.contact_address && (
                    <p className="text-xs font-semibold text-red-500">{(siteErrors.contact_address as any).message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    {...registerSite("contact_phone", { required: "Phone number is required" })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                  {siteErrors.contact_phone && (
                    <p className="text-xs font-semibold text-red-500">{(siteErrors.contact_phone as any).message}</p>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    {...registerSite("contact_whatsapp", { required: "WhatsApp number is required" })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                  {siteErrors.contact_whatsapp && (
                    <p className="text-xs font-semibold text-red-500">{(siteErrors.contact_whatsapp as any).message}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Sanctuary Email</label>
                  <input
                    type="email"
                    placeholder="e.g. shala@yogabhyasi.com"
                    {...registerSite("contact_email", { required: "Email is required" })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                  {siteErrors.contact_email && (
                    <p className="text-xs font-semibold text-red-500">{(siteErrors.contact_email as any).message}</p>
                  )}
                </div>
              </div>

              {/* Column 2: Hours of Practice */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-sage-800 uppercase tracking-wider border-b border-sage-50 pb-2">Hours of Practice</h4>

                {/* Weekdays */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Weekdays (Mon - Fri)</label>
                  <input
                    type="text"
                    placeholder="e.g. 06:00 AM - 08:30 PM"
                    {...registerSite("hours_weekdays", { required: "Weekdays hours are required" })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                  {siteErrors.hours_weekdays && (
                    <p className="text-xs font-semibold text-red-500">{(siteErrors.hours_weekdays as any).message}</p>
                  )}
                </div>

                {/* Saturdays */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Saturdays</label>
                  <input
                    type="text"
                    placeholder="e.g. 07:00 AM - 06:00 PM"
                    {...registerSite("hours_saturdays", { required: "Saturdays hours are required" })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                  {siteErrors.hours_saturdays && (
                    <p className="text-xs font-semibold text-red-500">{(siteErrors.hours_saturdays as any).message}</p>
                  )}
                </div>

                {/* Sundays */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-sage-700 block">Sundays</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM - 02:00 PM (Restorative/Sound Bath only)"
                    {...registerSite("hours_sundays", { required: "Sundays hours are required" })}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-sage-200 bg-white text-sage-950 focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
                  />
                  {siteErrors.hours_sundays && (
                    <p className="text-xs font-semibold text-red-500">{(siteErrors.hours_sundays as any).message}</p>
                  )}
                </div>
              </div>

            </div>

            {/* Submit Row */}
            <div className="pt-6 border-t border-sage-50 flex justify-end">
              <button
                type="submit"
                disabled={isSiteSubmitting}
                className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-sage-600 hover:bg-sage-700 text-white shadow-md focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5"
              >
                {isSiteSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving Site Details...</span>
                  </>
                ) : (
                  <span>Save Site Details</span>
                )}
              </button>
            </div>
          </form>
        </Card>
      </div>

    </div>
  );
}
