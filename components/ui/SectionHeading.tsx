"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "./Badge";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col gap-3 md:gap-4 max-w-3xl mb-12 md:mb-16",
        centered ? "mx-auto text-center items-center" : "text-left items-start",
        className
      )}
    >

      
      <h2 className="text-3xl md:text-5xl font-serif font-bold text-sage-950 leading-tight tracking-tight">
        {title}
      </h2>
      
      {subtitle && (
        <p className="text-base md:text-lg text-sage-700 font-sans font-light leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
      
      <div className={cn(
        "h-1 w-16 bg-gold-400 rounded-full mt-2",
        centered ? "mx-auto" : "ml-0"
      )} />
    </motion.div>
  );
}
