"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, Send, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { siteContent } from "@/lib/content";

// Validation schema for the compact Free Trial landing Modal
const trialFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(10, { message: "Phone must be at least 10 digits" }),
  whatsapp: z.string().min(10, { message: "WhatsApp must be at least 10 digits" }).max(15, { message: "WhatsApp must be less than 15 digits" }),
});

type TrialFormData = z.infer<typeof trialFormSchema>;

export function FloatingCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [waMessage, setWaMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const phoneRaw = "7300634908";
  const phone = "73006 34908";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrialFormData>({
    resolver: zodResolver(trialFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
    },
  });

  // Automatically trigger the overlay free trial contact modal on landing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const onSubmitTrial = async (data: TrialFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          message: "Free Trial Request from Landing Overlay.",
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitStatus("idle");
          reset();
        }, 3000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWaSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!waMessage.trim()) return;

    // Filter raw phone to digits only for wa.me compatibility
    const cleanPhone = "919717996507";
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
    
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setIsWhatsAppOpen(false);
    setWaMessage("");
  };

  return (
    <>
      {/* Floating Buttons Layout (Shown Always) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
        
        {/* WhatsApp Prompt Popover Box */}
        <AnimatePresence>
          {isWhatsAppOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-28 right-0 w-72 md:w-80 rounded-2xl overflow-hidden shadow-2xl border border-sage-200 bg-sand-100 flex flex-col"
            >
              {/* Header (Dark Teal/Green) */}
              <div className="bg-[#075e54] text-white px-5 py-4 flex items-center justify-between shadow-sm">
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-sm tracking-wider">Welcome To Yogabhyasi.</span>
                  <span className="text-[10px] text-emerald-100/80 font-light mt-0.5">Online • Typically replies instantly</span>
                </div>
                <button
                  onClick={() => setIsWhatsAppOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-emerald-100 transition-colors focus:outline-none"
                  aria-label="Close message window"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body (WhatsApp Chat Background) */}
              <div className="p-4 bg-[#eae6df] flex flex-col gap-3 min-h-[110px] justify-center relative">
                {/* Speech Bubble */}
                <div className="bg-white rounded-2xl rounded-tl-none p-3.5 shadow-sm text-sage-950 text-xs md:text-sm font-sans font-light leading-relaxed max-w-[88%] border border-white/50 relative">
                  <div className="absolute -left-2 top-0 w-2 h-3 bg-white [clip-path:polygon(100%_0,0_0,100%_100%)]" />
                  Do you need any help to book a Yoga Class?
                </div>
              </div>

              {/* Footer Input Area */}
              <form onSubmit={handleWaSend} className="bg-white p-3 flex items-center gap-2 border-t border-sage-100">
                <input
                  type="text"
                  placeholder="Send Your Message..."
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs md:text-sm text-sage-955 focus:outline-none focus:border-[#008069] focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-full bg-emerald-50 text-[#008069] hover:bg-[#008069] hover:text-white transition-colors focus:outline-none flex-shrink-0"
                  aria-label="Send to WhatsApp"
                >
                  <Send className="h-3.5 w-3.5 fill-current ml-0.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* WhatsApp Toggle Button using custom WebP logo (Toggles WhatsApp Feature) */}
        <motion.button
          onClick={() => {
            setIsWhatsAppOpen(!isWhatsAppOpen);
          }}
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center justify-center h-12 w-12 rounded-full shadow-lg hover:shadow-emerald-500/20 transition-all border border-transparent group relative bg-transparent overflow-hidden"
          aria-label="Open WhatsApp Chat Window"
        >
          {isWhatsAppOpen ? (
            <div className="flex items-center justify-center h-full w-full bg-[#075e54] text-white">
              <X className="h-5 w-5" />
            </div>
          ) : (
            <Image
              src="/logo/whatsapp.webp"
              alt="WhatsApp logo"
              fill
              className="object-cover"
              priority
            />
          )}
          {!isWhatsAppOpen && (
            <span className="absolute right-14 bg-sage-900 text-sand-50 text-xs py-1 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
              Chat with Us
            </span>
          )}
        </motion.button>
        {/* Call Now Button */}
        <motion.a
          href={`tel:${phoneRaw}`}
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          className="flex items-center justify-center h-12 w-12 rounded-full bg-sage-600 hover:bg-sage-700 text-sand-50 shadow-lg hover:shadow-sage-600/20 transition-all border border-sage-500/20 group relative"
          aria-label="Call Now"
        >
          <Phone className="h-5 w-5 fill-current" />
          <span className="absolute right-14 bg-sage-900 text-sand-50 text-xs py-1 px-3 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
            Call {phone}
          </span>
        </motion.a>

      </div>

      {/* Free Trial Overlay Form Modal (Triggers Automatically on Entry) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="md" className="p-0">
        <div className="flex flex-col">
          {/* Header Banner */}
          <div className="bg-sage-900 text-white p-6 relative overflow-hidden flex flex-col gap-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl" />
            <span className="flex items-center gap-1.5 text-xs text-gold-300 font-semibold tracking-widest uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Free Trial Class
            </span>
            <h3 className="font-serif font-bold text-2xl text-sand-50 mt-1">Book Your Free Trial</h3>
            <p className="text-xs text-sand-200/80 font-light mt-1 max-w-[90%] leading-relaxed">
              Enter your contact details to reserve your free trial session at Yogabhyasi.
            </p>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8 bg-sand-50">
            <form onSubmit={handleSubmit(onSubmitTrial)} className="flex flex-col gap-4">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1">
                <label htmlFor="modal-name" className="text-[10px] font-semibold text-sage-800 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  id="modal-name"
                  type="text"
                  placeholder="Enter your name"
                  {...register("name")}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans font-light bg-white focus:outline-none focus:ring-2 focus:ring-sage-500 ${
                    errors.name ? "border-red-400 focus:ring-red-400" : "border-sage-100 focus:border-sage-300"
                  }`}
                />
                {errors.name && (
                  <span className="text-[9px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="h-3 w-3" /> {errors.name.message}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label htmlFor="modal-email" className="text-[10px] font-semibold text-sage-800 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="modal-email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans font-light bg-white focus:outline-none focus:ring-2 focus:ring-sage-500 ${
                    errors.email ? "border-red-400 focus:ring-red-400" : "border-sage-100 focus:border-sage-300"
                  }`}
                />
                {errors.email && (
                  <span className="text-[9px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="h-3 w-3" /> {errors.email.message}
                  </span>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1">
                <label htmlFor="modal-phone" className="text-[10px] font-semibold text-sage-800 uppercase tracking-wider">
                  Phone Number
                </label>
                <input
                  id="modal-phone"
                  type="tel"
                  placeholder="Enter phone number"
                  {...register("phone")}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans font-light bg-white focus:outline-none focus:ring-2 focus:ring-sage-500 ${
                    errors.phone ? "border-red-400 focus:ring-red-400" : "border-sage-100 focus:border-sage-300"
                  }`}
                />
                {errors.phone && (
                  <span className="text-[9px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="h-3 w-3" /> {errors.phone.message}
                  </span>
                )}
              </div>

              {/* WhatsApp */}
              <div className="flex flex-col gap-1">
                <label htmlFor="modal-whatsapp" className="text-[10px] font-semibold text-sage-800 uppercase tracking-wider">
                  WhatsApp Number
                </label>
                <input
                  id="modal-whatsapp"
                  type="text"
                  placeholder="Enter WhatsApp number"
                  {...register("whatsapp")}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-sans font-light bg-white focus:outline-none focus:ring-2 focus:ring-sage-500 ${
                    errors.whatsapp ? "border-red-400 focus:ring-red-400" : "border-sage-100 focus:border-sage-300"
                  }`}
                />
                {errors.whatsapp && (
                  <span className="text-[9px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="h-3 w-3" /> {errors.whatsapp.message}
                  </span>
                )}
              </div>

              {/* Status Message Panel */}
              <AnimatePresence mode="wait">
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-3 mt-1"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Booking Request Received!</p>
                      <p className="text-[10px] text-emerald-700/90 font-light mt-0.5">
                        We have registered your details. A guide will call you shortly to confirm your booking.
                      </p>
                    </div>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-xl bg-red-50 text-red-800 border border-red-200 text-xs flex items-center gap-3 mt-1"
                  >
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Submission failed.</p>
                      <p className="text-[10px] text-red-700/90 font-light mt-0.5">
                        Please try again or call us directly.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Trigger */}
              <Button
                type="submit"
                variant="gold"
                size="md"
                disabled={isSubmitting || submitStatus === "success"}
                className="w-full mt-2 font-semibold shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 border-2 border-sand-50 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Book Free Trial</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}
