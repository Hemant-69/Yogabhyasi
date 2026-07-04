import React from "react";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Gallery from "@/components/sections/Gallery";
import VideoSection from "@/components/sections/VideoSection";
import Team from "@/components/sections/Team";
import ContactForm from "@/components/sections/ContactForm";
import Footer from "@/components/sections/Footer";

export default function OnePageHome() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Gallery />
      <VideoSection />
      <Team />
      <ContactForm />
      <Footer />
    </>
  );
}
