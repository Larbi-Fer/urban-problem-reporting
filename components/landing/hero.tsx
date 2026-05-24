"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-context";
import { ArrowDown, Download } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  const { t, language } = useLanguage();

  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5F2] via-white to-[#e8f5e9]" />

      {/* Mesh gradient blobs */}
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#007A33]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-[#00A651]/8 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#007A33]/5 rounded-full blur-[150px]" />

      {/* Floating shapes */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 right-[20%] w-16 h-16 border-2 border-[#007A33]/15 rounded-2xl hidden lg:block"
      />
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 left-[15%] w-12 h-12 bg-[#00A651]/10 rounded-full hidden lg:block"
      />
      <motion.div
        animate={{ y: [-5, 15, -5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[60%] right-[10%] w-8 h-8 bg-[#F59E0B]/15 rounded-lg hidden lg:block"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`space-y-8 ${language === "ar" ? "lg:order-2" : "lg:order-1"}`}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#007A33]/10 border border-[#007A33]/20"
            >
              <span className="w-2 h-2 rounded-full bg-[#00A651] animate-pulse" />
              <span className="text-sm font-medium text-[#007A33]">
                {language === "ar"
                  ? "منصة مدنية ذكية"
                  : "Plateforme civique intelligente"}
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111827] leading-tight">
              {t.hero.headline}
              <span className="block mt-2 bg-gradient-to-r from-[#007A33] to-[#00A651] bg-clip-text text-transparent">
                {language === "ar" ? "إنشغالاتي" : "Inchighalati"}
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#6B7280] leading-relaxed max-w-xl">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleScrollTo("#features")}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#007A33] to-[#00A651] text-white font-semibold rounded-2xl shadow-xl shadow-[#007A33]/25 hover:shadow-2xl hover:shadow-[#007A33]/30 transition-all duration-300 cursor-pointer"
              >
                {t.hero.cta}
                <ArrowDown size={18} className="animate-bounce" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleScrollTo("#download-app")}
                className="flex items-center gap-2 px-8 py-4 bg-white text-[#007A33] font-semibold rounded-2xl border-2 border-[#007A33]/20 hover:border-[#007A33]/40 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <Download size={18} />
                {t.hero.download}
              </motion.button>
            </div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  {[
                    "bg-[#007A33]",
                    "bg-[#00A651]",
                    "bg-[#F59E0B]",
                    "bg-[#3B82F6]",
                  ].map((bg, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-[#6B7280]">
                  {language === "ar"
                    ? "+520 مستخدم نشط"
                    : "+520 utilisateurs actifs"}
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: language === "ar" ? -40 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`relative flex justify-center ${language === "ar" ? "lg:order-1" : "lg:order-2"}`}
          >
            <div className="relative">
              {/* Glow behind phone */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#007A33]/20 to-[#00A651]/20 rounded-[3rem] blur-[60px] scale-110" />

              {/* Phone container with 3D transform */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
                style={{
                  perspective: "1000px",
                }}
              >
                <div
                  className="relative"
                  style={{
                    transform: "rotateY(-12deg) rotateX(5deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Phone frame */}
                  <div className="relative w-[280px] sm:w-[300px] lg:w-[320px] rounded-[2.5rem] overflow-hidden bg-[#111827] p-2 shadow-2xl shadow-black/30">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#111827] rounded-b-2xl z-20" />

                    {/* Screen */}
                    <div className="relative rounded-[2rem] overflow-hidden bg-white">
                      <Image
                        src="/main/auth.jpg"
                        alt="Inchighalati App"
                        width={320}
                        height={680}
                        className="w-full h-auto object-cover"
                        style={{
                          backgroundAttachment: "fixed"
                        }}
                        priority
                      />

                      {/* Glass reflection overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-gradient-to-tl from-white/10 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Side shadow for 3D depth */}
                  <div className="absolute -right-2 top-4 bottom-4 w-3 bg-gradient-to-r from-[#1a1a2e] to-transparent rounded-r-lg opacity-40" />
                </div>
              </motion.div>

              {/* Shadow beneath phone */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[60%] h-6 bg-black/10 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path
            d="M0,40 C360,60 720,0 1440,40 L1440,60 L0,60 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
