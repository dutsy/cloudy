"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import ProductList from "@/components/shared/product/product-list";
import type { Product } from "@/types";

interface HomepageClientProps {
  initialProducts: Product[];
}

// Define categories outside so it doesn't trigger re-renders in hooks
const categories = [
  { id: "food", labelEn: "Food", labelAr: "مأكولات", icon: "🥐" },
  { id: "drinks", labelEn: "Drinks", labelAr: "مشروبات", icon: "☕" },
  { id: "smoke", labelEn: "Shisha", labelAr: "شيشة", icon: "💨" },
];

const HomepageClient = ({ initialProducts }: HomepageClientProps) => {
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [activeCategory, setActiveCategory] = useState("food");

  // --- NEW: Scroll Spy Effect ---
  useEffect(() => {
    // This observer watches the sections as you scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When a section enters the top portion of the screen, make it active
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      {
        // Adjust these margins based on your sticky header height!
        // -120px offsets the sticky header, -60% means it stops being active when it passes the middle
        rootMargin: "-120px 0px -60% 0px", 
      }
    );

    // Tell the observer to watch all our category sections
    categories.forEach((cat) => {
      const section = document.getElementById(cat.id);
      if (section) observer.observe(section);
    });

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);
  // ------------------------------

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-8 bg-background min-h-screen transition-colors duration-300">
      {/* Category Navigation Buttons */}
      <div className="flex justify-center gap-8 py-10 sticky top-0 bg-background/95 backdrop-blur z-10">
        {categories.map((cat) => {
          const displayLabel = isArabic ? cat.labelAr : cat.labelEn;

          return (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className="group flex flex-col items-center gap-3 cursor-pointer"
            >
              <span
                className={`text-sm font-bold tracking-wide transition-colors
                ${
                  activeCategory === cat.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {displayLabel.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>

      {/* List Section: Render ALL categories sequentially */}
      <div className="px-4 space-y-16 pb-20">
        {categories.map((cat) => {
          const categoryProducts = initialProducts.filter(
            (p) => p.category.toLowerCase() === cat.id && p.avaliable === true
          );

          if (categoryProducts.length === 0) return null;

          const displayLabel = isArabic ? cat.labelAr : cat.labelEn;

          return (
            <section key={cat.id} id={cat.id} className="scroll-mt-32">
              <ProductList data={categoryProducts} title={displayLabel} />
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default HomepageClient;