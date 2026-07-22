"use client";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl"; // 1. Import locale hook
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react"; // 2. Import ArrowLeft for Arabic
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


// 1. We extract the main content into a separate component so we can wrap it in Suspense
function WelcomeContent() {
  const searchParams = useSearchParams();

  // 3. Setup translations
  const locale = useLocale();
  const isArabic = locale === "ar";

  // Grab the parameters from the URL
  const orderNumber = searchParams.get("order");
  const name = searchParams.get("name");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Greeny Icon Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full" />

        <div className="relative h-36 w-36 bg-blue-50/50 dark:bg-emerald-950/30 rounded-[48px] flex items-center justify-center text-blue-600 dark:text-emerald-400 shadow-2xl overflow-hidden">
          <Image
            src="/images/logo.svg"
            alt="Cloudy Logo"
            width={100}
            height={100}
            priority={true}
            className="object-contain"
          />

          <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
            <CheckCircle2 size={32} className="fill-emerald-500 text-white" />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-4">
        <h1 className="text-4xl font-black">
          {isArabic ? "طلب " : "Order "}
          <span className="text-blue-600">
            #{orderNumber || (isArabic ? "مؤكد" : "Confirmed")}
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
          {isArabic ? "شكراً لك، " : "Thank you, "}
          <span className="font-semibold text-foreground">
            {name || (isArabic ? "ضيف" : "Guest")}
          </span>
          {isArabic ? "! جاري تجهيز طلبك." : "! Your order is being prepared."}
        </p>
      </div>

      {/* Button with RTL-aware Icon and Animations */}
      <div className="pt-4">
        <Button
          asChild
          size="lg"
          className="rounded-full bg-blue-900 hover:bg-blue-950 dark:bg-blue-600 dark:hover:bg-blue-900 text-white px-10 py-7 text-xl font-bold shadow-[0_10px_40px_rgba(30,58,138,0.3)] transition-all hover:scale-105 active:scale-95 group"
        >
          <Link href="/">
            {isArabic ? "الصفحة الرئيسية" : "Main Page"}
            {isArabic ? (
              // Arabic Arrow: Points left, margin right, moves left on hover
              <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            ) : (
              // English Arrow: Points right, margin left, moves right on hover
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
}

// 2. Next.js requires useSearchParams to be wrapped in a Suspense boundary for production builds
export default function WelcomePage() {
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          {isArabic ? "جاري التحميل..." : "Loading..."}
        </div>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}
