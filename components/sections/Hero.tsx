"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteContent } from "@/lib/content";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  );
}

interface HeroProps {
  siteSettings?: Record<string, string>;
}

export default function Hero({ siteSettings }: HeroProps) {
  const slides = siteContent.hero.slides;
  const primaryCTA = siteContent.hero.primaryCTA;
  const secondaryCTA = siteContent.hero.secondaryCTA;
  const info = siteContent.contact.info;

  const workingHours = {
    weekdays: siteSettings?.hours_weekdays || info.workingHours.weekdays,
    saturdays: siteSettings?.hours_saturdays || info.workingHours.saturdays,
    sundays: siteSettings?.hours_sundays || info.workingHours.sundays,
  };

  // Use values from content configuration
  const mainBadge = slides[0].badge;
  const mainTitle = slides[0].title;
  const mainSubtitle = slides[0].subtitle;
  
  // Montage image mapping
  const imageSmallLeft = slides[0].image;  // /images/1.webp (Small Top-Left)
  const imageSmallRight = slides[1].image; // /images/2.webp (Small Bottom-Right)
  const imageBig = slides[2].image;        // /images/3.webp (Big Center - Vertical Rectangle)

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] lg:min-h-[80vh] w-full bg-sage-950 text-white flex items-center pt-28 pb-16 md:py-20 lg:py-24 overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/Hero-bg.webp"
          alt="Hero Background"
          fill
          priority
          className="object-cover opacity-65"
        />
        {/* Gradient overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-sage-950/80 via-sage-950/40 to-sage-950/20" />
      </div>

      {/* Decorative background highlights */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sage-900 rounded-full blur-3xl opacity-30 z-0" />
      <div className="absolute bottom-[-15%] left-[-5%] w-[600px] h-[600px] bg-gold-950/15 rounded-full blur-3xl opacity-30 z-0" />

      <div className="container mx-auto px-6 md:px-12 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading, Subtitle, and Buttons (Tighter Column: 5/12 width) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, x: -45 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  staggerChildren: 0.15,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                },
              },
            }}
            className="lg:col-span-5 flex flex-col items-start text-left"
          >

            {/* Main Title */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-sand-50 leading-[1.1] mb-6 tracking-tight drop-shadow-sm"
            >
              {mainTitle}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="text-base sm:text-lg font-light text-sand-200/90 max-w-xl leading-relaxed mb-10 font-sans"
            >
              {mainSubtitle}
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-row gap-2.5 items-center w-full sm:w-auto"
            >
              <Button
                variant="gold"
                size="lg"
                onClick={() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group flex-1 sm:flex-none w-full sm:w-auto justify-center text-[11px] xs:text-xs sm:text-sm px-2.5 sm:px-6 py-3"
              >
                {primaryCTA.text}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 flex-shrink-0" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="border-sand-200/40 text-sand-50 hover:bg-sand-200/10 flex-1 sm:flex-none w-full sm:w-auto justify-center text-[11px] xs:text-xs sm:text-sm px-2.5 sm:px-6 py-3"
              >
                {secondaryCTA.text}
              </Button>
            </motion.div>

            {/* Hours of Practice */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="mt-10 pt-6 border-t border-white/10 w-full max-w-sm text-[11px] text-sand-200/80 font-light space-y-2.5"
            >
              <div className="flex items-center gap-2 text-sand-100 font-medium">
                <span className="uppercase tracking-wider font-semibold text-[9px]">Hours of Practice</span>
              </div>
              <div className="space-y-1.5 font-sans">
                <div className="flex justify-between">
                  <span>Mon - Fri</span>
                  <span className="font-medium text-sand-50">{workingHours.weekdays}</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-sand-50">{workingHours.saturdays}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-sand-50">{workingHours.sundays}</span>
                </div>
              </div>
            </motion.div>

            {/* Social Media Icons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-8 pt-6 border-t border-white/10 w-full max-w-sm"
            >
              {/* Instagram */}
              <a
                href="https://www.instagram.com/yog.abhyasi_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-sand-200/70 hover:text-gold-400 transition-colors group"
                aria-label="Instagram"
              >
                <div className="flex items-center justify-center p-1.5 rounded-full border border-white/10 bg-white/5 group-hover:border-gold-400/30 group-hover:bg-gold-500/5 transition-all">
                  <InstagramIcon className="h-3.5 w-3.5" />
                </div>
                <span>Instagram</span>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/yogabhyasi12"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-sand-200/70 hover:text-gold-400 transition-colors group"
                aria-label="Telegram"
              >
                <div className="flex items-center justify-center p-1.5 rounded-full border border-white/10 bg-white/5 group-hover:border-gold-400/30 group-hover:bg-gold-500/5 transition-all">
                  <TelegramIcon className="h-3.5 w-3.5" />
                </div>
                <span>Telegram</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919717996507"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-sand-200/70 hover:text-gold-400 transition-colors group"
                aria-label="WhatsApp"
              >
                <div className="flex items-center justify-center p-1.5 rounded-full border border-white/10 bg-white/5 group-hover:border-gold-400/30 group-hover:bg-gold-500/5 transition-all">
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                </div>
                <span>WhatsApp</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column: Montage - Expanded Sizing (Larger Column: 7/12 width) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 45 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-7 flex items-center justify-center"
          >
            {/* Enlarged square aspect container */}
            <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[460px] md:max-w-[500px] lg:max-w-[560px]">

              {/* 1. Big Main Image (Center - Portrait Aspect 3:4) — slow float up-down */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -14, 0],
                }}
                transition={{
                  opacity: { duration: 0.7, delay: 0.3 },
                  scale: { duration: 0.7, delay: 0.3 },
                  y: {
                    delay: 0.3,
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                whileHover={{ scale: 1.03 }}
                className="absolute top-[10%] left-[20%] w-[60%] h-[80%] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-sage-950 z-10 cursor-pointer"
              >
                <Image
                  src={imageBig}
                  alt="Yoga practice shala environment"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-w-1024px) 60vw, 450px"
                />
              </motion.div>

              {/* 2. Small Image: Top-Left Corner — offset float (faster, slight rotate) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.75, x: -20, y: -20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: [0, -10, 0],
                  rotate: [-1, 1, -1],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.55 },
                  scale: { duration: 0.6, delay: 0.55 },
                  x: { duration: 0.6, delay: 0.55 },
                  y: {
                    delay: 0.55,
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    delay: 0.55,
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                whileHover={{ scale: 1.08 }}
                className="absolute top-0 left-0 w-[32%] aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-sage-950 z-20 cursor-pointer"
              >
                <Image
                  src={imageSmallLeft}
                  alt="Yoga alignment details"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-w-768px) 30vw, 180px"
                />
              </motion.div>

              {/* 3. Small Image: Bottom-Right Corner — counter-phase float */}
              <motion.div
                initial={{ opacity: 0, scale: 0.75, x: 20, y: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  y: [0, 10, 0],
                  rotate: [1, -1, 1],
                }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.75 },
                  scale: { duration: 0.6, delay: 0.75 },
                  x: { duration: 0.6, delay: 0.75 },
                  y: {
                    delay: 0.75,
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    delay: 0.75,
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                whileHover={{ scale: 1.08 }}
                className="absolute bottom-0 right-0 w-[32%] aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-sage-950 z-20 cursor-pointer"
              >
                <Image
                  src={imageSmallRight}
                  alt="Mindfulness meditation"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-w-768px) 30vw, 180px"
                />
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
