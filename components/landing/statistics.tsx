"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { useLanguage } from "@/lib/language-context";
import SectionWrapper from "./section-wrapper";
import { FileText, CheckCircle2, Users, MapPin } from "lucide-react";

const stats = [
  {
    icon: FileText,
    value: 1248,
    labelKey: "reports" as const,
    color: "text-[#007A33]",
    bgColor: "bg-[#007A33]/10",
  },
  {
    icon: CheckCircle2,
    value: 843,
    labelKey: "resolved" as const,
    color: "text-[#00A651]",
    bgColor: "bg-[#00A651]/10",
  },
  {
    icon: Users,
    value: 520,
    labelKey: "activeUsers" as const,
    color: "text-[#F59E0B]",
    bgColor: "bg-[#F59E0B]/10",
  },
  {
    icon: MapPin,
    value: 1,
    labelKey: "cities" as const,
    color: "text-[#3B82F6]",
    bgColor: "bg-[#3B82F6]/10",
  },
];

function AnimatedCounter({
  target,
  inView,
}: {
  target: number;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, target]);

  return <span>{count.toLocaleString()}</span>;
}

export default function Statistics() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <SectionWrapper className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#00A651]/5 rounded-full blur-[100px]" />

      <div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        ref={ref}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] mb-4">
            {t.statistics.title}
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            {t.statistics.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative group bg-white rounded-2xl border border-[#E5E7EB] p-6 sm:p-8 text-center shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {/* Gradient border on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#007A33]/10 to-[#00A651]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />

                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${stat.bgColor} mb-4`}
                >
                  <Icon size={28} className={stat.color} strokeWidth={1.5} />
                </div>

                <div
                  className={`text-3xl sm:text-4xl font-bold ${stat.color} mb-2`}
                >
                  <AnimatedCounter target={stat.value} inView={inView} />
                </div>

                <p className="text-sm sm:text-base text-[#6B7280] font-medium">
                  {t.statistics[stat.labelKey]}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
