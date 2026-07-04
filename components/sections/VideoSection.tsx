"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Modal } from "@/components/ui/Modal";
import { siteContent } from "@/lib/content";

export default function VideoSection() {
  const { badge, title, subtitle, thumbnail, videoUrl } = siteContent.videoSection;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sage-50 rounded-full blur-3xl -z-1 opacity-60" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Heading */}
        <SectionHeading badge={badge} title={title} subtitle={subtitle} />

        {/* Video Card Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl border-4 border-white cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          {/* Cover Thumbnail */}
          <Image
            src={thumbnail}
            alt="Studio video preview"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-103"
            sizes="(max-w-1024px) 100vw, 900px"
          />
          {/* Subtle dimming layer */}
          <div className="absolute inset-0 bg-sage-950/20 group-hover:bg-sage-950/30 transition-colors duration-300" />

          {/* Pulsing Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative h-20 w-20 flex items-center justify-center rounded-full bg-white text-sage-900 shadow-2xl backdrop-blur-sm transition-transform duration-300"
            >
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
              <Play className="h-8 w-8 fill-current ml-1" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Video Playback Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl" className="p-0 overflow-hidden bg-black max-w-4xl">
        <div className="relative w-full aspect-video bg-black rounded-[1.5rem] overflow-hidden">
          {isOpen && (
            <iframe
              src={`${videoUrl}?autoplay=1&rel=0`}
              title="Yogabhyasi Wellness Sanctuary Tour"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          )}
        </div>
      </Modal>
    </section>
  );
}
