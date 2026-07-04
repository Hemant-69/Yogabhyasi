"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteContent } from "@/lib/content";

export default function SpecialOffer() {
  const {
    badge,
    title,
    description,
    ctaText,
    ctaHref,
    promoCode,
    expiryDate,
    backgroundImage,
  } = siteContent.specialOffer;

  return (
    <section className="relative py-24 overflow-hidden bg-sage-950 text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-25">
        <Image
          src={backgroundImage}
          alt="Special Promotion"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sage-950 via-sage-950/80 to-sage-900/90" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Promotion Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 flex flex-col gap-5 text-left"
          >

            
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-sand-50 leading-tight">
              {title}
            </h2>
            
            <p className="text-base md:text-lg text-sand-200/90 font-light leading-relaxed max-w-2xl font-sans">
              {description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-light text-sand-200 mt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-gold-400" />
                <span>{expiryDate}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Code & Call to Action (Glass Card) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rounded-[2rem] p-8 md:p-10 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl flex flex-col gap-6 text-center">
              <h3 className="font-serif font-bold text-2xl text-sand-50">
                Unlock Offer
              </h3>
              
              {/* Promo Code Block */}
              <div className="flex flex-col gap-2 p-5 rounded-2xl bg-sage-900/60 border border-white/15">
                <span className="text-[10px] uppercase tracking-widest text-gold-300 font-semibold">
                  Copy Promo Code
                </span>
                <div className="flex items-center justify-center gap-2 font-mono text-xl font-bold tracking-wider text-gold-300 select-all">
                  <Tag className="h-4 w-4 text-gold-400" />
                  <span>{promoCode}</span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                variant="gold"
                size="lg"
                onClick={() => {
                  document.getElementById(ctaHref.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full shadow-lg"
              >
                {ctaText}
              </Button>

              <p className="text-[10px] text-sand-200/50 font-light uppercase tracking-wider">
                Voucher applied on form submission
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
