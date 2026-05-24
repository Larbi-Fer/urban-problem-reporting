"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-context";
import SectionWrapper from "./section-wrapper";
import { Camera, Send, Search, Sparkles } from "lucide-react";
import Image from "next/image";

const stepIcons = [Camera, Send, Search, Sparkles];

const stepColors = [
  { bg: "bg-[#007A33]/10", text: "text-[#007A33]", border: "border-[#007A33]/20" },
  { bg: "bg-[#00A651]/10", text: "text-[#00A651]", border: "border-[#00A651]/20" },
  { bg: "bg-[#F59E0B]/10", text: "text-[#F59E0B]", border: "border-[#F59E0B]/20" },
  { bg: "bg-[#3B82F6]/10", text: "text-[#3B82F6]", border: "border-[#3B82F6]/20" },
];

export default function Timeline() {
  const { t, language } = useLanguage();

  return (
    <SectionWrapper
      id="features"
      className="py-20 sm:py-28 bg-[#F5F5F2] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#007A33]/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] mb-4">
            {t.timeline.title}
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            {t.timeline.subtitle}
          </p>
        </motion.div>

        {/* Desktop Timeline with Phone Mockup */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Timeline steps column */}
          <div className="lg:col-span-7 relative">
            {/* Vertical Connection line */}
            <div className="absolute top-8 bottom-8 left-[40px] rtl:left-auto rtl:right-[40px] w-[3px] z-0">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                className="h-full w-full bg-linear-to-b from-[#007A33] via-[#00A651] to-[#3B82F6] origin-top rounded-full"
              />
            </div>

            <div className="space-y-10 relative z-10">
              {t.timeline.steps.map((step, index) => {
                const Icon = stepIcons[index];
                const color = stepColors[index];

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: language === "ar" ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="flex items-start gap-6 group"
                  >
                    {/* Circle icon with higher z-index to stay above the line */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`relative z-10 flexshrink-0 w-20 h-20 rounded-2xl ${color.bg} border-2 ${color.border} bg-white flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300`}
                    >
                      <Icon size={32} className={color.text} strokeWidth={1.5} />
                      <span
                        className={`absolute -top-2 -right-2 rtl:-left-2 rtl:right-auto w-7 h-7 rounded-full bg-white border-2 ${color.border} flex items-center justify-center text-xs font-bold ${color.text} z-20 shadow-sm`}
                      >
                        {index + 1}
                      </span>
                    </motion.div>

                    <div className="pt-2">
                      <h3 className="text-xl font-bold text-[#111827] mb-2 group-hover:text-[#007A33] transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-base text-[#6B7280] leading-relaxed max-w-xl">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Premium Phone Mockup Column (Only on lg screens) */}
          <div className="hidden lg:flex lg:col-span-5 justify-center">
            <div className="relative">
              {/* Glow behind phone */}
              <div className="absolute inset-0 bg-linear-to-br from-[#007A33]/15 to-[#3B82F6]/15 rounded-[3rem] blur-[50px] scale-110 animate-pulse" />

              {/* Phone container with 3D transform */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{
                  duration: 6,
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
                    transform: "rotateY(12deg) rotateX(5deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Phone frame */}
                  <div className="relative w-[300px] rounded-[2.5rem] overflow-hidden bg-[#111827] p-2 shadow-2xl shadow-black/35">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#111827] rounded-b-2xl z-20" />

                    {/* Screen */}
                    <div className="relative rounded-[2rem] overflow-hidden bg-white">
                      <Image
                        src="/main/create-report.jpg"
                        alt="Inchighalati Create Report"
                        width={300}
                        height={640}
                        className="w-full h-auto object-cover"
                        priority
                      />

                      {/* Glass reflection overlay */}
                      <div className="absolute inset-0 bg-linear-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute inset-0 bg-linear-to-tl from-white/10 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Side shadow for 3D depth */}
                  <div className="absolute -left-2 top-4 bottom-4 w-3 bg-linear-to-l from-[#1a1a2e] to-transparent rounded-l-lg opacity-40" />
                </div>
              </motion.div>

              {/* Shadow beneath phone */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[60%] h-6 bg-black/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
