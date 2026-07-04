"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Smile, Calendar, Shield, Clock } from "lucide-react";
import { siteContent } from "@/lib/content";

const iconMap: Record<string, React.ComponentType<any>> = {
  Smile: Smile,
  Calendar: Calendar,
  Shield: Shield,
  Clock: Clock,
};

function Counter({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function StatsCounter() {
  const { items } = siteContent.statistics;

  return (
    <section className="py-16 bg-sage-900 text-sand-50 relative overflow-hidden">
      {/* Background soft lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sage-800 via-sage-900 to-sage-950 opacity-40" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {items.map((stat, index) => {
            const IconComponent = iconMap[stat.icon] || Smile;

            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col items-center text-center gap-3"
              >
                {/* Icon wrapper */}
                <div className="p-4 rounded-full bg-white/5 border border-white/10 text-gold-400 mb-2">
                  <IconComponent className="h-6 w-6" />
                </div>

                {/* Animated counter number */}
                <span className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-sand-50">
                  <Counter value={stat.value} />
                  <span className="text-gold-400">{stat.suffix}</span>
                </span>

                {/* Stat label */}
                <span className="text-xs md:text-sm font-light text-sand-200/80 uppercase tracking-widest">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
