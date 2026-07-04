"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Maximize2, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { siteContent } from "@/lib/content";
import Footer from "@/components/sections/Footer";

export default function FullGalleryPage() {
  const { badge, title, subtitle, items } = siteContent.gallery;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (id: string) => {
    const index = items.findIndex((item) => item.id === id);
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
      setLightboxIndex((prev) => (prev! + 1) % items.length);
    }
  };

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! - 1 + items.length) % items.length);
    }
  };

  const activeImage = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <div className="bg-sand-50 min-h-screen flex flex-col pt-24 md:pt-28">
      {/* Gallery Main Container */}
      <section className="py-12 md:py-20 flex-grow relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          {/* Back button at the top */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-sage-600 hover:text-sage-950 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
          </div>

          {/* Section Heading */}
          <SectionHeading
            badge="Visual Archive"
            title="Sanctuary Gallery"
            subtitle="Take a complete visual tour of our mindful spaces, Hatha & Vinyasa classes, and annual outdoor yoga retreats."
          />

          {/* Full Grid (All 16 Items) */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-10"
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                onClick={() => openLightbox(item.id)}
                className="relative aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-md group cursor-pointer img-zoom-container"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover img-zoom-hover"
                  sizes="(max-w-768px) 100vw, (max-w-1024px) 50vw, 300px"
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

          {/* Back button at the bottom */}
          <div className="flex justify-center mt-12 md:mt-16">
            <Link href="/" className="inline-block">
              <Button variant="outline" size="lg" className="group shadow-sm">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>Return to Home</span>
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
