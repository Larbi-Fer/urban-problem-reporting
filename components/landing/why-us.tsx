"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-context";
import SectionWrapper from "./section-wrapper";
import { Zap, Users, Building2, MessageCircle } from "lucide-react";

const cardIcons = [Zap, Users, Building2, MessageCircle];

const cardGradients = [
  "from-[#007A33] to-[#00A651]",
  "from-[#00A651] to-[#34D399]",
  "from-[#F59E0B] to-[#FBBF24]",
  "from-[#3B82F6] to-[#60A5FA]",
];

export default function WhyUs() {
  const { t } = useLanguage();

  return (
    <SectionWrapper className="py-20 sm:py-28 bg-[#F5F5F2] relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#007A33]/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] mb-4">
            {t.whyUs.title}
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            {t.whyUs.subtitle}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.whyUs.cards.map((card, index) => {
            const Icon = cardIcons[index];
            const gradient = cardGradients[index];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Gradient border effect */}
                <div
                  className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]`}
                />

                <div className="relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                  >
                    <Icon size={28} className="text-white" strokeWidth={1.5} />
                  </div>

                  <h3 className="text-xl font-bold text-[#111827] mb-3">
                    {card.title}
                  </h3>
                  <p className="text-[#6B7280] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
