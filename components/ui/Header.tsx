"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { siteContent } from "@/lib/content";

const navLinks = [
  { label: "Home", href: "/#hero" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact Us", href: "/#contact" },
];

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Force static nav behavior on sub-pages like /gallery where the background is light
  const isStaticNav = pathname !== "/";

  // Transition header bg on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section for nav highlighting (only on home page)
  useEffect(() => {
    if (isStaticNav) {
      setActiveSection("gallery"); // Highlight Gallery link when on gallery subpage
      return;
    }

    const sectionIds = ["hero", "about", "services", "gallery", "contact"];
    const observers = sectionIds.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          rootMargin: "-20% 0px -60% 0px", // Trigger when section occupies the middle view
        }
      );
      observer.observe(element);
      return { observer, element };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.element);
      });
    };
  }, [isStaticNav]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = href.split("#")[1];
    const element = document.getElementById(targetId);
    if (element) {
      e.preventDefault();
      setMobileMenuOpen(false);
      
      const offset = 80; // height of sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      // Allow browser to route to target page anchor naturally
      setMobileMenuOpen(false);
    }
  };

  const showScrolledNavbar = isScrolled || isStaticNav;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 h-[80px] flex items-center ${
          showScrolledNavbar
            ? "glass-nav shadow-md shadow-sage-900/5 bg-sand-100/90"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center w-full">
          {/* Logo */}
          <a
            href="/#hero"
            onClick={(e) => handleNavClick(e, "/#hero")}
            className={`font-serif font-bold text-xl md:text-2xl tracking-widest transition-colors ${
              showScrolledNavbar ? "text-sage-950" : "text-white"
            }`}
          >
            {siteContent.logoText}
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.split("#")[1];
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-xs md:text-sm font-semibold uppercase tracking-wider transition-colors duration-300 relative py-1.5 ${
                    isActive
                      ? showScrolledNavbar
                        ? "text-sage-800"
                        : "text-gold-300"
                      : showScrolledNavbar
                      ? "text-sage-600 hover:text-sage-950"
                      : "text-sand-200 hover:text-white"
                  }`}
                >
                  {link.label}
                  {/* Subtle underline for active tab */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        showScrolledNavbar ? "bg-sage-700" : "bg-gold-400"
                      }`}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action Call Button */}
          <div className="hidden lg:block">
            <Button
              variant={showScrolledNavbar ? "primary" : "outline"}
              size="sm"
              onClick={() => {
                const element = document.getElementById("contact");
                if (element) {
                  window.scrollTo({
                    top: element.offsetTop - 80,
                    behavior: "smooth",
                  });
                } else {
                  // Direct to home page contact anchor
                  window.location.href = "/#contact";
                }
              }}
              className={
                !showScrolledNavbar
                  ? "border-sand-200/40 text-white hover:bg-white/10"
                  : ""
              }
            >
              <span>Book Trial</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Mobile Menu Toggler */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-full transition-colors ${
              showScrolledNavbar
                ? "bg-sage-50 text-sage-950 hover:bg-sage-100"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[80px] bg-sand-100 z-39 border-b border-sage-50/50 shadow-xl flex flex-col p-6 gap-6 lg:hidden max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.split("#")[1];
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`text-sm font-semibold uppercase tracking-wider py-2 border-b border-sage-50/50 ${
                      isActive ? "text-sage-800 font-bold pl-2 border-sage-200" : "text-sage-600 hover:text-sage-950"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                const element = document.getElementById("contact");
                if (element) {
                  window.scrollTo({
                    top: element.offsetTop - 80,
                    behavior: "smooth",
                  });
                } else {
                  window.location.href = "/#contact";
                }
              }}
              className="w-full mt-2"
            >
              <span>Book Trial</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
