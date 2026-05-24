"use client";

import { LanguageProvider } from "@/lib/language-context";
import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import AppDownload from "@/components/landing/app-download";
import Timeline from "@/components/landing/timeline";
import Statistics from "@/components/landing/statistics";
import WhyUs from "@/components/landing/why-us";
import FAQ from "@/components/landing/faq";
import FinalCTA from "@/components/landing/final-cta";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-white scroll-smooth overflow-x-hidden">
        <Navbar />
        <Hero />
        <AppDownload />
        <Timeline />
        <Statistics />
        <WhyUs />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
