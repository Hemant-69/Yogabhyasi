"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Users, Compass } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteContent } from "@/lib/content";

const iconMap: Record<string, React.ComponentType<any>> = {
  Heart: Heart,
  Users: Users,
  Compass: Compass,
};

export default function About() {
  const {
    badge,
    title,
    subtitle,
    founderName,
    founderRole,
    founderBio,
    image,
    highlights,
  } = siteContent.about;

  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor window resize to enable slider autoplay only on mobile/tablet screens
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Trigger immediately on mount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track active slide index during manual user swipes
  const handleScroll = () => {
    if (!isMobile) return;
    const container = sliderRef.current;
    if (container) {
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.clientWidth;
      const index = Math.round(scrollLeft / cardWidth);
      // Ensure index is bounded
      if (index >= 0 && index < highlights.length) {
        setActiveIndex(index);
      }
    }
  };

  // Autoplay loop on mobile screens (triggers every 3.5 seconds)
  useEffect(() => {
    if (!isMobile || highlights.length <= 1) return;

    const timer = setInterval(() => {
      const container = sliderRef.current;
      if (container) {
        const nextIndex = (activeIndex + 1) % highlights.length;
        const children = container.children;
        if (children && children[nextIndex]) {
          const child = children[nextIndex] as HTMLElement;
          container.scrollTo({
            left: child.offsetLeft - container.offsetLeft,
            behavior: "smooth",
          });
          setActiveIndex(nextIndex);
        }
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [activeIndex, isMobile, highlights.length]);

  return (
    <section id="about" className="py-20 md:py-28 bg-sand-100 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Title */}
        <SectionHeading badge={badge} title={title} subtitle={subtitle} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image with Decorative Frames */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            {/* Background decorative circles */}
            <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full border border-gold-300/40 -z-1" />
            <div className="absolute -bottom-8 -right-4 w-40 h-40 rounded-full bg-sage-100/50 -z-1" />

            {/* Main Portrait Frame */}
            <div className="relative rounded-[2.5rem] overflow-hidden aspect-[4/5] shadow-xl border-4 border-white shadow-sage-950/5">
              <Image
                src={image}
                alt={founderName}
                fill
                className="object-cover"
                sizes="(max-w-768px) 100vw, 500px"
              />
              {/* Founder Tag Glass Card */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-card text-sage-950 border border-white/20">
                <h4 className="font-serif font-bold text-lg">{founderName}</h4>
                <p className="text-xs text-sage-600 tracking-wider uppercase font-medium">{founderRole}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative & Values */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="lg:col-span-7 flex flex-col gap-8"
          >
            {/* Story Bio */}
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl md:text-3xl font-serif font-semibold text-sage-950">
                Meet the Founder
              </h3>
              {founderBio.map((paragraph, index) => (
                <p key={index} className="text-sage-700 font-light leading-relaxed text-sm md:text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Highlights Grid Slider on Mobile */}
            <div className="relative">
              <style dangerouslySetInnerHTML={{__html: `
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .no-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}} />
              
              <div
                ref={sliderRef}
                onScroll={handleScroll}
                className="flex sm:grid sm:grid-cols-3 gap-6 overflow-x-auto sm:overflow-x-visible snap-x snap-mandatory pb-4 sm:pb-0 no-scrollbar"
              >
                {highlights.map((highlight, index) => {
                  const IconComponent = iconMap[highlight.icon] || Heart;
                  return (
                    <div
                      key={index}
                      className="flex flex-col gap-2 p-5 rounded-2xl bg-white/50 border border-sage-100 min-w-[260px] w-[80vw] sm:w-auto sm:min-w-0 snap-center flex-shrink-0 transition-all duration-300"
                    >
                      <div className="p-3 rounded-full bg-sage-50 w-fit text-sage-600">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h5 className="font-serif font-bold text-sage-950 text-sm">{highlight.title}</h5>
                      <p className="text-xs text-sage-600 leading-relaxed font-light">{highlight.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Slider dots indicator for mobile views */}
              <div className="flex sm:hidden justify-center gap-1.5 mt-3">
                {highlights.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const container = sliderRef.current;
                      if (container && container.children[idx]) {
                        const child = container.children[idx] as HTMLElement;
                        container.scrollTo({
                          left: child.offsetLeft - container.offsetLeft,
                          behavior: "smooth",
                        });
                        setActiveIndex(idx);
                      }
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeIndex === idx ? "w-4 bg-sage-600" : "w-1.5 bg-sage-300"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
