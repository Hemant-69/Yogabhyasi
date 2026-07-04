import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "outline";
  children: React.ReactNode;
}

export function Badge({ children, variant = "default", className, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300";
  
  const variants = {
    default: "bg-sage-100 text-sage-800 border border-sage-200/50",
    gold: "bg-gold-50 text-gold-700 border border-gold-200/50",
    outline: "border border-sage-300 text-sage-800 bg-transparent",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
