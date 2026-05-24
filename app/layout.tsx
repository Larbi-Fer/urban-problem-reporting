import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Public_Sans } from "next/font/google";
import "./globals.css";
import './animations.css'
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const publicSansHeading = Public_Sans({ subsets: ['latin'], variable: '--font-heading' });

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "إنشغالاتي | منصة التبليغ عن المشاكل الحضرية وتحسين المدينة",
  description: "إنشغالاتي هي منصة ذكية تتيح للمواطنين الإبلاغ عن مشاكل الطرق، الإنارة، النفايات والبنية التحتية بسهولة عبر الهاتف أو الويب، للمساهمة في تحسين المدن وتعزيز التواصل مع الجهات المعنية.",
  keywords: ["إنشغالاتي", "التبليغ عن المشاكل الحضرية", "تحسين المدينة", "منصة ذكية", "المواطنين", "المشاكل الحضرية", "الطرق", "الإنارة", "النفايات", "البنية التحتية", "الويب", "الجهات المعنية", "المدن", "المساهمة", "التبليغ", "المشاكل"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, publicSansHeading.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
