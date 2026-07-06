"use server";

import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { auth } from "@/lib/auth";
import { sendDirectReplyEmail } from "@/lib/notifications";

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

export async function sendClientReplyEmail(
  messageId: string,
  clientEmail: string,
  clientName: string,
  subject: string,
  bodyText: string
) {
  try {
    const user = await checkAuth();
    
    await sendDirectReplyEmail({
      to: clientEmail,
      subject: subject,
      body: bodyText,
    });

    // Create action history entry
    await prisma.messageAction.create({
      data: {
        messageId,
        type: "EMAIL",
        details: bodyText,
        adminEmail: user.email!,
      },
    });

    // Update parent message resolved status
    await prisma.message.update({
      where: { id: messageId },
      data: { replied: true, replyMethod: "EMAIL" }
    });

    await logActivity(
      "Send Reply Email",
      user.email!,
      `Sent email reply to "${clientName}" (${clientEmail})`
    );

    return { success: true };
  } catch (error: any) {
    console.error("Send client reply email error:", error);
    return { success: false, error: error.message || "Failed to send email." };
  }
}

export async function toggleMessageReplied(
  id: string,
  isReplied: boolean,
  replyMethod: string | null = null,
  details: string | null = null
) {
  try {
    const user = await checkAuth();
    const message = await prisma.message.update({
      where: { id },
      data: {
        replied: isReplied,
        replyMethod: isReplied ? replyMethod : null,
      },
    });

    // Create action history entry
    await prisma.messageAction.create({
      data: {
        messageId: id,
        type: isReplied ? `MANUAL_RESOLVE_${replyMethod || "OTHER"}` : "MANUAL_PENDING",
        details: details || (isReplied ? `Marked resolved via ${replyMethod || "manual action"}` : "Status reset to pending"),
        adminEmail: user.email!,
      },
    });

    await logActivity(
      "Toggle Message Replied Status",
      user.email!,
      `Marked query from "${message.name}" as ${
        isReplied ? `Action Done (${replyMethod || "manual"})` : "No Action Done"
      }`
    );
    return { success: true, message };
  } catch (error: any) {
    console.error("Toggle message replied status error:", error);
    return { success: false, error: error.message || "Failed to update status." };
  }
}

export async function recordWhatsAppClick(messageId: string, prefilledText: string) {
  try {
    const user = await checkAuth();
    
    // Create action history entry
    await prisma.messageAction.create({
      data: {
        messageId,
        type: "WHATSAPP",
        details: prefilledText,
        adminEmail: user.email!,
      },
    });

    // Update parent message resolved status
    const message = await prisma.message.update({
      where: { id: messageId },
      data: { replied: true, replyMethod: "WHATSAPP" }
    });

    await logActivity(
      "Send WhatsApp Reply",
      user.email!,
      `Opened WhatsApp message link for "${message.name}"`
    );

    return { success: true, message };
  } catch (error: any) {
    console.error("Record WhatsApp click error:", error);
    return { success: false, error: error.message || "Failed to record WhatsApp activity." };
  }
}

export async function getAllMessages() {
  try {
    await checkAuth();
    const messages = await prisma.message.findMany({
      include: {
        actions: {
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, messages };
  } catch (error: any) {
    console.error("Get all messages error:", error);
    return { success: false, error: error.message || "Failed to retrieve messages." };
  }
}
