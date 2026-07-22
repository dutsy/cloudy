"use client";

import { APP_NAME } from "@/lib/constants";
import { MapPin, Clock } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <footer className="border-t bg-card mt-auto border-muted">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-muted-foreground">
          
          {/* 1. Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start space-y-2">
            <h3 className="font-black text-lg text-foreground tracking-tight">
              {APP_NAME} {isArabic ? "كافيه" : "Coffee"}
            </h3>
            <p className="text-center md:text-start text-xs">
              © {currentYear} {APP_NAME}. {isArabic ? "جميع الحقوق محفوظة." : "All Rights Reserved."}
            </p>
          </div>

          {/* 2. Location & Hours */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                {isArabic 
                  ? "بيت لحم، منطقة القدس" 
                  : "Bethlehem, Jerusalem District"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                {isArabic 
                  ? "مفتوح يومياً: 7:00 صباحاً - 10:00 مساءً" 
                  : "Open Daily: 7:00 AM - 10:00 PM"}
              </span>
            </div>
          </div>

          {/* 3. Social Media Links */}
          <div className="flex flex-col items-center md:items-end space-y-3">
            <h4 className="font-bold text-foreground mb-1">
              {isArabic ? "تواصل معنا" : "Connect With Us"}
            </h4>
            <Link 
              href="https://www.instagram.com/cloudy1.ps?igsh=MTk3eGVwN2lhaHhxcQ==" 
              target="_blank" 
              className="flex items-center gap-2 hover:text-blue-600 transition-colors font-bold group"
            >
              <svg 
                className="w-5 h-5 group-hover:scale-110 transition-transform" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span dir="ltr">@Hookah & Cafe House</span>
            </Link>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;