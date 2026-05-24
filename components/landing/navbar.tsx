"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "@/lib/language-context";
import LanguageSwitcher from "./language-switcher";
import { Menu, X, Download } from "lucide-react";

const navLinks = [
  { key: "home", href: "#home" },
  { key: "features", href: "#features" },
  { key: "faq", href: "#faq" },
  { key: "contact", href: "#contact" },
] as const;

export default function Navbar() {
  const { t, language } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/50 backdrop-blur-xl shadow-lg shadow-black/3 border-b border-[#E5E7EB]/50"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between md:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("#home")}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#007A33] to-[#00A651] flex items-center justify-center shadow-lg shadow-[#007A33]/20 group-hover:shadow-[#007A33]/40 transition-shadow duration-300">
              <span className="text-white font-bold text-sm">إ</span>
            </div>
            <span className="text-lg font-bold text-[#111827] tracking-tight">
              {language === "ar" ? "إنشغالاتي" : "Inchighalati"}
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm font-medium text-[#6B7280] hover:text-[#007A33] transition-colors duration-200 rounded-lg hover:bg-[#007A33]/5 cursor-pointer"
              >
                {t.nav[link.key as keyof typeof t.nav]}
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <button
              onClick={() => handleNavClick("#download-app")}
              className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-[#007A33] to-[#00A651] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#007A33]/25 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <Download size={16} />
              {t.nav.getApp}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[#111827] rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-[#E5E7EB]/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-start px-4 py-3 text-sm font-medium text-[#6B7280] hover:text-[#007A33] hover:bg-[#007A33]/5 rounded-xl transition-colors cursor-pointer"
                >
                  {t.nav[link.key as keyof typeof t.nav]}
                </button>
              ))}
              <button
                onClick={() => handleNavClick("#download-app")}
                className="flex items-center justify-center gap-2 w-full mt-3 px-5 py-3 bg-linear-to-r from-[#007A33] to-[#00A651] text-white text-sm font-semibold rounded-xl cursor-pointer"
              >
                <Download size={16} />
                {t.nav.getApp}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
