"use client";

import { useState } from "react";
import { toggleProductStatus } from "./manage-products";

export default function ProductListClient({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (product: any) => {
    setLoadingId(product.id); // Set loading state for the UI

    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out after 5 seconds")), 5000)
    );

    try {
      await Promise.race([toggleProductStatus(product.id, product.avaliable), timeout]);
      
      window.location.reload(); 
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Product Availability</h1>
      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="flex justify-between items-center p-4 border rounded">
            <span>{p.name} - {p.avaliable ? "✅ Active" : "❌ Hidden"}</span>
            <button
              disabled={loadingId === p.id}
              onClick={() => handleToggle(p)}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              {loadingId === p.id ? "Processing..." : "Toggle Availability"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}