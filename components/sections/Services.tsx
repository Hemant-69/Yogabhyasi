"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Activity, Flower2, Wind, Sparkles, Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { siteContent } from "@/lib/content";

const iconMap: Record<string, React.ComponentType<any>> = {
  Activity: Activity,
  Flower: Flower2,
  Wind: Wind,
  Sparkles: Sparkles,
};

export default function Services() {
  const { badge, title, subtitle, items } = siteContent.services;

  return (
    <section id="services" className="py-20 md:py-28 bg-white relative">
      {/* Decorative background shapes */}
      <div className="absolute top-1/3 left-0 w-72 h-72 bg-sand-200/40 rounded-full blur-3xl -z-1" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-sage-50/50 rounded-full blur-3xl -z-1" />

      <div className="container mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <SectionHeading badge={badge} title={title} subtitle={subtitle} />

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Activity;

            return (
              <Card
                key={service.id}
                variant="sage-dark"
                delay={index * 0.15}
                className="flex flex-col h-full group overflow-hidden p-0"
              >
                {/* Service Image Header */}
                <div className="relative h-48 w-full overflow-hidden img-zoom-container">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover img-zoom-hover"
                    sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 300px"
                  />
                  {/* Floating Icon */}
                  <div className="absolute top-4 left-4 p-3 rounded-full bg-sage-950/85 text-gold-400 shadow-md backdrop-blur-sm z-10 border border-white/5">
                    <IconComponent className="h-5 w-5" />
                  </div>
                </div>

                {/* Service Info Body */}
                <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-serif font-bold text-xl text-sand-50 group-hover:text-gold-300 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs md:text-sm text-sand-200/80 leading-relaxed font-light">
                      {service.description}
                    </p>
                  </div>

                  {/* Service Benefits List */}
                  <div className="border-t border-white/15 pt-4 mt-auto">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2.5">
                      Key Benefits
                    </h4>
                    <ul className="flex flex-col gap-1.5">
                      {service.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-center gap-2 text-xs text-sand-200/90 font-light">
                          <Check className="h-3.5 w-3.5 text-gold-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
