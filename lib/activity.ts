import { prisma } from "@/lib/prisma";

export async function logActivity(action: string, adminEmail: string, details?: string) {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        adminEmail,
        details,
      },
    });
  } catch (error) {
    console.error("Error creating activity log:", error);
  }
}
