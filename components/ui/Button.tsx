"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  animate?: boolean;
  children: React.ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  animate = true,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none tracking-wide";
  
  const variants = {
    primary: "bg-sage-600 hover:bg-sage-700 text-sand-50 shadow-md shadow-sage-900/10 focus:ring-sage-500",
    secondary: "bg-sand-200 hover:bg-sand-300 text-sage-950 focus:ring-sand-400",
    outline: "border border-sage-400/50 hover:border-sage-600 text-sage-800 hover:bg-sage-50/50 focus:ring-sage-400",
    ghost: "text-sage-800 hover:bg-sage-50 focus:ring-sage-400",
    gold: "bg-gold-600 hover:bg-gold-700 text-sand-50 shadow-md shadow-gold-900/10 focus:ring-gold-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const combinedClasses = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  // Destructure to avoid drag-handler type collisions between React 19 and Framer Motion
  const { onDrag, onDragStart, onDragEnd, ...restProps } = props;

  if (!animate) {
    return (
      <button className={combinedClasses} {...props}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={combinedClasses}
      {...(restProps as any)}
    >
      {children}
    </motion.button>
  );
}
