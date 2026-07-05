"use server";

import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";

const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.string().min(2, "Role must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  photo: z.string().min(1, "Photo is required"),
  objectPosition: z.string().default("center"),
  transform: z.string().nullable().optional(),
  transformHover: z.string().nullable().optional(),
  instagram: z.string().url("Invalid Instagram URL").or(z.literal("")).nullable().optional(),
  twitter: z.string().url("Invalid Twitter URL").or(z.literal("")).nullable().optional(),
  linkedin: z.string().url("Invalid LinkedIn URL").or(z.literal("")).nullable().optional(),
  displayOrder: z.number().default(0),
  status: z.boolean().default(true),
});

// Helper to check authentication
async function checkAuth() {
  const session = await auth();
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function createTeamMember(data: z.infer<typeof teamMemberSchema>) {
  try {
    const user = await checkAuth();
    const parsed = teamMemberSchema.parse(data);

    const member = await prisma.teamMember.create({
      data: {
        name: parsed.name,
        role: parsed.role,
        bio: parsed.bio,
        photo: parsed.photo,
        objectPosition: parsed.objectPosition,
        transform: parsed.transform || null,
        transformHover: parsed.transformHover || null,
        instagram: parsed.instagram || null,
        twitter: parsed.twitter || null,
        linkedin: parsed.linkedin || null,
        displayOrder: parsed.displayOrder,
        status: parsed.status,
      },
    });

    await logActivity("Create Team Member", user.email!, `Added team member "${member.name}"`);
    revalidatePath("/");
    return { success: true, member };
  } catch (error: any) {
    console.error("Create team member error:", error);
    return { success: false, error: error.message || "Failed to create team member." };
  }
}

export async function updateTeamMember(id: string, data: z.infer<typeof teamMemberSchema>) {
  try {
    const user = await checkAuth();
    const parsed = teamMemberSchema.parse(data);

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name: parsed.name,
        role: parsed.role,
        bio: parsed.bio,
        photo: parsed.photo,
        objectPosition: parsed.objectPosition,
        transform: parsed.transform || null,
        transformHover: parsed.transformHover || null,
        instagram: parsed.instagram || null,
        twitter: parsed.twitter || null,
        linkedin: parsed.linkedin || null,
        displayOrder: parsed.displayOrder,
        status: parsed.status,
      },
    });

    await logActivity("Update Team Member", user.email!, `Updated team member "${member.name}"`);
    revalidatePath("/");
    return { success: true, member };
  } catch (error: any) {
    console.error("Update team member error:", error);
    return { success: false, error: error.message || "Failed to update team member." };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    const user = await checkAuth();
    const member = await prisma.teamMember.delete({
      where: { id },
    });

    await logActivity("Delete Team Member", user.email!, `Deleted team member "${member.name}"`);
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Delete team member error:", error);
    return { success: false, error: error.message || "Failed to delete team member." };
  }
}

export async function toggleTeamMemberStatus(id: string, currentStatus: boolean) {
  try {
    const user = await checkAuth();
    const member = await prisma.teamMember.update({
      where: { id },
      data: { status: !currentStatus },
    });

    await logActivity(
      "Toggle Team Member Status",
      user.email!,
      `Toggled status of "${member.name}" to ${!currentStatus ? "Active" : "Inactive"}`
    );
    revalidatePath("/");
    return { success: true, status: !currentStatus };
  } catch (error: any) {
    console.error("Toggle team member status error:", error);
    return { success: false, error: error.message || "Failed to toggle team member status." };
  }
}
