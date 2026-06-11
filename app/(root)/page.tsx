import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import HomepageClient from "@/components/home/homepage-client";

// ✅ Metadata is now allowed because this is a Server Component
export const metadata = {
  title: "Home | Cloudy",
};

export default async function Homepage() {
  const supabase = await createSupabaseServerClient();
  
  // Fetch data on the server
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-10 text-center">Failed to load products.</div>;
  }

  // Pass the real database products to the Client Component
  return <HomepageClient initialProducts={products || []} />;
}




























// import sampleData from "@/db/sample-data";
// import ProductList from "@/components/shared/product/product-list";
// import { supabase } from "@/lib/supabase";
// import { useState } from "react";

// // export const metadata = {
// //   title: "Home",
// // };

// const Homepage = () => {
//   const [activeCategory, setActiveCategory] = useState("food");

//   const categories = [
//     { id: "food", label: "Food", icon: "🥐" },
//     { id: "drinks", label: "Drinks", icon: "☕" },
//     { id: "smoke", label: "Smoke", icon: "💨" },
//   ];

//   const filteredProducts = sampleData.products.filter(
//     (p) => p.category.toLowerCase() === activeCategory.toLowerCase(),
//   );

//   // The Fetch Command
//   const { data: products, error } = await supabase
//     .from("products") // Your table name
//     .select("*")      // '*' gets all columns
//     .order("created_at", { ascending: false }); // Newest first

//   if (error) {
//     console.error("Fetch error:", error.message);
//     return <div>Error loading products.</div>;
//   }else {
//     console.log(products);
//   }



//   return (
//     <div>
//       <>
//         <div className="space-y-8 bg-white dark:bg-black min-h-screen transition-colors duration-300">
//           {/* Circle Selectors */}
//           <div className="flex justify-center gap-8 py-10">
//             {categories.map((cat) => (
//               <button
//                 key={cat.id}
//                 onClick={() => setActiveCategory(cat.id)}
//                 className="group flex flex-col items-center gap-3"
//               >
//                 {/* The Text Label */}
//                 <span
//                   className={`text-sm font-bold tracking-wide transition-colors
//         ${
//           activeCategory === cat.id
//             ? "text-primary"
//             : "text-muted-foreground group-hover:text-foreground"
//         }`}
//                 >
//                   {cat.label.toUpperCase()}
//                 </span>
//               </button>
//             ))}
//           </div>

//           {/* List Section */}
//           <div className="px-4">
//             <ProductList
//               data={filteredProducts}
//               title={`${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`}
//             />
//             <ProductList
//               data={sampleData.products}
//               title="Featured Products"
//               limit={2}
//             />
//           </div>
//         </div>
//       </>
//     </div>
//   );
// };

// export default Homepage;

// // const setNewView = async () => {
// //     const { data, error } = await supabase.from("views").insert({name:"fuck"})
// //     if(data) console.log("New view added:", data)
// //       if (error) console.error("Error adding view:", error);
// //   };
// //   setNewView();
