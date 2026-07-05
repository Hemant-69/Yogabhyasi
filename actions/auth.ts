"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { logActivity } from "@/lib/activity";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginAction(data: z.infer<typeof loginSchema>) {
  try {
    // Validate inputs
    const parsed = loginSchema.parse(data);

    // Call NextAuth sign in
    await signIn("credentials", {
      email: parsed.email,
      password: parsed.password,
      redirect: false, // Return response to handle custom redirect transitions on client
    });

    // Log the successful login
    await logActivity("Admin Login", parsed.email, `Logged in successfully.`);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }

    if (error instanceof AuthError) {
      // Handle NextAuth errors
      const reason = error.cause?.err?.message || error.message;
      if (reason.includes("CredentialsSignin") || reason.toLowerCase().includes("credentials")) {
        return { success: false, error: "Invalid email or password." };
      }
      return { success: false, error: "Authentication failed. Please try again." };
    }

    // Log unexpected errors
    console.error("Login server action error:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
