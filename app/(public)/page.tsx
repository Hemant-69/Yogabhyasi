import React from "react";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Gallery from "@/components/sections/Gallery";
import Team from "@/components/sections/Team";
import ContactForm from "@/components/sections/ContactForm";
import Footer from "@/components/sections/Footer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function OnePageHome() {
  let dbServices: any[] = [];
  let dbTeam: any[] = [];
  let dbSettings: Record<string, string> = {};

  try {
    // Attempt to retrieve database entries
    dbServices = await prisma.service.findMany({
      where: { status: true },
      orderBy: { displayOrder: "asc" },
    });

    const rawTeam = await prisma.teamMember.findMany({
      where: { status: true },
      orderBy: { displayOrder: "asc" },
    });

    dbTeam = rawTeam.map((member: any) => ({
      id: member.id,
      name: member.name,
      role: member.role,
      bio: member.bio,
      photo: member.photo,
      objectPosition: member.objectPosition,
      transform: member.transform,
      transformHover: member.transformHover,
      socials: {
        instagram: member.instagram || undefined,
        twitter: member.twitter || undefined,
        linkedin: member.linkedin || undefined,
      },
    }));

    const rawSettings = await prisma.siteSetting.findMany();
    rawSettings.forEach((rec: any) => {
      dbSettings[rec.key] = rec.value;
    });
  } catch (error) {
    console.warn("Database tables not found or connection failed. Gracefully falling back to static config.", error);
  }

  return (
    <>
      <Hero siteSettings={dbSettings} />
      <About />
      <Services items={dbServices} />
      <Gallery />
      <Team items={dbTeam} />
      <ContactForm siteSettings={dbSettings} />
      <Footer siteSettings={dbSettings} />
    </>
  );
}
