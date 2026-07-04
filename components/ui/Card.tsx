"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "glass-dark" | "outline" | "sage-dark";
  hoverEffect?: boolean;
  animate?: boolean;
  delay?: number;
  children: React.ReactNode;
}

export function Card({
  className,
  variant = "default",
  hoverEffect = true,
  animate = true,
  delay = 0,
  children,
  ...props
}: CardProps) {
  const baseStyles = "rounded-3xl p-6 transition-all duration-300 relative overflow-hidden";
  
  const variants = {
    default: "bg-white shadow-sm border border-slate-100",
    glass: "glass-card",
    "glass-dark": "glass-card-dark text-sand-50",
    outline: "border border-sage-200 bg-transparent",
    "sage-dark": "bg-sage-950 border border-sage-900/50 text-sand-50 shadow-lg",
  };

  const hoverStyles = hoverEffect 
    ? "hover:-translate-y-1.5 hover:shadow-lg hover:shadow-sage-900/5 hover:border-sage-300/30" 
    : "";

  const combinedClasses = cn(baseStyles, variants[variant], hoverStyles, className);

  // Destructure to avoid drag-handler type collisions between React 19 and Framer Motion
  const { onDrag, onDragStart, onDragEnd, ...restProps } = props;

  if (!animate) {
    return (
      <div className={combinedClasses} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className={combinedClasses}
      {...(restProps as any)}
    >
      {children}
    </motion.div>
  );
}
