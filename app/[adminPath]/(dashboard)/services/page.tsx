import React from "react";
import { prisma } from "@/lib/prisma";
import ServicesClient from "@/components/admin/ServicesClient";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return <ServicesClient initialServices={services as any} />;
}
