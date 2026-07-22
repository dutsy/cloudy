"use client";

import { useState } from "react";
import { useLocale } from "next-intl"; // 1. Import the locale hook
import ProductList from "@/components/shared/product/product-list";
import type { Product } from "@/types";

interface HomepageClientProps {
  initialProducts: Product[];
}

const HomepageClient = ({ initialProducts }: HomepageClientProps) => {
  const locale = useLocale(); // 2. Get the current language
  const isArabic = locale === "ar"; 

  const [activeCategory, setActiveCategory] = useState("food");

  // 3. Add the Arabic translations to your categories array
  const categories = [
    { id: "food", labelEn: "Food", labelAr: "مأكولات", icon: "🥐" },
    { id: "drinks", labelEn: "Drinks", labelAr: "مشروبات", icon: "☕" },
    { id: "smoke", labelEn: "Shisha", labelAr: "شيشة", icon: "💨" },
  ];

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
          // 4. Figure out which label to show for the buttons
          const displayLabel = isArabic ? cat.labelAr : cat.labelEn;

          return (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className="group flex flex-col items-center gap-3"
            >
              <span
                className={`text-sm font-bold tracking-wide transition-colors
                ${activeCategory === cat.id ? "text-primary" : "text-muted-foreground"}`}
              >
                {/* toUpperCase won't affect Arabic text, but works perfectly for English */}
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

          // 5. Figure out which label to show for the section title
          const displayLabel = isArabic ? cat.labelAr : cat.labelEn;

          return (
            <section key={cat.id} id={cat.id} className="scroll-mt-32">
              <ProductList
                data={categoryProducts}
                title={displayLabel} // Pass the translated title here!
              />
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default HomepageClient;
















// "use client";

// import { useState } from "react";
// import ProductList from "@/components/shared/product/product-list";
// import type { Product } from "@/types";

// interface HomepageClientProps {
//   initialProducts: Product[];
// }


// const HomepageClient = ({ initialProducts }: HomepageClientProps) => {

//   const [activeCategory, setActiveCategory] = useState("food");

//   const categories = [
//     { id: "food", label: "Food", icon: "🥐" },
//     { id: "drinks", label: "Drinks", icon: "☕" },
//     { id: "smoke", label: "Shisha", icon: "💨" },
//   ];

//   // Filter based on the state
//   const filteredProducts = initialProducts.filter(
//     (p) => (p.category.toLowerCase() === activeCategory.toLowerCase() && p.avaliable == true )
//   );

//   return (
//     <div className="space-y-8 bg-background min-h-screen transition-colors duration-300">
//       {/* Circle Selectors */}
//       <div className="flex justify-center gap-8 py-10">
//         {categories.map((cat) => (
//           <button
//             key={cat.id}
//             onClick={() => setActiveCategory(cat.id)}
//             className="group flex flex-col items-center gap-3"
//           >
//             {/* <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all 
//                 ${activeCategory === cat.id 
//                   ? "border-primary bg-primary/10" 
//                   : "border-border bg-transparent"}`}>
//               <span className="text-2xl">{cat.icon}</span>
//             </div> */}
//             <span className={`text-sm font-bold tracking-wide transition-colors
//               ${activeCategory === cat.id ? "text-primary" : "text-muted-foreground"}`}
//             >
//               {cat.label.toUpperCase()}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* List Section */}
//       <div className="px-4 space-y-12">
//         <ProductList
//           data={filteredProducts}
//           title={`${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
//         />
        
//         {/* Featured is usually hardcoded to show specific items */}
//         {/* <ProductList
//           data={initialProducts.filter(p => p.is_featured)}
//           title="Featured Products"
//           limit={3}
//         /> */}
//       </div>
//     </div>
//   );
// };

// export default HomepageClient;