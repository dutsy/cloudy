"use client";
import { toast } from "sonner";
import { PRODUCT_PLACEHOLDER } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/components/shared/cart-context";
import ProductPrice from "@/components/shared/product/product-price";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const ProductCard = ({ product }: { product: any }) => {
  const { addItem, removeItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");

  const handleConfirmAdd = () => {
    addItem(product, note);

    toast.success(`${product.name} added!`, {
      description: note ? `Note: ${note}` : "Enjoy your Cloudy experience.",
      action: {
        label: "Undo",
        onClick: () => removeItem(product.id, note),
      },
    });

    setNote("");
    setIsOpen(false);
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <Card className="group w-full max-w-sm border border-muted bg-card shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden flex flex-col justify-between">
      {/* 1. PRODUCT VISUAL ASPECT BANNER */}
      <div className="relative p-0 items-center overflow-hidden bg-muted/30 aspect-square">
        <Link href={`/product/${product.slug}`} className="block h-full w-full relative">
          <Image
            src={product.images[0] || PRODUCT_PLACEHOLDER}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={true}
            />
        </Link>
        
        {/* Subtle Category/Brand Tag over the image container */}
        <span className="absolute top-3 left-3 bg-background/80 backdrop-blur-md text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full text-muted-foreground border">
          {product.brand || product.category}
        </span>
      </div>

      {/* 2. SPECIFICATION TEXT SHELF */}
      <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="font-black text-lg text-foreground tracking-tight hover:text-emerald-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-2 min-h-[32px]">
            {product.description || "Freshly custom-crafted to your specific taste parameters."}
          </p>
        </div>

        {/* 3. INTERACTIVE FOOTER ACTION BAR */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-muted/60 mt-auto">
          {/* Price & Rating Layout Frame */}
          <div className="flex flex-col">
            {!isOutOfStock ? (
              <ProductPrice
                value={Number(product.price)}
                className="text-black-700 dark:text-black-400 font-black text-xl tracking-tight"
              />
            ) : (
              <span className="text-xs font-bold uppercase tracking-wide text-destructive bg-destructive/10 px-2 py-0.5 rounded-md">
                Out of Stock
              </span>
            )}
          </div>

          {/* CUSTOMIZABLE ADD ACTION BUTTON BUTTON */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                disabled={isOutOfStock}
                className="rounded-xl px-4 h-10 font-bold bg-blue-950 hover:bg-blue-900 text-white shadow-sm transition-all duration-200 select-none cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"              >
                <Plus className="h-4 w-4 stroke-[3]" />
                Add
              </Button>
            </DialogTrigger>

            {/* MODAL SHEET CONTENT POPUP CUSTOMIZER */}
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-black text-foreground tracking-tight">
                  Customize Your Order
                </DialogTitle>
              </DialogHeader>

              <div className="grid gap-5 py-4">
                {/* IN-MODAL MINI PREVIEW BANNER */}
                <div className="flex items-center gap-4 p-3 border rounded-2xl bg-muted/20">
                  <div className="relative h-16 w-16 overflow-hidden rounded-xl border bg-background shrink-0">
                    <Image
                      src={product.images[0] || PRODUCT_PLACEHOLDER}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-foreground leading-tight">{product.name}</h4>
                    <ProductPrice value={Number(product.price)} className="text-sm font-bold text-emerald-600 mt-0.5" />
                  </div>
                </div>

                {/* MODAL NOTES TEXTAREA SECTION */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Special Preparation Requests
                  </label>
                  <Textarea
                    placeholder="e.g. Extra oat milk, completely sugar free, double espresso shot..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[90px] resize-none rounded-xl focus-visible:ring-emerald-500"
                  />
                  <p className="text-[10px] text-muted-foreground/70 italic">
                    *Instructions are tied directly to this single item instance in your tray.
                  </p>
                </div>
              </div>

              {/* MODAL FINALIZE ACCENT BUTTON */}
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleConfirmAdd}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black h-12 rounded-xl text-base shadow-md shadow-emerald-600/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Add to Cart — <ProductPrice value={Number(product.price)} className="text-white" />
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