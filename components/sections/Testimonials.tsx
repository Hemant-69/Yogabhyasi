"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StarRating } from "@/components/ui/StarRating";
import { Card } from "@/components/ui/Card";
import { siteContent } from "@/lib/content";

export default function Testimonials() {
  const { badge, title, subtitle, items } = siteContent.testimonials;

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-sand-100 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-gold-100/40 rounded-full blur-3xl -z-1" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-sage-100/40 rounded-full blur-3xl -z-1" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Heading */}
        <SectionHeading badge={badge} title={title} subtitle={subtitle} />

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <Card
              key={item.id}
              variant="glass"
              delay={index * 0.15}
              className="flex flex-col justify-between p-8 bg-white/60 hover:bg-white/80 transition-colors border border-white"
            >
              {/* Quote Mark Decoration */}
              <div className="flex flex-col gap-4">
                <Quote className="h-8 w-8 text-gold-500/40 fill-none rotate-180" />
                <p className="text-sage-800 text-sm md:text-base font-light italic leading-relaxed">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-4 border-t border-sage-100 pt-6 mt-8">
                {/* Profile Pic */}
                <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/50 shadow-sm flex-shrink-0">
                  <Image
                    src={item.photo}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                {/* Name & Stars */}
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-serif font-bold text-sage-950 text-sm">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-sage-600 tracking-wider uppercase font-medium">
                    {item.role}
                  </p>
                  <StarRating rating={item.rating} className="mt-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
