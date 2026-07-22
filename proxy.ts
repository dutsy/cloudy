import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "./lib/supabase/server-client";
import createMiddleware from "next-intl/middleware";

// 1. Initialize the next-intl routing logic
const handleI18nRouting = createMiddleware({
  locales: ["en", "ar"],
  defaultLocale: "en",
});

export async function proxy(request: NextRequest) {
  // 2. Generate the response using next-intl instead of NextResponse.next()
  // This automatically handles the URL redirects and sets the language cookie
  const response = handleI18nRouting(request);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Update the path check to account for the new locale prefixes 
  // (e.g., checking for both "/protected" and "/en/protected" or "/ar/protected")
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith("/protected") || 
    /^\/(en|ar)\/protected/.test(request.nextUrl.pathname);

  // Redirect non-authenticated users away from protected routes
  if (!user && isProtectedRoute) {
    // We can redirect to standard "/login". The next-intl middleware will 
    // catch this on the next cycle and automatically forward them to "/en/login"
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return response;
}

// 4. IMPORTANT: Add the config matcher so the proxy ignores static files and APIs
export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};