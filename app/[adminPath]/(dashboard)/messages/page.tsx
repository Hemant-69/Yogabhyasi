import React from "react";
import { prisma } from "@/lib/prisma";
import MessagesClient from "@/components/admin/MessagesClient";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  // Fetch messages from database
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MessagesClient initialMessages={messages} />;
}
