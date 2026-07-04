import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
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

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.54 12 3.54 12 3.54s-7.52 0-9.388.515a3.004 3.004 0 0 0-2.11 2.108C0 8.03 0 12 0 12s0 3.97.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.46 12 20.46 12 20.46s7.52 0 9.388-.515a3.003 3.003 0 0 0 2.11-2.108C24 15.97 24 12 24 12s0-3.97-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function Footer() {
  const { aboutText, quickLinks, legalLinks, copyright } = siteContent.footer;
  const { info, socials } = siteContent.contact;

  return (
    <footer className="bg-sage-950 text-sand-200 border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gold-950/10 rounded-full blur-3xl -z-1" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 mb-12">
          
          {/* Column 1: Studio About */}
          <div className="flex flex-col gap-5">
            <h3 className="font-serif font-bold text-2xl tracking-wider text-sand-50">
              {siteContent.logoText}
            </h3>
            <p className="text-xs md:text-sm font-light text-sand-200/70 leading-relaxed max-w-sm">
              {aboutText}
            </p>
            {/* Social channels */}
            <div className="flex gap-4.5 mt-2">
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand-200/60 hover:text-gold-400 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand-200/60 hover:text-gold-400 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href={socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sand-200/60 hover:text-gold-400 transition-colors"
                aria-label="Youtube"
              >
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>


          {/* Column 2: Navigation Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-bold text-lg text-sand-50">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs md:text-sm font-light text-sand-200/80">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="hover:text-gold-400 transition-colors py-0.5 inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact details summary */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-bold text-lg text-sand-50">Get in Touch</h4>
            <ul className="flex flex-col gap-3 text-xs md:text-sm font-light text-sand-200/80">
              <li className="flex gap-2.5 items-start">
                <MapPin className="h-4.5 w-4.5 text-gold-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{info.address}</span>
              </li>
              <li className="flex gap-2.5 items-center">
                <Phone className="h-4.5 w-4.5 text-gold-500 flex-shrink-0" />
                <a href={`tel:${info.phoneRaw}`} className="hover:text-gold-400 transition-colors">
                  {info.phone}
                </a>
              </li>
              <li className="flex gap-2.5 items-center">
                <Mail className="h-4.5 w-4.5 text-gold-500 flex-shrink-0" />
                <a href={`mailto:${info.email}`} className="hover:text-gold-400 transition-colors break-all">
                  {info.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Hours summary */}
          <div className="flex flex-col gap-4">
            <h4 className="font-serif font-bold text-lg text-sand-50">Hours of Practice</h4>
            <div className="flex flex-col gap-2 text-xs md:text-sm font-light text-sand-200/80">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-sand-200/50 font-semibold mb-0.5">Weekdays</span>
                <span className="text-sand-100">{info.workingHours.weekdays}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-sand-200/50 font-semibold mb-0.5">Saturdays</span>
                <span className="text-sand-100">{info.workingHours.saturdays}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-sand-200/50 font-semibold mb-0.5">Sundays</span>
                <span className="text-sand-100">{info.workingHours.sundays}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-sand-200/50">
          <span>{copyright}</span>
          <div className="flex gap-6">
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
