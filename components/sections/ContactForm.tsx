"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteContent } from "@/lib/content";

// Define Validation Schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters" })
    .max(15, { message: "Phone number must be less than 15 characters" }),
  whatsapp: z
    .string()
    .min(10, { message: "WhatsApp number must be at least 10 characters" })
    .max(15, { message: "WhatsApp number must be less than 15 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  siteSettings?: Record<string, string>;
}

export default function ContactForm({ siteSettings }: ContactFormProps) {
  const { badge, title, subtitle, info: staticInfo } = siteContent.contact;

  const info = {
    address: siteSettings?.contact_address || staticInfo.address,
    phone: siteSettings?.contact_phone || staticInfo.phone,
    whatsapp: siteSettings?.contact_whatsapp || staticInfo.phone,
    phoneRaw: (siteSettings?.contact_phone || staticInfo.phoneRaw).replace(/[^0-9]/g, ""),
    email: siteSettings?.contact_email || staticInfo.email,
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-sand-100 relative overflow-hidden">
      {/* Decorative blurred backgrounds */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gold-100 rounded-full blur-3xl -z-1 opacity-60" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-sage-100 rounded-full blur-3xl -z-1 opacity-60" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section Heading */}
        <SectionHeading badge={badge} title={title} subtitle={subtitle} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch max-w-6xl mx-auto">
          {/* Left Column: Direct contact info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col justify-between p-8 md:p-10 rounded-[2.5rem] bg-sage-900 text-sand-50 shadow-xl"
          >
            <div className="flex flex-col gap-8">
              <h3 className="font-serif font-bold text-2xl md:text-3xl text-sand-50 leading-tight">
                Sanctuary Information
              </h3>

              {/* Info Items */}
              <div className="flex flex-col gap-6 md:gap-7">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 text-gold-400 h-fit">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-sand-300/60 font-semibold">Address</span>
                    <p className="text-sm font-light text-sand-200 leading-relaxed">{info.address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 text-gold-400 h-fit">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-sand-300/60 font-semibold">Phone</span>
                    <a href={`tel:${info.phoneRaw}`} className="text-sm font-light text-sand-200 hover:text-gold-400 transition-colors">
                      {info.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex gap-4">
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 text-gold-400 h-fit">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      <path d="M16 13c-.5-.5-1-.5-1.5 0l-.7.7c-.2.2-.4.2-.6 0-.5-.3-1-.7-1.4-1.1-.4-.4-.8-.9-1.1-1.4-.2-.2-.2-.4 0-.6l.7-.7c.5-.5.5-1 0-1.5l-2-2c-.5-.5-1-.5-1.5 0l-.7.7c-.5.5-.6 1.2-.2 1.8.8 1.4 1.9 2.6 3.1 3.8 1.2 1.2 2.4 2.3 3.8 3.1.6.4 1.3.3 1.8-.2l.7-.7c.5-.5.5-1 0-1.5l-2-2z" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-sand-300/60 font-semibold">WhatsApp</span>
                    <a
                      href={`https://wa.me/${(info.whatsapp).replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-light text-sand-200 hover:text-gold-400 transition-colors"
                    >
                      {info.whatsapp}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 text-gold-400 h-fit">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-sand-300/60 font-semibold">Email</span>
                    <a href={`mailto:${info.email}`} className="text-sm font-light text-sand-200 hover:text-gold-400 transition-colors break-all">
                      {info.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact form validation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 p-8 md:p-10 rounded-[2.5rem] bg-white border border-sage-100 shadow-xl flex flex-col justify-center"
          >
            <h3 className="font-serif font-bold text-2xl md:text-3xl text-sage-950 mb-6 leading-tight">
              Request Your Free Trial
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-xs font-semibold text-sage-800 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  {...register("name")}
                  className={`w-full px-5 py-3 rounded-xl border text-sm font-sans font-light transition-all focus:outline-none focus:ring-2 focus:ring-sage-500 bg-sand-50/50 ${
                    errors.name ? "border-red-400 focus:ring-red-400" : "border-sage-100 focus:border-sage-300"
                  }`}
                />
                {errors.name && (
                  <span className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="h-3 w-3" /> {errors.name.message}
                  </span>
                )}
              </div>

              {/* Email, Phone & WhatsApp Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-sage-800 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register("email")}
                    className={`w-full px-5 py-3 rounded-xl border text-sm font-sans font-light transition-all focus:outline-none focus:ring-2 focus:ring-sage-500 bg-sand-50/50 ${
                      errors.email ? "border-red-400 focus:ring-red-400" : "border-sage-100 focus:border-sage-300"
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                      <AlertCircle className="h-3 w-3" /> {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="phone" className="text-xs font-semibold text-sage-800 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    {...register("phone")}
                    className={`w-full px-5 py-3 rounded-xl border text-sm font-sans font-light transition-all focus:outline-none focus:ring-2 focus:ring-sage-500 bg-sand-50/50 ${
                      errors.phone ? "border-red-400 focus:ring-red-400" : "border-sage-100 focus:border-sage-300"
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                      <AlertCircle className="h-3 w-3" /> {errors.phone.message}
                    </span>
                  )}
                </div>

                {/* WhatsApp Number */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="whatsapp" className="text-xs font-semibold text-sage-800 uppercase tracking-wider">
                    WhatsApp Number
                  </label>
                  <input
                    id="whatsapp"
                    type="text"
                    placeholder="Enter WhatsApp number"
                    {...register("whatsapp")}
                    className={`w-full px-5 py-3 rounded-xl border text-sm font-sans font-light transition-all focus:outline-none focus:ring-2 focus:ring-sage-500 bg-sand-50/50 ${
                      errors.whatsapp ? "border-red-400 focus:ring-red-400" : "border-sage-100 focus:border-sage-300"
                    }`}
                  />
                  {errors.whatsapp && (
                    <span className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                      <AlertCircle className="h-3 w-3" /> {errors.whatsapp.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-sage-800 uppercase tracking-wider">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Tell us about your wellness goals or yoga experience..."
                  {...register("message")}
                  className={`w-full px-5 py-3 rounded-xl border text-sm font-sans font-light transition-all focus:outline-none focus:ring-2 focus:ring-sage-500 bg-sand-50/50 resize-none ${
                    errors.message ? "border-red-400 focus:ring-red-400" : "border-sage-100 focus:border-sage-300"
                  }`}
                />
                {errors.message && (
                  <span className="text-[10px] text-red-500 font-medium flex items-center gap-1 mt-0.5">
                    <AlertCircle className="h-3 w-3" /> {errors.message.message}
                  </span>
                )}
              </div>

              {/* Status Notifications */}
              <AnimatePresence mode="wait">
                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Message Sent Successfully!</p>
                      <p className="text-xs text-emerald-700/90 font-light mt-0.5">
                        We have reserved your trial pass. A wellness guide will contact you shortly.
                      </p>
                    </div>
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 rounded-xl bg-red-50 text-red-800 border border-red-200 text-sm flex items-center gap-3"
                  >
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Something went wrong.</p>
                      <p className="text-xs text-red-700/90 font-light mt-0.5">
                        Failed to deliver your request. Please try again or call us directly.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="gold"
                size="lg"
                disabled={isSubmitting}
                className="w-full mt-2 font-semibold shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-sand-50 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Request</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Google Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 w-full overflow-hidden rounded-[2.5rem] border border-sage-200/50 bg-white p-4 shadow-lg hover:shadow-xl transition-all"
        >
          {/* Map Frame Wrapper */}
          <div className="relative w-full h-[450px] rounded-[1.75rem] overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?q=28.426212,77.06642&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Yogabhyasi Sanctuary Location"
              className="absolute inset-0"
            />
            
            {/* Frosted Glass Overlay Card (Desktop Only) */}
            <div className="absolute top-6 left-6 z-20 max-w-sm hidden md:flex bg-sage-950/90 text-sand-50 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 shadow-2xl flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-gold-300 uppercase">Yogabhyasi Sanctuary</span>
              </div>
              
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=28.426212,77.06642"
                target="_blank"
                rel="noopener noreferrer"
                className="space-y-1 block hover:opacity-85 transition-opacity"
              >
                <h4 className="font-serif font-bold text-lg text-sand-50 hover:text-gold-300 transition-colors flex items-center gap-1.5">
                  <span>Visit Our Shala</span>
                  <span className="text-xs">↗</span>
                </h4>
                <p className="text-xs text-sand-200/80 font-light leading-relaxed">
                  {info.address}
                </p>
              </a>

              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-sand-200/70">
                  <span className="text-xs">📞</span>
                  <span>{info.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-sand-200/70">
                  <span className="text-xs">✉️</span>
                  <span className="truncate">{info.email}</span>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/dir/?api=1&destination=28.426212,77.06642"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 w-full py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-sage-950 text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Get Directions</span>
                <span>➔</span>
              </a>
            </div>
          </div>

          {/* Mobile Overlay Card (Visible only on small screens below the map frame) */}
          <div className="block md:hidden mt-4 p-5 rounded-[1.75rem] bg-sage-950 text-sand-50 border border-white/5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold-400" />
              <span className="text-[9px] font-bold tracking-widest text-gold-300 uppercase">Yogabhyasi Sanctuary</span>
            </div>
            
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=28.426212,77.06642"
              target="_blank"
              rel="noopener noreferrer"
              className="space-y-1 block hover:opacity-85 transition-opacity"
            >
              <h4 className="font-serif font-bold text-base text-sand-50 hover:text-gold-300 transition-colors flex items-center gap-1.5">
                <span>Visit Our Shala</span>
                <span className="text-xs">↗</span>
              </h4>
              <p className="text-xs text-sand-200/80 font-light leading-relaxed">
                {info.address}
              </p>
            </a>

            <a
              href="https://www.google.com/maps/dir/?api=1&destination=28.426212,77.06642"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-sage-950 text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>Get Directions</span>
              <span>➔</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
