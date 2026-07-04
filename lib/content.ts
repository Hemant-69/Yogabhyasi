// lib/content.ts

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  badge: string;
}

export interface HighlightItem {
  icon: string;
  title: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  image: string;
  benefits: string[];
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  photo: string;
  rating: number;
  text: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  socials: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface StatItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface QuickLink {
  label: string;
  href: string;
}

export interface FooterContent {
  aboutText: string;
  quickLinks: QuickLink[];
  legalLinks: QuickLink[];
  copyright: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  phoneRaw: string;
  email: string;
  whatsapp: string;
  workingHours: {
    weekdays: string;
    saturdays: string;
    sundays: string;
  };
}

export interface SiteContent {
  studioName: string;
  logoText: string;
  hero: {
    slides: HeroSlide[];
    primaryCTA: { text: string; href: string };
    secondaryCTA: { text: string; href: string };
  };
  about: {
    badge: string;
    title: string;
    subtitle: string;
    founderName: string;
    founderRole: string;
    founderBio: string[];
    mission: string;
    vision: string;
    image: string;
    highlights: HighlightItem[];
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };
  gallery: {
    badge: string;
    title: string;
    subtitle: string;
    categories: string[];
    items: GalleryItem[];
  };
  specialOffer: {
    badge: string;
    title: string;
    description: string;
    ctaText: string;
    ctaHref: string;
    promoCode: string;
    expiryDate: string;
    backgroundImage: string;
  };
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
  videoSection: {
    badge: string;
    title: string;
    subtitle: string;
    thumbnail: string;
    videoUrl: string; // YouTube embed URL
  };
  team: {
    badge: string;
    title: string;
    subtitle: string;
    items: TeamMember[];
  };
  statistics: {
    items: StatItem[];
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    items: FAQItem[];
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    info: ContactInfo;
    socials: {
      instagram: string;
      facebook: string;
      youtube: string;
    };
  };
  footer: FooterContent;
}

export const siteContent: SiteContent = {
  studioName: "Yogabhyasi",
  logoText: "YOGABHYASI",
  hero: {
    slides: [
      {
        image: "/images/1.webp",
        title: "Harmonize Your Mind, Body & Spirit",
        subtitle: "Experience the profound union of breath, movement, and meditation in a sanctuary designed for your inner peace.",
        badge: "Sanctuary of Wellness",
      },
      {
        image: "/images/2.webp",
        title: "Rediscover Your Natural Balance",
        subtitle: "Guided by master instructors, transition into mindfulness with classes tailored for beginners and advanced yogis alike.",
        badge: "Mindfulness Journey",
      },
      {
        image: "/images/3.webp",
        title: "Nourish Your Soul's Vitality",
        subtitle: "Immerse yourself in Sound Baths, Vinyasa flows, and holistic healing programs designed to unlock your full potential.",
        badge: "Holistic Healing",
      },
    ],
    primaryCTA: { text: "Book Free Trial", href: "#contact" },
    secondaryCTA: { text: "Explore Services", href: "#services" },
  },
  about: {
    badge: "Our Story",
    title: "A Sanctuary for Lifelong Self-Discovery",
    subtitle: "At Yogabhyasi, we believe yoga is not just a practice, but a returning home to your truest self.",
    founderName: "Rohit Malik",
    founderRole: "Founder & Spiritual Director",
    founderBio: [
      "Rohit Malik founded Yogabhyasi with a vision to build a serene space where traditional Hatha yoga practices blend seamlessly with modern anatomical insights.",
      "With over 18 years of teaching experience across India and Southeast Asia, Rohit has mentored hundreds of yoga teachers and helped countless seekers restore physiological balance and emotional resilience.",
      "His classes emphasize the delicate orchestration of Prana (breath) and Asana (posture) as a vehicle for self-healing and transcendental peace."
    ],
    mission: "To guide seekers towards ultimate physical wellbeing, mental clarity, and spiritual elevation through authentic, accessible yogic disciplines.",
    vision: "To establish a global community of mindful practitioners who cultivate peace within themselves and radiate harmony to the world around them.",
    image: "/images/4.webp",
    highlights: [
      {
        icon: "Heart",
        title: "Holistic Health",
        description: "Focusing on body alignment, mental tranquility, and nervous system rejuvenation.",
      },
      {
        icon: "Users",
        title: "Inclusive Community",
        description: "A welcoming, supportive environment for individuals of all ages and backgrounds.",
      },
      {
        icon: "Compass",
        title: "Traditional Roots",
        description: "Preserving authentic lineages of Hatha, Ashtanga, and Pranayama disciplines.",
      },
    ],
  },
  services: {
    badge: "Our Offerings",
    title: "Pathways to Rejuvenation",
    subtitle: "Select from our signature curriculum curated to elevate your physical vigor, breath capacity, and cognitive clarity.",
    items: [
      {
        id: "vinyasa-flow",
        icon: "Activity",
        title: "Vinyasa Flow & Alignment",
        description: "A dynamic and fluid sequence of postures synced with conscious breathing to build stamina, flexibility, and core strength.",
        image: "/images/5.webp",
        benefits: ["Cardiovascular health", "Muscle toning", "Stress release"],
      },
      {
        id: "hatha-restorative",
        icon: "Flower",
        title: "Hatha & Restorative",
        description: "Classic foundational postures held for longer durations combined with props to release deep-seated muscle tension and reset the mind.",
        image: "/images/6.webp",
        benefits: ["Improved posture", "Deep muscular release", "Nervous system balance"],
      },
      {
        id: "pranayama-meditation",
        icon: "Wind",
        title: "Pranayama & Meditation",
        description: "Vedic breath control techniques and guided mindfulness meditation to clear mental fog, regulate emotions, and induce deep peace.",
        image: "/images/7.webp",
        benefits: ["Reduced anxiety", "Greater focus", "Enhanced vital energy"],
      },
      {
        id: "sound-bath",
        icon: "Sparkles",
        title: "Vibrational Sound Therapy",
        description: "A restorative immersion in acoustic frequencies from Tibetan singing bowls and gongs to align your energy centers and cellular vibration.",
        image: "/images/8.webp",
        benefits: ["Deep brainwave relaxation", "Insomnia relief", "Subtle energy clearance"],
      },
    ],
  },
  gallery: {
    badge: "Visual Tour",
    title: "Sanctuary Aesthetics",
    subtitle: "Explore our beautifully designed studio spaces, master classes, and mindful outdoor retreats.",
    categories: ["All", "Studio", "Classes", "Retreats"],
    items: [
      {
        id: "g1",
        src: "/images/11.webp",
        alt: "Studio Main Shala",
        caption: "Main yoga shala flooded with calming natural light and premium bamboo floors.",
        category: "Studio",
      },
      {
        id: "g2",
        src: "/images/12.webp",
        alt: "Morning Hatha Practice",
        caption: "Morning Hatha yoga group session building breath awareness.",
        category: "Classes",
      },
      {
        id: "g3",
        src: "/images/13.webp",
        alt: "Mountain Wellness Retreat",
        caption: "Our annual mindful retreat surrounded by peak serenity.",
        category: "Retreats",
      },
      {
        id: "g4",
        src: "/images/14.webp",
        alt: "Sound Healing Space",
        caption: "Tibetan singing bowls set up for a vibrational sound bath.",
        category: "Studio",
      },
      {
        id: "g5",
        src: "/images/15.webp",
        alt: "Ashtanga Core Alignment",
        caption: "Synchronized movement and breath alignment in Vinyasa flow.",
        category: "Classes",
      },
      {
        id: "g6",
        src: "/images/16.webp",
        alt: "Outdoor Pranic Breathing",
        caption: "Pranayama session overlooking beautiful valleys.",
        category: "Retreats",
      },
      {
        id: "g7",
        src: "/images/1.webp",
        alt: "Sun Salutation Vinyasa",
        caption: "Practitioners alignment check during morning Surya Namaskar flow.",
        category: "Classes",
      },
      {
        id: "g8",
        src: "/images/2.webp",
        alt: "Sunrise Meditation Session",
        caption: "Guided Dhyana overlooking misty mountain vistas.",
        category: "Retreats",
      },
      {
        id: "g9",
        src: "/images/3.webp",
        alt: "Singing Bowl Acoustic Therapy",
        caption: "Individual vibrational therapy targeting cellular relaxation.",
        category: "Studio",
      },
      {
        id: "g10",
        src: "/images/4.webp",
        alt: "Restorative Hatha Posture",
        caption: "Long-hold postures with blocks to release deep muscular tension.",
        category: "Classes",
      },
      {
        id: "g11",
        src: "/images/5.webp",
        alt: "Pranic Breath Workshop",
        caption: "Certified master guides instructing Vedic breathing techniques.",
        category: "Classes",
      },
      {
        id: "g12",
        src: "/images/6.webp",
        alt: "Lounge Reception Space",
        caption: "Calming reception lounge designed for transition into silence.",
        category: "Studio",
      },
      {
        id: "g13",
        src: "/images/7.webp",
        alt: "Sunset Mindful Circle",
        caption: "Gathering for sunset meditation and sharing circles.",
        category: "Retreats",
      },
      {
        id: "g14",
        src: "/images/8.webp",
        alt: "Acoustic Gong Therapy",
        caption: "Deep brainwave relaxation using wind gongs and bowls.",
        category: "Studio",
      },
      {
        id: "g15",
        src: "/images/9.webp",
        alt: "Evening Vinyasa Flow",
        caption: "Flowing with natural breath under warm ambient studio lights.",
        category: "Classes",
      },
      {
        id: "g16",
        src: "/images/10.webp",
        alt: "Forest Breath Rejuvenation",
        caption: "Pranayama sessions inside green pine woodlands.",
        category: "Retreats",
      },
    ],
  },
  specialOffer: {
    badge: "Exclusive Pass",
    title: "14-Day Unlimited Mindful Passage",
    description: "New to Yogabhyasi? Immerse yourself in unlimited yoga, meditation, and sound healing sessions for 14 days. Find the classes, times, and teachers that match your personal rhythm.",
    ctaText: "Claim Your Pass",
    ctaHref: "#contact",
    promoCode: "MINDFUL14",
    expiryDate: "Valid for new members only",
    backgroundImage: "/images/9.webp",
  },
  testimonials: {
    badge: "Testimonials",
    title: "Voices of Transformation",
    subtitle: "Read reviews from our community members who have restored vitality and peace in their lives.",
    items: [
      {
        id: "t1",
        name: "Samantha Miller",
        role: "Creative Director",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        text: "Yogabhyasi completely changed my relationship with my body. The instructors pay incredible attention to alignment. After three months of Hatha, my chronic lower back pain is completely gone, and I sleep like a baby.",
      },
      {
        id: "t2",
        name: "David Chen",
        role: "Software Architect",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        text: "As a developer, my mind is constantly running. The Pranayama and Meditation classes here have become my ultimate reset button. The environment is warm, unpretentious, and deeply calming.",
      },
      {
        id: "t3",
        name: "Elena Rostova",
        role: "Professional Dancer",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        text: "The Sound Therapy and Restorative Yoga sessions here are pure magic. I come here to recover from intense physical training. It is a genuine sanctuary in the middle of a busy city.",
      },
    ],
  },
  videoSection: {
    badge: "Take a Breath",
    title: "A Glimpse Into the Sanctuary",
    subtitle: "Experience the calming rhythm of our space. Press play to view our philosophy, space tours, and practitioner journeys.",
    thumbnail: "/images/10.webp",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  team: {
    badge: "Our Guides",
    title: "Meet Our Wellness Stewards",
    subtitle: "Our certified teachers bring decades of cumulative experience, deep lineage training, and compassionate instruction.",
    items: [
      {
        id: "m1",
        name: "Rohit Malik",
        role: "Founder",
        bio: "Specializes in traditional Hatha, alignment-focused Vinyasa, and deep Pranayama.",
        photo: "/images/4.webp",
        socials: {
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com",
        },
      },
      {
        id: "m2",
        name: "Madhu Chaudhary",
        role: "Cofounder",
        bio: "Integrates clinical therapy with sacred acoustic frequencies and singing bowl practices.",
        photo: "/images/5.webp",
        socials: {
          instagram: "https://instagram.com",
          twitter: "https://twitter.com",
        },
      },
      {
        id: "m3",
        name: "Anuj Chauhan",
        role: "Team Member",
        bio: "Passionate about athletic alignment, strength development, and dynamic flow sequencing.",
        photo: "/images/6.webp",
        socials: {
          linkedin: "https://linkedin.com",
          twitter: "https://twitter.com",
        },
      },
      {
        id: "m4",
        name: "Abhishek Sharma",
        role: "Team Member",
        bio: "Dedicated to restorative yoga, deep brainwave relaxation, and holistic health coaching.",
        photo: "/images/14.webp",
        socials: {
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com",
        },
      },
    ],
  },
  statistics: {
    items: [
      { id: "s1", label: "Happy Seekers", value: 1200, suffix: "+", icon: "Smile" },
      { id: "s2", label: "Years of Practice", value: 18, suffix: "+", icon: "Calendar" },
      { id: "s3", label: "Expert Instructors", value: 8, suffix: "", icon: "Shield" },
      { id: "s4", label: "Monthly Sessions", value: 140, suffix: "+", icon: "Clock" },
    ],
  },
  faq: {
    badge: "FAQ",
    title: "Common Inquiries",
    subtitle: "Here are answers to some questions you might have before attending your first wellness session.",
    items: [
      {
        id: "faq1",
        question: "I am a complete beginner. Which class should I start with?",
        answer: "We highly recommend starting with our Hatha & Restorative classes. These sessions move at a slower pace with extra focus on posture alignment, prop usage, and foundational breathing techniques, making it comfortable for beginners.",
      },
      {
        id: "faq2",
        question: "What should I wear and bring to my first session?",
        answer: "Wear comfortable, stretchable athletic clothing. We provide premium yoga mats, cushions, blocks, and straps at the studio. You are welcome to bring your personal mat, a small towel, and a reusable water bottle.",
      },
      {
        id: "faq3",
        question: "Do I need to book in advance, or can I walk in?",
        answer: "To ensure a peaceful and uncrowded environment, our classes are limited to 15 participants. We highly recommend reserving your mat in advance using our website contact form or by calling us.",
      },
      {
        id: "faq4",
        question: "What is Vibrational Sound Therapy (Sound Bath)?",
        answer: "Sound Therapy is a passive, laying-down meditation. Our certified specialist uses Tibetan singing bowls, wind chimes, and gongs to produce sound waves that ease your brainwaves into deep relaxation (alpha & theta states), helping reduce anxiety and insomnia.",
      },
      {
        id: "faq5",
        question: "Is there parking available at the studio?",
        answer: "Yes, we have free dedicated vehicle parking spaces right outside the sanctuary building, as well as secure bicycle racks.",
      },
    ],
  },
  contact: {
    badge: "Get in Touch",
    title: "Begin Your Path Today",
    subtitle: "Have a question about classes or wellness packages? Fill out the form or reach out to us directly.",
    info: {
      address: "108 Lotus Sanctuary Boulevard, 2nd Floor, Rishikesh, Uttarakhand, India 249201",
      phone: "+91 98765 43210",
      phoneRaw: "+919876543210",
      email: "shala@yogabhyasi.com",
      whatsapp: "https://wa.me/919876543210?text=Hi%20Yogabhyasi,%20I'd%20like%20to%20know%20more%20about%20yoga%20classes.",
      workingHours: {
        weekdays: "06:00 AM - 08:30 PM",
        saturdays: "07:00 AM - 06:00 PM",
        sundays: "08:00 AM - 02:00 PM (Restorative/Sound Bath only)",
      },
    },
    socials: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      youtube: "https://youtube.com",
    },
  },
  footer: {
    aboutText: "Yogabhyasi is a premium wellness sanctuary dedicated to traditional yoga lineages, conscious pranayama, and healing sound therapies. We create space for practitioners to realign their body, slow down their mind, and connect with their inner peace.",
    quickLinks: [
      { label: "Home", href: "#" },
      { label: "About", href: "#about" },
      { label: "Services", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Contact Us", href: "#contact" },
    ],
    legalLinks: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
    copyright: "© 2026 Yogabhyasi Wellness Sanctuary. All rights reserved.",
  },
};
