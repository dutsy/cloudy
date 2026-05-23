"use client";

import { useState, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const CATEGORIES = [
  { value: "food", label: "🍔 Food" },
  { value: "drinks", label: "🥤 Drinks" },
  { value: "smoke", label: "💨 Smoke" },
];

export default function AddProductPage() {
  const supabase = getSupabaseBrowserClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    if (!files || files.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    setLoading(true);

    try {
      const imageUrls: string[] = [];
      const file = files[0];
      const fileName = `${Date.now()}-${file.name}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      imageUrls.push(publicUrlData.publicUrl);

      // 3. Insert to DB
      const formData = new FormData(formRef.current);
      // 5. Insert to DB
      const { error: dbError } = await supabase.from("products").insert({
        name: formData.get("name"),
        slug: formData.get("slug") || "",
        category: formData.get("category"),
        brand: formData.get("brand"),
        description: formData.get("description"),
        price: parseFloat((formData.get("price") as string) || "0"),
        stock: parseInt((formData.get("stock") as string) || "0"),
        rating: parseFloat((formData.get("rating") as string) || "0"), // Added this
        num_reviews: 0, // Usually starts at 0 for new products
        images: imageUrls,
        avaliable: true,
      });

      if (dbError) throw dbError;

      alert("Product added successfully!");
      formRef.current.reset();
      setFiles(null);
    } catch (err: any) {
      console.error("Submission Error:", err);
      alert("Failed: " + (err.message || "Unknown error occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg mx-auto p-6"
    >
      <input
        name="name"
        placeholder="Product Name"
        required
        className="border p-2 w-full rounded"
      />
      <input
        name="slug"
        placeholder="Slug (optional)"
        className="border p-2 w-full rounded"
      />

      <select name="category" required className="border p-2 w-full rounded">
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <input
        name="brand"
        placeholder="Brand"
        required
        className="border p-2 w-full rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        required
        className="border p-2 w-full rounded"
      />
      <input
        name="price"
        type="number"
        step="0.1"
        placeholder="Price"
        required
        className="border p-2 w-full rounded"
      />
      <input
        name="stock"
        type="number"
        placeholder="Stock"
        required
        className="border p-2 w-full rounded"
      />
      <input
        name="rating"
        type="number"
        step="0.1"
        min="0"
        max="5"
        placeholder="4.5"
        className="border p-2 w-full rounded"
      />
      <input
        type="file"
        onChange={(e) => setFiles(e.target.files)}
        className="w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 text-white p-3 rounded font-bold"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}
