"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useLocale } from "next-intl"; // 1. Import the locale hook
import Image from "next/image";
import { Plus, ShoppingBag } from "lucide-react";

import { PRODUCT_PLACEHOLDER } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/components/shared/cart-context";
import ProductPrice from "@/components/shared/product/product-price";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, removeItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");

  // 2. Setup translation variables
  const locale = useLocale();
  const isArabic = locale === "ar";

  // 3. Dynamically pick the right database fields (with English fallback)
  // Note: Make sure to add `name_ar`, `description_ar`, etc. to your Product type!
  // No more "as any" needed!
  const displayName =
    isArabic && product.name_ar ? product.name_ar : product.name;
  const displayDesc =
    isArabic && product.description_ar
      ? product.description_ar
      : product.description;
  const displayBrand =
    isArabic && product.brand_ar ? product.brand_ar : product.brand;
  const displayCategory =
    isArabic && product.category_ar ? product.category_ar : product.category;

  const handleConfirmAdd = () => {
    addItem(product, note);

    toast.success(`${displayName} ${isArabic ? "تمت الإضافة!" : "added!"}`, {
      description: note
        ? `${isArabic ? "ملاحظة" : "Note"}: ${note}`
        : isArabic
          ? "استمتع بتجربتك مع كلاودي."
          : "Enjoy your Cloudy experience.",
      action: {
        label: isArabic ? "تراجع" : "Undo",
        onClick: () => removeItem(product.id, note),
        // Add this line to style the toast button with your blue theme:
      },
    });

    setNote("");
    setIsOpen(false);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <Card className="p-0 group w-full max-w-sm border border-muted bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden flex flex-col justify-between">
      {/* 2. REMOVE `items-center` and ADD `w-full m-0` to the image wrapper */}
      <div className="relative w-full m-0 p-0 overflow-hidden bg-muted/30 aspect-square">
        <Image
          src={product.images[0] || PRODUCT_PLACEHOLDER}
          alt={displayName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={true}
        />

        {/* Subtle Category/Brand Tag over the image container */}
        <span className="absolute top-3 left-3 bg-background/80 backdrop-blur-md text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full text-muted-foreground border">
          {displayBrand || displayCategory}
        </span>
      </div>

      {/* 2. SPECIFICATION TEXT SHELF */}
      <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-black text-lg text-foreground tracking-tight hover:text-blue-600 transition-colors line-clamp-1">
            {displayName}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 min-h-8">
            {displayDesc ||
              (isArabic
                ? "محضر طازجاً خصيصاً ليناسب ذوقك."
                : "Freshly custom-crafted to your specific taste parameters.")}
          </p>
        </div>

        {/* 3. INTERACTIVE FOOTER ACTION BAR */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-muted/60 mt-auto">
          <div className="flex flex-col">
            {!isOutOfStock ? (
              <ProductPrice
                value={Number(product.price)}
                className="text-black-700 dark:text-black-400 font-black text-xl tracking-tight"
              />
            ) : (
              <span className="text-xs font-bold uppercase tracking-wide text-destructive bg-destructive/10 px-2 py-0.5 rounded-md">
                {isArabic ? "نفذت الكمية" : "Out of Stock"}
              </span>
            )}
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                disabled={isOutOfStock}
                className="rounded-xl px-4 h-10 font-bold bg-blue-950 hover:bg-blue-900 text-white shadow-sm transition-all duration-200 select-none cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4 stroke-3" />
                {isArabic ? "إضافة" : "Add"}
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-106.25 rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-black text-foreground tracking-tight">
                  {isArabic ? "تخصيص طلبك" : "Customize Your Order"}
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-5 py-4">
                <div className="flex items-center gap-4 p-3 border rounded-2xl bg-muted/20">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl border bg-background shrink-0">
                    <Image
                      src={product.images[0] || PRODUCT_PLACEHOLDER}
                      alt={displayName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-foreground leading-tight">
                      {displayName}
                    </h4>
                    <ProductPrice
                      value={Number(product.price)}
                      className="text-sm font-bold text-blue-600 mt-0.5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    {isArabic
                      ? "طلبات تحضير خاصة"
                      : "Special Preparation Requests"}
                  </label>
                  <Textarea
                    placeholder={
                      isArabic
                        ? "مثال: حليب شوفان زيادة، بدون سكر..."
                        : "e.g. Extra oat milk, completely sugar free, double espresso shot..."
                    }
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-22.5 resize-none rounded-xl focus-visible:ring-blue-500"
                  />
                  <p className="text-[10px] text-muted-foreground/70 italic">
                    {isArabic
                      ? "*هذه التعليمات مرتبطة بهذا العنصر فقط في سلتك."
                      : "*Instructions are tied directly to this single item instance in your tray."}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleConfirmAdd}
                  className="w-full bg-blue-900 hover:bg-blue-600 text-white font-black h-12 rounded-xl text-base shadow-md shadow-blue-900/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {isArabic ? "إضافة للسلة — " : "Add to Cart — "}
                  <ProductPrice
                    value={Number(product.price)}
                    className="text-white"
                  />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
