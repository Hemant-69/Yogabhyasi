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
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const { badge, title, subtitle, info } = siteContent.contact;
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

            {/* Operating Hours Block */}
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gold-400" />
                <h4 className="font-serif font-bold text-lg text-sand-50">Hours of Practice</h4>
              </div>
              <div className="grid grid-cols-1 gap-2 text-xs text-sand-200/80 font-light">
                <div className="flex justify-between">
                  <span>Mon - Fri</span>
                  <span className="font-medium text-sand-100">{info.workingHours.weekdays}</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium text-sand-100">{info.workingHours.saturdays}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium text-sand-100">{info.workingHours.sundays}</span>
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

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
      </div>
    </section>
  );
}
