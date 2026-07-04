"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Maximize2, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { siteContent } from "@/lib/content";

export default function Gallery() {
  const { badge, title, subtitle, items } = siteContent.gallery;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Show a preview of 6 items on the home page
  const displayItems = items.slice(0, 6);

  const openLightbox = (id: string) => {
    const index = displayItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      setLightboxIndex(index);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! + 1) % displayItems.length);
    }
  };

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! - 1 + displayItems.length) % displayItems.length);
    }
  };

  const activeImage = lightboxIndex !== null ? displayItems[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-20 md:py-28 bg-sand-50 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <SectionHeading badge={badge} title={title} subtitle={subtitle} />

        {/* Gallery Grid (Static 6 Items Preview - Reduced Size) */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto"
        >
          {displayItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onClick={() => openLightbox(item.id)}
              className="relative aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-md group cursor-pointer img-zoom-container"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover img-zoom-hover"
                sizes="(max-w-768px) 50vw, 150px"
              />
              
              {/* Hover overlay (no text) */}
              <div className="absolute inset-0 bg-sage-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                <div className="h-10 w-10 rounded-full bg-white/20 text-white backdrop-blur-sm flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Maximize2 className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View Full Gallery Link Button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Link href="/gallery" className="inline-block">
            <Button variant="primary" size="lg" className="group shadow-md">
              <span>View Full Gallery</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={lightboxIndex !== null}
        onClose={closeLightbox}
        size="xl"
        className="bg-transparent border-none shadow-none text-white max-h-screen"
      >
        {activeImage && (
          <div className="relative w-full h-[70vh] flex flex-col items-center justify-center p-0">
            {/* Image display */}
            <div className="relative w-full h-[85%] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={activeImage.src}
                alt={activeImage.alt}
                fill
                className="object-contain"
                sizes="(max-w-1200px) 100vw, 1200px"
                priority
              />
            </div>

            {/* Navigation buttons */}
            <button
              onClick={showPrev}
              className="absolute left-0 md:-left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-sage-900/60 hover:bg-sage-900 text-white transition-all backdrop-blur-sm hover:scale-105 z-30"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={showNext}
              className="absolute right-0 md:-right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-sage-900/60 hover:bg-sage-900 text-white transition-all backdrop-blur-sm hover:scale-105 z-30"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Caption & Category tag */}
            <div className="w-full text-center mt-4 px-4 flex flex-col gap-1 z-10 text-sage-950 bg-white/80 p-4 rounded-xl backdrop-blur-sm border border-white/40">
              <span className="text-[10px] uppercase tracking-widest text-gold-600 font-bold">
                {activeImage.category}
              </span>
              <h3 className="font-serif font-bold text-lg">{activeImage.alt}</h3>
              <p className="text-xs text-sage-700 font-light max-w-xl mx-auto">
                {activeImage.caption}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
