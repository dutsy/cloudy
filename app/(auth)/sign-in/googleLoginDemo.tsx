"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { AuthDemoPage } from "@/components/authDemoPage";

type GoogleLoginDemoProps = {
  user: User | null;
};

export default function GoogleLoginDemo({ user }: GoogleLoginDemoProps) {
  const supabase = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(user);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setCurrentUser(null);
  }

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [supabase])

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        skipBrowserRedirect: false,
      },
    });
  }

  return (<div>
    
      {!currentUser && (
        <>
          <section className="relative overflow-hidden rounded-[32px] border border-[#5a8dee]/40 bg-gradient-to-br from-[#050a16] via-[#08142b] to-[#0f2446] p-8 text-slate-100 shadow-[0_35px_90px_rgba(2,6,23,0.65)]">
            <div
              className="pointer-events-none absolute -right-6 -top-8 -z-10 h-24 w-24 rounded-full bg-[radial-gradient(circle,_rgba(66,133,244,0.25),_rgba(234,67,53,0.06))] blur-xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-2 right-10 -z-10 h-14 w-20 rounded-full bg-[radial-gradient(circle,_rgba(52,168,83,0.2),_transparent)] blur-lg"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -left-10 bottom-4 -z-10 h-20 w-32 rotate-12 rounded-full bg-[linear-gradient(120deg,_rgba(251,188,5,0.18),_rgba(66,133,244,0.12))] blur-lg"
              aria-hidden="true"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d1f3f] text-2xl font-semibold text-white shadow-lg shadow-blue-900/40 ring-2 ring-[#8ab4ff]/40">
                  G
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    OAuth
                  </p>
                  <h3 className="text-xl font-semibold text-white">
                    Continue with Google
                  </h3>
                </div>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#fbbc05] shadow-sm">
                No password storage
              </span>
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/40 transition hover:bg-[#1662c4]"
            >
              Continue with Google
            </button>
          </section>
        </>
      )}
      </div>
  );
}