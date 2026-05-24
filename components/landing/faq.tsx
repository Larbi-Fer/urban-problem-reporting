"use client";

import { motion } from "motion/react";
import { useLanguage } from "@/lib/language-context";
import SectionWrapper from "./section-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
  const { t } = useLanguage();

  return (
    <SectionWrapper
      id="faq"
      className="py-20 sm:py-28 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#007A33]/5 rounded-full blur-[100px]" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#007A33]/10 border border-[#007A33]/20 mb-6">
            <HelpCircle size={16} className="text-[#007A33]" />
            <span className="text-sm font-medium text-[#007A33]">FAQ</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] mb-4">
            {t.faq.title}
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto">
            {t.faq.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {t.faq.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border border-[#E5E7EB] rounded-2xl px-6 data-[state=open]:shadow-lg data-[state=open]:border-[#007A33]/20 transition-all duration-300 overflow-hidden"
                >
                  <AccordionTrigger className="text-[#111827] font-semibold text-base sm:text-lg py-5 hover:no-underline hover:text-[#007A33] transition-colors cursor-pointer">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#6B7280] text-base leading-relaxed pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
