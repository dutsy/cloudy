"use client";

import { useState, useRef } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const CATEGORIES = [
  { value: "food", label: "🍔 Food" },
  { value: "drinks", label: "🥤 Drinks" },
  { value: "smoke", label: "💨 Shisha" },
];

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/(^-|-$)+/g, ""); // Remove leading/trailing hyphens
};

export default function AddProductPage() {
  const supabase = getSupabaseBrowserClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState("");

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
      const productName = formData.get("name") as string;

      const generatedSlug = generateSlug(productName);

      // 5. Insert to DB
      const { error: dbError } = await supabase.from("products").insert({
        name: String(formData.get("name") || ""),
        slug: generatedSlug,
        category: String(formData.get("category") || ""),
        brand: String(formData.get("brand") || ""),
        description: String(formData.get("description") || ""),

        price: Number(formData.get("price") || 0),

        stock: 9999,

        rating: Number(formData.get("rating") || 0),

        num_reviews: 0,

        images: imageUrls,

        avaliable: true,
      });

      if (dbError) throw dbError;

      alert("Product added successfully!");
      formRef.current.reset();
      setFiles(null);
      setFiles(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus(error.message);
        console.error(status);
      } else {
        setStatus("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-2xl">
        {" "}
        {/* This 'max-w-2xl' restricts the width */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <div className="space-y-4">
            {/* Full width always */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                name="name"
                placeholder="e.g. Double Cheeseburger"
                required
                className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Grid: 1 column on mobile (default), 2 columns on small screens (sm:) and up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  required
                  className="w-full border-gray-300 border p-3 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  name="brand"
                  placeholder="e.g. McDonald's"
                  required
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Briefly describe the product..."
                required
                className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  required
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Rating
                </label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.5"
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <div className="mt-1 flex justify-center px-4 py-6 border-2 border-gray-300 border-dashed rounded-lg">
                <input
                  type="file"
                  onChange={(e) => setFiles(e.target.files)}
                  className="text-sm text-gray-500 w-full"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-lg font-bold transition-all disabled:opacity-50 shadow-md"
          >
            {loading ? "Adding Product..." : "Add Product to Menu"}
          </button>
        </form>
      </div>
    </div>
  );
}
