"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteContent } from "@/lib/content";

export default function FAQ() {
  const { badge, title, subtitle, items } = siteContent.faq;
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-white relative">
      <div className="container mx-auto px-6 md:px-12">
        {/* Section Heading */}
        <SectionHeading badge={badge} title={title} subtitle={subtitle} />

        {/* Accordion List */}
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          {items.map((item, index) => {
            const isOpen = openId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "bg-sand-50 border-sage-200 shadow-sm shadow-sage-900/5"
                    : "bg-white border-sage-100 hover:border-sage-200"
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleFAQ(item.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-6 md:p-7 flex items-center justify-between gap-4 font-serif font-bold text-sage-950 hover:text-sage-800 transition-colors focus:outline-none"
                >
                  <span className="text-base md:text-lg leading-snug">{item.question}</span>
                  <span className={`p-1.5 rounded-full transition-transform duration-300 ${
                    isOpen ? "bg-sage-600 text-sand-50 rotate-180" : "bg-sage-50 text-sage-600"
                  }`}>
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>

                {/* Accordion Answer Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 md:px-7 md:pb-7 text-xs md:text-sm font-sans font-light text-sage-700 leading-relaxed border-t border-sage-100/50 pt-4">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
