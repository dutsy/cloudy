"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// 1. We extract the main content into a separate component so we can wrap it in Suspense
function WelcomeContent() {
  const searchParams = useSearchParams();
  
  // Grab the parameters from the URL
  const orderNumber = searchParams.get('order');
  const name = searchParams.get('name');

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Greeny Icon Section */}
      <div className="relative">
        {/* Glow effect using Emerald */}
        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
        
        <div className="relative h-28 w-28 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-500/30 rounded-[40px] flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-2xl">
          {/* Small checkmark badge */}
          <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1">
            <CheckCircle2 size={28} className="fill-emerald-500 text-white" />
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-4">
        <h1 className="text-4xl font-black">
            Order <span className="text-emerald-600">#{orderNumber || "Confirmed"}</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
           Thank you, <span className="font-semibold text-foreground">{name || "Guest"}</span>! Your order is being prepared.
        </p>
      </div>

      {/* Button synced with Tailwind 'primary' but with a Green twist */}
      <div className="pt-4">
        <Button 
          asChild 
          size="lg" 
          className="rounded-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-10 py-7 text-xl font-bold shadow-[0_10px_40px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 group"
        >
          <Link href="/">
            Main Page
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

// 2. Next.js requires useSearchParams to be wrapped in a Suspense boundary for production builds
export default function WelcomePage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center">Loading...</div>}>
      <WelcomeContent />
    </Suspense>
  );
}