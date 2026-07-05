import React from "react";
import { prisma } from "@/lib/prisma";
import TeamClient from "@/components/admin/TeamClient";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return <TeamClient initialMembers={members as any} />;
}
