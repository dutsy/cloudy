"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Coffee, ArrowRight, Leaf } from "lucide-react"; // Added Leaf for the organic vibe
import { Button } from "@/components/ui/button";

type Mode = "signup" | "signin";

export default function SignInPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) router.push("/profile");
    };
    checkUser();
  }, [supabase, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setStatus("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/welcome`,
          },
        });
        if (error) throw error;
        setStatus(
          "Verification link sent! Please check your inbox to activate your account.",
        );
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          setStatus("Success! Entering Cloudy...");
          router.push("/");
        }
      }
    } catch (error: any) {
      setStatus(
        error.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setIsLoading(true); // Start the loading state immediately
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          // Ensures the browser follows the link properly
          skipBrowserRedirect: false,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setStatus(error.message);
      setIsLoading(false); // Only turn off if there's an error
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-8">
        {/* BRAND SECTION - Updated to Emerald */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-16 w-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
            <Leaf size={36} strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Cloudy</h1>
            <p className="text-sm text-emerald-600/60 dark:text-emerald-400/60 font-medium uppercase tracking-widest text-muted-foreground">
              Freshly Brewed Community
            </p>
          </div>
        </div>

        {/* AUTH CARD - Updated to Emerald accents */}
        <div className="bg-card border border-border/50 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Glow - Updated to Emerald */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[80px] pointer-events-none" />

          {/* MODE TOGGLE */}
          <div className="flex bg-muted/50 p-1 rounded-full mb-8">
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 text-xs font-bold rounded-full transition-all ${
                  mode === m
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "signin" ? "SIGN IN" : "REGISTER"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-4">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@cloudy.com"
                className="w-full bg-muted/30 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-4">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-muted/30 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              />
            </div>

            {/* BUTTON - Updated to Emerald */}
            <Button
              disabled={isLoading}
              className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20 transition-all mt-4 group"
            >
              {isLoading ? (
                "Brewing..."
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {mode === "signin" ? "Welcome Back" : "Create Account"}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              )}
            </Button>
          </form>

          {status && (
            <p className="mt-4 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in slide-in-from-bottom-1">
              {status}
            </p>
          )}
        </div>

        {/* SOCIAL LOGIN */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-muted-foreground/30">
            <div className="h-[1px] flex-1 bg-current" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              OR
            </span>
            <div className="h-[1px] flex-1 bg-current" />
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={handleGoogleLogin}
            className="w-full h-12 rounded-2xl border border-border bg-card flex items-center justify-center gap-3 
             transition-all duration-150 ease-in-out
             active:scale-[0.96] active:bg-muted
             hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed
             group relative overflow-hidden"
          >
            {isLoading ? (
              // Show this when clicked
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium animate-pulse">
                  Connecting...
                </span>
              </div>
            ) : (
              // Show this normally
              <>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white ring-1 ring-border shadow-sm">
                  <span className="text-[12px] font-black text-[#4285F4]">
                    G
                  </span>
                </div>
                <span className="text-sm font-semibold">
                  Continue with Google
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
