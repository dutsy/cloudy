"use client";

import { useLocale } from "next-intl";
// 1. Remove useRouter from the import
import { usePathname } from "next/navigation"; 
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const locale = useLocale();
  const pathname = usePathname();

  const switchLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";

    const segments = pathname.split("/");
    segments[1] = nextLocale;

    // 2. THE FIX: Delete router.replace and router.refresh.
    // Use the native browser window to force a hard reload of the new language URL.
    window.location.href = segments.join("/");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={switchLanguage}
      className="no-underline hover:no-underline"
    >
      {locale === "en" ? "AR" : "EN"}
    </Button>
  );
}