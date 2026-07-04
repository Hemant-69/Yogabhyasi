import { NextResponse } from "next/server";
import * as z from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Server-side Zod validation
    const parsedData = contactFormSchema.parse(body);

    // In a real-world production site, this would send an email via Resend/SendGrid
    // or insert records into a PostgreSQL/MongoDB database.
    console.log("Secure Contact Submission received:", parsedData);

    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 800));

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
