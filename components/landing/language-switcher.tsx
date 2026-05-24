"use client";

import { useLanguage } from "@/lib/language-context";
import { Language } from "@/lib/translations";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full border border-[#E5E7EB] bg-white/80 backdrop-blur-sm p-0.5">
      <button
        onClick={() => setLanguage("ar" as Language)}
        className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
          language === "ar"
            ? "bg-[#007A33] text-white shadow-md"
            : "text-[#6B7280] hover:text-[#111827]"
        }`}
        aria-label="Switch to Arabic"
      >
        العربية
      </button>
      <button
        onClick={() => setLanguage("fr" as Language)}
        className={`relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
          language === "fr"
            ? "bg-[#007A33] text-white shadow-md"
            : "text-[#6B7280] hover:text-[#111827]"
        }`}
        aria-label="Switch to French"
      >
        Français
      </button>
    </div>
  );
}
