"use server";

import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";

const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  icon: z.string().min(1, "Icon is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().min(1, "Image is required"),
  benefits: z.array(z.string()).min(1, "At least one benefit is required"),
  status: z.boolean().default(true),
  displayOrder: z.number().default(0),
});

// Helper to check authentication
async function checkAuth() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function createService(data: z.infer<typeof serviceSchema>) {
  try {
    const user = await checkAuth();
    const parsed = serviceSchema.parse(data);

    // Check slug uniqueness
    const existing = await prisma.service.findUnique({
      where: { slug: parsed.slug },
    });
    if (existing) {
      return { success: false, error: "A service with this slug already exists." };
    }

    const service = await prisma.service.create({
      data: {
        title: parsed.title,
        slug: parsed.slug,
        icon: parsed.icon,
        description: parsed.description,
        image: parsed.image,
        benefits: parsed.benefits,
        status: parsed.status,
        displayOrder: parsed.displayOrder,
      },
    });

    await logActivity("Create Service", user.email!, `Created service "${service.title}"`);
    revalidatePath("/");
    return { success: true, service };
  } catch (error: any) {
    console.error("Create service error:", error);
    return { success: false, error: error.message || "Failed to create service." };
  }
}

export async function updateService(id: string, data: z.infer<typeof serviceSchema>) {
  try {
    const user = await checkAuth();
    const parsed = serviceSchema.parse(data);

    // Check slug uniqueness (excluding current)
    const existing = await prisma.service.findFirst({
      where: {
        slug: parsed.slug,
        id: { not: id },
      },
    });
    if (existing) {
      return { success: false, error: "A service with this slug already exists." };
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        title: parsed.title,
        slug: parsed.slug,
        icon: parsed.icon,
        description: parsed.description,
        image: parsed.image,
        benefits: parsed.benefits,
        status: parsed.status,
        displayOrder: parsed.displayOrder,
      },
    });

    await logActivity("Update Service", user.email!, `Updated service "${service.title}"`);
    revalidatePath("/");
    return { success: true, service };
  } catch (error: any) {
    console.error("Update service error:", error);
    return { success: false, error: error.message || "Failed to update service." };
  }
}

export async function deleteService(id: string) {
  try {
    const user = await checkAuth();
    const service = await prisma.service.delete({
      where: { id },
    });

    await logActivity("Delete Service", user.email!, `Deleted service "${service.title}"`);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Delete service error:", error);
    return { success: false, error: error.message || "Failed to delete service." };
  }
}

export async function toggleServiceStatus(id: string, currentStatus: boolean) {
  try {
    const user = await checkAuth();
    const service = await prisma.service.update({
      where: { id },
      data: { status: !currentStatus },
    });

    await logActivity(
      "Toggle Service Status",
      user.email!,
      `Toggled status of "${service.title}" to ${!currentStatus ? "Active" : "Inactive"}`
    );
    revalidatePath("/");
    return { success: true, status: !currentStatus };
  } catch (error: any) {
    console.error("Toggle service status error:", error);
    return { success: false, error: error.message || "Failed to toggle service status." };
  }
}

export async function reorderServices(orderedIds: string[]) {
  try {
    const user = await checkAuth();

    // Perform database updates in a transaction
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.service.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );

    await logActivity("Reorder Services", user.email!, "Reordered services display listing.");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Reorder services error:", error);
    return { success: false, error: error.message || "Failed to reorder services." };
  }
}
