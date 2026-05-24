"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-context";
import SectionWrapper from "./section-wrapper";
import { Download, Send } from "lucide-react";

export default function FinalCTA() {
  const { t } = useLanguage();

  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <SectionWrapper className="py-20 sm:py-28 relative overflow-hidden">
      {/* Dark green gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#004d20] via-[#007A33] to-[#00A651]" />

      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00A651]/20 rounded-full blur-[200px]" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#F59E0B]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#007A33]/30 rounded-full blur-[100px]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" id="contact">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          {/* Decorative element */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm"
          >
            <span className="text-2xl">🏙️</span>
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {t.cta.headline}
          </h2>

          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleScrollTo("#download-app")}
              className="flex items-center gap-2 px-8 py-4 bg-white text-[#007A33] font-bold rounded-2xl shadow-2xl shadow-black/20 hover:shadow-3xl transition-all duration-300 min-w-[200px] justify-center cursor-pointer"
            >
              <Download size={20} />
              {t.cta.downloadApp}
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              href="#download-app"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 min-w-[200px] justify-center"
            >
              <Send size={20} />
              {t.cta.sendReport}
            </motion.a>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
