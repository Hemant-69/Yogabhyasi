"use server";

import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { auth } from "@/lib/auth";

// Helper to check authentication
async function checkAuth() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function markMessageAsRead(id: string, isRead: boolean = true) {
  try {
    const user = await checkAuth();
    const message = await prisma.message.update({
      where: { id },
      data: { read: isRead },
    });

    await logActivity(
      "Mark Message Read Status",
      user.email!,
      `Marked query from "${message.name}" as ${isRead ? "Read" : "Unread"}`
    );
    return { success: true, message };
  } catch (error: any) {
    console.error("Mark message read status error:", error);
    return { success: false, error: error.message || "Failed to update read status." };
  }
}

export async function deleteMessage(id: string) {
  try {
    const user = await checkAuth();
    const message = await prisma.message.delete({
      where: { id },
    });

    await logActivity("Delete Message", user.email!, `Deleted query from "${message.name}"`);
    return { success: true };
  } catch (error: any) {
    console.error("Delete message error:", error);
    return { success: false, error: error.message || "Failed to delete message." };
  }
}

export async function bulkDeleteMessages(ids: string[]) {
  try {
    const user = await checkAuth();
    const result = await prisma.message.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    await logActivity("Bulk Delete Messages", user.email!, `Deleted ${result.count} client queries.`);
    return { success: true, count: result.count };
  } catch (error: any) {
    console.error("Bulk delete messages error:", error);
    return { success: false, error: error.message || "Failed to execute bulk deletion." };
  }
}
