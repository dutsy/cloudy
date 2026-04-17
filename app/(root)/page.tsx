"use client";

import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/product/product-list";
import { supabase } from "@/lib/supabase";
import {  useState } from "react";

// export const metadata = {
//   title: "Home",
// };


const Homepage = () => {

  const [activeCategory, setActiveCategory] = useState("food");

  const categories = [
    { id: "food", label: "Food", icon: "🥐" },
    { id: "drinks", label: "Drinks", icon: "☕" },
    { id: "smoke", label: "Smoke", icon: "💨" },
  ];

  const filteredProducts = sampleData.products.filter(
    (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
  );
  
  return <div>

    <>
    <div className="space-y-8 bg-white dark:bg-black min-h-screen transition-colors duration-300">
      {/* Circle Selectors */}
      <div className="flex justify-center gap-8 py-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="group flex flex-col items-center gap-3"
          >
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full border-2 text-3xl transition-all duration-300
                ${activeCategory === cat.id 
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-110" 
                  : "border-gray-200 dark:border-gray-800 bg-transparent group-hover:border-gray-400 dark:group-hover:border-gray-600"
                }`}
            >
              {cat.icon}
            </div>
            <span className={`text-sm font-bold tracking-wide transition-colors
              ${activeCategory === cat.id 
                ? "text-orange-600 dark:text-orange-400" 
                : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {cat.label.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* List Section */}
      <div className="px-4">
        <ProductList 
          data={filteredProducts} 
          title={`${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`} 
        />
        <ProductList data={sampleData.products} title="Featured Products" limit={2} />
      </div>
    </div>
    </>

  </div>;
}
 
export default Homepage;



// const setNewView = async () => {
//     const { data, error } = await supabase.from("views").insert({name:"fuck"})
//     if(data) console.log("New view added:", data)
//       if (error) console.error("Error adding view:", error);
//   };
//   setNewView();