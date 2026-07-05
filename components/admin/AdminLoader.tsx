"use client";

import React from "react";

interface AdminLoaderProps {
  text?: string;
}

export default function AdminLoader({ text = "Loading..." }: AdminLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      {/* Animated spinner */}
      <div className="relative h-14 w-14">
        {/* Outer slow ring */}
        <div className="absolute inset-0 rounded-full border-2 border-sage-200" />
        {/* Inner fast spinning arc */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-sage-700 border-r-sage-700 animate-spin" />
        {/* Center dot */}
        <div className="absolute inset-[18px] rounded-full bg-sage-700/20 animate-pulse" />
      </div>

      {/* Label */}
      <p className="text-sm font-sans font-medium text-sage-500 tracking-wide animate-pulse">
        {text}
      </p>
    </div>
  );
}
