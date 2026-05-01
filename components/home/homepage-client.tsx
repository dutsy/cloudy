"use client";

import { useState } from "react";
import ProductList from "@/components/shared/product/product-list";
import { useCart } from "@/components/shared/cart-context"; // Import the hook

interface Product {
  id: string;
  name: string;
  category: string;
  // add other fields as needed
}

const HomepageClient = ({ initialProducts }: { initialProducts: any[] }) => {

  const { items, totalPrice, itemCount, clearCart } = useCart();

  console.log(items.map(item => item.name)+ '\n' + totalPrice + '\n' + itemCount); // here the local storage data do not duplicate items, so i have to check it by quanqtity, but it works fine, and the total price is correct as well, so i will just leave it like this for now, and maybe add a feature to update quantity in the future if i have time

  const [activeCategory, setActiveCategory] = useState("food");

  const categories = [
    { id: "food", label: "Food", icon: "🥐" },
    { id: "drinks", label: "Drinks", icon: "☕" },
    { id: "smoke", label: "Smoke", icon: "💨" },
  ];

  // Filter based on the state
  const filteredProducts = initialProducts.filter(
    (p) => (p.category.toLowerCase() === activeCategory.toLowerCase() && p.avaliable == true )
  );

  return (
    <div className="space-y-8 bg-background min-h-screen transition-colors duration-300">
      {/* Circle Selectors */}
      <div className="flex justify-center gap-8 py-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="group flex flex-col items-center gap-3"
          >
            {/* <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all 
                ${activeCategory === cat.id 
                  ? "border-primary bg-primary/10" 
                  : "border-border bg-transparent"}`}>
              <span className="text-2xl">{cat.icon}</span>
            </div> */}
            <span className={`text-sm font-bold tracking-wide transition-colors
              ${activeCategory === cat.id ? "text-primary" : "text-muted-foreground"}`}
            >
              {cat.label.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* List Section */}
      <div className="px-4 space-y-12">
        <ProductList
          data={filteredProducts}
          title={`${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
        />
        
        {/* Featured is usually hardcoded to show specific items */}
        {/* <ProductList
          data={initialProducts.filter(p => p.is_featured)}
          title="Featured Products"
          limit={3}
        /> */}
      </div>
    </div>
  );
};

export default HomepageClient;