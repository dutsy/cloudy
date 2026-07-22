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

      // 4. Insert to DB with correct explicit fields
      const { error: dbError } = await supabase.from("products").insert({
        name: String(formData.get("name") || ""),
        name_ar: String(formData.get("name_ar") || ""),
        slug: generatedSlug,
        category: String(formData.get("category") || ""),
        category_ar: String(formData.get("category_ar") || ""),
        brand: String(formData.get("brand") || "Cloudy"),
        brand_ar: String(formData.get("brand_ar") || ""),
        description: String(formData.get("description") || ""),
        description_ar: String(formData.get("description_ar") || ""),
        price: Number(formData.get("price") || 0),
        stock: Number(formData.get("stock") || 999999),
        images: imageUrls,
        avaliable: true,
      });

      if (dbError) throw dbError;

      alert("Product added successfully!");
      formRef.current.reset();
      setFiles(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setStatus(error.message);
        console.error(error.message);
        console.log(status);
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
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          
          <div className="space-y-4">
            
            {/* English & Arabic Product Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name (EN)
                </label>
                <input
                  name="name"
                  placeholder="e.g. Double Cheeseburger"
                  required
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name (AR) 🇦🇪
                </label>
                <input
                  name="name_ar"
                  dir="rtl"
                  placeholder="مثال: تشيز برجر مزدوج"
                  required
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Category & Category Arabic Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category (EN)
                </label>
                <select
                  name="category"
                  required
                  className="w-full border-gray-300 border p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                  Category Arabic Label (Optional)
                </label>
                <input
                  name="category_ar"
                  dir="rtl"
                  placeholder="مثال: طعام، مشروبات، شيشة"
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Brand & Brand Arabic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  name="brand"
                  placeholder="e.g. Cloudy"
                  required
                  defaultValue="Cloudy"
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand (AR)
                </label>
                <input
                  name="brand_ar"
                  dir="rtl"
                  placeholder="كلاودي"
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Description (EN & AR) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (EN)
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Briefly describe the product..."
                  required
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (AR) 🇦🇪
                </label>
                <textarea
                  name="description_ar"
                  rows={3}
                  dir="rtl"
                  placeholder="صف المنتج باختصار..."
                  required
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            {/* Price & Stock */}
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
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock / Quantity
                </label>
                <input
                  name="stock"
                  type="number"
                  placeholder="999999"
                  defaultValue="999999"
                  required
                  className="w-full border-gray-300 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <div className="mt-1 flex justify-center px-4 py-6 border-2 border-gray-300 border-dashed rounded-lg">
                <input
                  type="file"
                  onChange={(e) => setFiles(e.target.files)}
                  className="text-sm text-gray-500 w-full cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-900 hover:bg-blue-800 text-white p-4 rounded-lg font-bold transition-all disabled:opacity-50 shadow-md cursor-pointer"
          >
            {loading ? "Adding Product..." : "Add Product to Menu"}
          </button>
        </form>
      </div>
    </div>
  );
}