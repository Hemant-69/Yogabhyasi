import React from "react";
import Image from "next/image";
import { siteContent } from "@/lib/content";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21l1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
    </svg>
  );
}

interface FooterProps {
  siteSettings?: Record<string, string>;
}

export default function Footer({ siteSettings }: FooterProps) {
  const { aboutText, legalLinks, copyright } = siteContent.footer;

  return (
    <footer className="bg-sage-950 text-sand-200 border-t border-white/5 py-8 relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[150px] bg-gold-950/10 rounded-tl-full blur-3xl opacity-40 pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">

        {/* Main Row: Left = company info, Right = social + name */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* Left: Logo + tagline */}
          <div className="flex flex-col gap-1.5 max-w-sm">
        {/* Logo Text */}
        <div className="flex items-start">
          <Image
            src="/logo/light horizontal logo.png"
            alt="Yogabhyasi Logo"
            width={160}
            height={44}
            className="h-9 w-auto object-contain opacity-80"
          />
        </div>
            <p className="text-[11px] font-light text-sand-200/50 leading-relaxed">
              {aboutText}
            </p>
          </div>

          {/* Right: Connect with Us Icons with Names */}
          <div className="flex flex-col items-start md:items-end gap-2.5">
            <span className="text-[9px] uppercase tracking-widest text-sand-200/30 font-semibold">Connect with Us</span>
            <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/yog.abhyasi_"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
                aria-label="Instagram"
              >
                <div className="flex items-center justify-center p-1.5 rounded-full border border-white/10 bg-white/5 text-sand-200/70 group-hover:text-gold-400 group-hover:border-gold-400/30 group-hover:bg-gold-500/5 transition-all group-hover:scale-105">
                  <InstagramIcon className="h-3.5 w-3.5 transition-transform group-hover:rotate-6" />
                </div>
                <span className="text-[11px] font-light text-sand-200/50 group-hover:text-gold-400 transition-colors tracking-wide">
                  Instagram
                </span>
              </a>

              {/* Telegram */}
              <a
                href="https://t.me/yogabhyasi12"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
                aria-label="Telegram"
              >
                <div className="flex items-center justify-center p-1.5 rounded-full border border-white/10 bg-white/5 text-sand-200/70 group-hover:text-gold-400 group-hover:border-gold-400/30 group-hover:bg-gold-500/5 transition-all group-hover:scale-105">
                  <TelegramIcon className="h-3.5 w-3.5 transition-transform group-hover:rotate-6" />
                </div>
                <span className="text-[11px] font-light text-sand-200/50 group-hover:text-gold-400 transition-colors tracking-wide">
                  Telegram
                </span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919717996507"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 group"
                aria-label="WhatsApp"
              >
                <div className="flex items-center justify-center p-1.5 rounded-full border border-white/10 bg-white/5 text-sand-200/70 group-hover:text-gold-400 group-hover:border-gold-400/30 group-hover:bg-gold-500/5 transition-all group-hover:scale-105">
                  <WhatsAppIcon className="h-3.5 w-3.5 transition-transform group-hover:rotate-6" />
                </div>
                <span className="text-[11px] font-light text-sand-200/50 group-hover:text-gold-400 transition-colors tracking-wide">
                  WhatsApp
                </span>
              </a>
            </div>
          </div>

        </div>

        {/* Slim Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-white/5 via-gold-500/10 to-transparent my-5" />

        {/* Bottom Bar: copyright left, legal links right */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[9px] font-light text-sand-200/30">
          <span>{copyright}</span>
          <div className="flex gap-5">
            {legalLinks.map((link, idx) => (
              <a key={idx} href={link.href} className="hover:text-gold-400 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
