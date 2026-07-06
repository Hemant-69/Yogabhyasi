import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create default admin
  const adminEmail = "admin@yogabhyasi.com";
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@Yogabhyasi123", 10);
    await prisma.admin.create({
      data: {
        username: "admin",
        email: adminEmail,
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });
    console.log("Admin account created (admin@yogabhyasi.com / Admin@Yogabhyasi123)");
  } else {
    console.log("Admin account already exists.");
  }

  // 2. Create services
  const services = [
    {
      slug: "vinyasa-flow",
      icon: "Activity",
      title: "Vinyasa Flow & Alignment",
      description: "A dynamic and fluid sequence of postures synced with conscious breathing to build stamina, flexibility, and core strength.",
      image: "/images/5.webp",
      benefits: ["Cardiovascular health", "Muscle toning", "Stress release"],
      displayOrder: 0,
    },
    {
      slug: "hatha-restorative",
      icon: "Flower",
      title: "Hatha & Restorative",
      description: "Classic foundational postures held for longer durations combined with props to release deep-seated muscle tension and reset the mind.",
      image: "/images/6.webp",
      benefits: ["Improved posture", "Deep muscular release", "Nervous system balance"],
      displayOrder: 1,
    },
    {
      slug: "pranayama-meditation",
      icon: "Wind",
      title: "Pranayama & Meditation",
      description: "Vedic breath control techniques and guided mindfulness meditation to clear mental fog, regulate emotions, and induce deep peace.",
      image: "/images/7.webp",
      benefits: ["Reduced anxiety", "Greater focus", "Enhanced vital energy"],
      displayOrder: 2,
    },
    {
      slug: "sound-bath",
      icon: "Sparkles",
      title: "Vibrational Sound Therapy",
      description: "A restorative immersion in acoustic frequencies from Tibetan singing bowls and gongs to align your energy centers and cellular vibration.",
      image: "/images/8.webp",
      benefits: ["Deep brainwave relaxation", "Insomnia relief", "Subtle energy clearance"],
      displayOrder: 3,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        slug: service.slug,
        icon: service.icon,
        title: service.title,
        description: service.description,
        image: service.image,
        benefits: service.benefits,
        displayOrder: service.displayOrder,
      },
    });
  }
  console.log("Services seeded.");

  // 3. Create team members
  const teamMembers = [
    {
      name: "Rohit Malik",
      role: "Founder",
      bio: "Specializes in traditional Hatha, alignment-focused Vinyasa, and deep Pranayama.",
      photo: "/Team member/Rohit Malik - Founder.webp",
      objectPosition: "center",
      transform: null,
      transformHover: null,
      displayOrder: 0,
    },
    {
      name: "Madhu Chaudhary",
      role: "Cofounder",
      bio: "Integrates clinical therapy with sacred acoustic frequencies and singing bowl practices.",
      photo: "/Team member/Madhu Chaudhary - Cofounder.webp",
      objectPosition: "center",
      transform: null,
      transformHover: null,
      displayOrder: 1,
    },
    {
      name: "Anuj Chauhan",
      role: "Team Member",
      bio: "Passionate about athletic alignment, strength development, and dynamic flow sequencing.",
      photo: "/Team member/Anuj chauchan- team member .webp",
      objectPosition: "center",
      transform: null,
      transformHover: null,
      displayOrder: 2,
    },
    {
      name: "Abhishek Sharma",
      role: "Team Member",
      bio: "Dedicated to restorative yoga, deep brainwave relaxation, and holistic health coaching.",
      photo: "/Team member/Abhishek sharma - team member.webp",
      objectPosition: "center 35%",
      transform: "scale(1.15) translateX(6%)",
      transformHover: "scale(1.2) translateX(6%)",
      displayOrder: 3,
    },
  ];

  for (const member of teamMembers) {
    const existingMember = await prisma.teamMember.findFirst({
      where: { name: member.name },
    });

    if (!existingMember) {
      await prisma.teamMember.create({
        data: {
          name: member.name,
          role: member.role,
          bio: member.bio,
          photo: member.photo,
          objectPosition: member.objectPosition,
          transform: member.transform,
          transformHover: member.transformHover,
          displayOrder: member.displayOrder,
        },
      });
    }
  }
  console.log("Team members seeded.");

  // 4. Create site settings
  const siteSettings = [
    { key: "contact_address", value: "108 Lotus Sanctuary Boulevard, 2nd Floor, Rishikesh, Uttarakhand, India 249201" },
    { key: "contact_phone", value: "+91 98765 43210" },
    { key: "contact_whatsapp", value: "+91 98765 43210" },
    { key: "contact_email", value: "shala@yogabhyasi.com" },
    { key: "hours_weekdays", value: "06:00 AM - 08:30 PM" },
    { key: "hours_saturdays", value: "07:00 AM - 06:00 PM" },
    { key: "hours_sundays", value: "08:00 AM - 02:00 PM (Restorative/Sound Bath only)" },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: setting.value,
      },
    });
  }
  console.log("Site settings seeded.");

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
