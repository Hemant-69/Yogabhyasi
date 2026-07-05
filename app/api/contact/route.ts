import { NextResponse } from "next/server";
import * as z from "zod";
import { prisma } from "@/lib/prisma";
import { sendEmailNotification, sendTelegramNotification } from "@/lib/notifications";

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  whatsapp: z.string().min(10).max(15),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Server-side Zod validation
    const parsedData = contactFormSchema.parse(body);

    // Save submission to database
    const savedMessage = await prisma.message.create({
      data: {
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        whatsapp: parsedData.whatsapp || null,
        message: parsedData.message,
      },
    });

    // Trigger dispatches asynchronously (graceful fallback if SMTP or Telegram bot token is not configured)
    try {
      await Promise.allSettled([
        sendEmailNotification(savedMessage),
        sendTelegramNotification(savedMessage),
      ]);
    } catch (err) {
      console.error("Dispatches error:", err);
    }

    return NextResponse.json(
      { success: true, message: "Thank you! Your message was received." },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error processing contact submission:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to process message." },
      { status: 500 }
    );
  }
}
