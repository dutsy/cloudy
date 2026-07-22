import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import { CartProvider } from "@/components/shared/cart-context";
import { UserProvider } from "@/components/shared/user-context";
import "@/assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/react";

// 1. Import next-intl requirements
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL),
};

// 2. Make the layout async and accept params
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 3. Await the locale and fetch the correct JSON messages
  const { locale } = await params;
  const messages = await getMessages();

  // 4. Determine text direction (Right-to-Left for Arabic)
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    // 5. Inject dynamic lang and dir into the HTML tag
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        {/* 1. ThemeProvider goes on the OUTSIDE */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* 2. Translation Provider goes on the INSIDE */}
          <NextIntlClientProvider messages={messages}>
            <UserProvider>
              <CartProvider>
                {children}
                <Analytics />
                <Toaster position="top-center" richColors />
              </CartProvider>
            </UserProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
