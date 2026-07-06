"use server";

import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/lib/auth";

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

// Helper to check authentication
async function checkAuth() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function updateAdminProfile(data: z.infer<typeof profileSchema>) {
  try {
    const user = await checkAuth();
    const parsed = profileSchema.parse(data);

    // Check if email taken by another admin
    const existing = await prisma.admin.findFirst({
      where: {
        email: parsed.email,
        id: { not: user.id },
      },
    });
    if (existing) {
      return { success: false, error: "This email is already in use by another administrator." };
    }

    const updated = await prisma.admin.update({
      where: { id: user.id },
      data: {
        username: parsed.username,
        email: parsed.email,
      },
    });

    await logActivity("Update Profile", user.email!, `Updated admin username to "${parsed.username}" and email to "${parsed.email}"`);
    return { success: true, user: updated };
  } catch (error: any) {
    console.error("Update profile error:", error);
    return { success: false, error: error.message || "Failed to update profile settings." };
  }
}

export async function changeAdminPassword(data: z.infer<typeof passwordSchema>) {
  try {
    const user = await checkAuth();
    const parsed = passwordSchema.parse(data);

    const admin = await prisma.admin.findUnique({
      where: { id: user.id },
    });
    if (!admin) {
      return { success: false, error: "Administrator not found." };
    }

    // Verify current password
    const passwordsMatch = await bcrypt.compare(parsed.currentPassword, admin.password);
    if (!passwordsMatch) {
      return { success: false, error: "Current password is incorrect." };
    }

    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(parsed.newPassword, 10);
    await prisma.admin.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    await logActivity("Change Password", user.email!, "Changed account password securely.");
    return { success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Change password error:", error);
    return { success: false, error: error.message || "Failed to change account password." };
  }
}

export async function getSiteSettings() {
  try {
    const records = await prisma.siteSetting.findMany();
    const settings: Record<string, string> = {};
    records.forEach((rec) => {
      settings[rec.key] = rec.value;
    });
    return { success: true, settings };
  } catch (error: any) {
    console.error("Get site settings error:", error);
    return { success: false, error: error.message || "Failed to load site settings." };
  }
}

export async function updateSiteSettings(data: Record<string, string>) {
  try {
    const user = await checkAuth();
    
    // Perform bulk upserts in a single transaction
    await prisma.$transaction(
      Object.entries(data).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    await logActivity("Update Site Settings", user.email!, "Updated contact info and hours of practice.");
    return { success: true };
  } catch (error: any) {
    console.error("Update site settings error:", error);
    return { success: false, error: error.message || "Failed to update site settings." };
  }
}

export async function updateLegalPages(data: {
  legal_privacy_policy?: string;
  legal_terms_of_service?: string;
  legal_cookie_policy?: string;
}) {
  try {
    const user = await checkAuth();

    const entries = Object.entries(data).filter(([, value]) => value !== undefined && value !== null);

    await prisma.$transaction(
      entries.map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: value as string },
          create: { key, value: value as string },
        })
      )
    );

    await logActivity("Update Legal Pages", user.email!, "Updated legal page content (Privacy Policy, Terms of Service, and/or Cookie Policy).");
    return { success: true };
  } catch (error: any) {
    console.error("Update legal pages error:", error);
    return { success: false, error: error.message || "Failed to update legal page content." };
  }
}
