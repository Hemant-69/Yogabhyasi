"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
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

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}


export default function Team() {
  const { badge, title, subtitle, items } = siteContent.team;

  return (
    <section id="team" className="py-20 md:py-28 bg-sand-100 relative">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <SectionHeading badge={badge} title={title} subtitle={subtitle} />

        {/* Team Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {items.map((member, index) => (
            <Card
              key={member.id}
              variant="glass"
              delay={index * 0.15}
              className="flex flex-col items-center text-center p-4 sm:p-6 lg:p-8 bg-white/50 border border-sage-100 group"
            >
              {/* Photo Frame */}
              <div className="relative h-28 w-28 sm:h-44 sm:w-44 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 sm:mb-6 img-zoom-container flex-shrink-0">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover img-zoom-hover"
                  sizes="(max-w-640px) 112px, 176px"
                />
              </div>

              {/* Name & Role */}
              <h3 className="font-serif font-bold text-base sm:text-xl text-sage-950 mb-1 group-hover:text-sage-800 transition-colors">
                {member.name}
              </h3>
              
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase bg-sage-100 text-sage-700 border border-sage-200/50 mb-2 sm:mb-4">
                {member.role}
              </span>

              {/* Biography */}
              <p className="text-[11px] sm:text-xs md:text-sm text-sage-600 font-light leading-relaxed mb-0">
                {member.bio}
              </p>

            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
