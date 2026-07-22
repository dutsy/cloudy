"use client";

import { placeOrder } from "@/lib/orders-client";
import { useCart } from "@/components/shared/cart-context";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl"; // 1. Import the locale hook
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PRODUCT_PLACEHOLDER } from "@/lib/constants";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTableNumber, getCustomerName, setCustomerName } from "@/lib/storage";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CartPage() {
  const { items, addItem, removeItem, totalPrice, itemCount, clearCart } =
    useCart();
  const router = useRouter();
  
  // 2. Setup translation variables
  const locale = useLocale();
  const isArabic = locale === "ar";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    const savedName = getCustomerName();
    if (savedName) {
      setNameInput(savedName);
    }
  }, []);

  const handleInitiateCheckout = () => {
    if (items.length === 0) return;
    setIsNameDialogOpen(true);
  };

  const handleFinalCheckout = async () => {
    if (!nameInput.trim()) {
      alert(isArabic ? "الرجاء إدخال اسم للطلب." : "Please enter a name for the order.");
      return;
    }

    setIsSubmitting(true);
    setIsNameDialogOpen(false);

    setCustomerName(nameInput.trim());
    const tableNumber = getTableNumber();

    const formattedItems = items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
      note: item.note || "",
    }));

    try {
      const orderId = await placeOrder(tableNumber, formattedItems, totalPrice, nameInput.trim());
      
      if (typeof clearCart === "function"){
        clearCart();
      }
      
      const encodedName = encodeURIComponent(nameInput.trim());
      router.push(`/welcome?name=${encodedName}&order=${orderId}`);
      
    } catch (err) {
      console.error("Checkout execution failure: ", err);
      alert(isArabic ? "فشل في تقديم الطلب. يرجى المحاولة مرة أخرى." : "Failed to place order. Please try again.");
      setIsNameDialogOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- EMPTY CART STATE ---
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShoppingBag className="w-16 h-16 text-zinc-300" />
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          {isArabic ? "سلة التسوق فارغة" : "Your Cart is empty"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isArabic 
            ? "يبدو أنك لم تضف أي عناصر من كلاودي بعد." 
            : "Looks like you haven't added any Cloudy items yet."}
        </p>
        <Button
          asChild
          className="rounded-xl bg-blue-900 hover:bg-blue-600 font-bold px-6"
        >
          <Link href="/">{isArabic ? "الذهاب للتسوق" : "Go Shopping"}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-8">
        {isArabic ? "سلة التسوق" : "Shopping Cart"} ({itemCount})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => {
            // 3. Fallback to English name if Arabic doesn't exist in the cart item
            const displayName = isArabic && item.name_ar ? item.name_ar : item.name;

            return (
              <Card
                key={`${item.id}-${index}`}
                className="p-4 flex gap-4 border border-muted bg-card rounded-2xl shadow-sm"
              >
                <div className="relative w-24 h-24 rounded-xl overflow-hidden border shrink-0 bg-muted/20">
                  <Image
                    src={item.images?.[0] || PRODUCT_PLACEHOLDER}
                    alt={displayName}
                    fill
                    className="object-cover"
                    priority={index < 3}
                    sizes="100px"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-extrabold text-base sm:text-lg text-foreground tracking-tight leading-tight">
                        {displayName}
                      </h3>
                      <p className="font-black text-sm sm:text-base text-foreground shrink-0">
                        &#8362;{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {item.note && (
                      <div className="mt-1.5 p-2 bg-blue-600/3 border border-blue-500/20 rounded-xl text-xs text-blue-800 dark:text-blue-300">
                        <span className="font-bold block text-[10px] uppercase tracking-wide text-blue-600 mb-0.5">
                          {isArabic ? "ملاحظة:" : "Note:"}
                        </span>
                        {item.note}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-3 border rounded-xl px-2.5 py-1 bg-muted/10">
                      <button
                        onClick={() => removeItem(item.id, item.note)}
                        className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                      <span className="font-bold text-sm w-4 text-center text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addItem(item, item.note)}
                        className="text-muted-foreground hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24 border border-muted bg-card shadow-sm rounded-2xl space-y-5">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              {isArabic ? "ملخص الطلب" : "Order Summary"}
            </h2>

            <Separator className="bg-muted" />

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>{isArabic ? "المجموع الفرعي" : "Subtotal"}</span>
                <span className="font-bold text-foreground">
                  &#8362;{totalPrice.toFixed(2)}
                </span>
              </div>
              <Separator className="border-dashed" />
              <div className="flex justify-between items-center text-xl font-black tracking-tight text-foreground pt-1">
                <span>{isArabic ? "الإجمالي" : "Total"}</span>
                <span className="text-blue-600 dark:text-blue-400 font-black">
                  &#8362;{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleInitiateCheckout}
              disabled={isSubmitting}
              className="w-full h-12 bg-blue-900 hover:bg-blue-600 text-white font-black text-base rounded-xl shadow-md shadow-blue-900/20 transition-all duration-200 cursor-pointer select-none active:scale-[0.99]"
            >
              {isSubmitting 
                ? (isArabic ? "جاري المعالجة..." : "Processing...") 
                : (isArabic ? "تأكيد الطلب" : "Place Order")}
            </Button>
          </Card>
        </div>
      </div>

      {/* --- Name Input Dialog --- */}
      <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isArabic ? "لمن هذا الطلب؟" : "Who is this order for?"}
            </DialogTitle>
            <DialogDescription>
              {isArabic 
                ? "الرجاء إدخال اسمك لنعرف لمن نجهز الصينية." 
                : "Please enter your name so we know who to prepare the tray for."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="name" className="sr-only">
                {isArabic ? "الاسم" : "Name"}
              </Label>
              <Input
                id="name"
                placeholder={isArabic ? "مثال: أحمد عبد الله" : "e.g. John Doe"}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFinalCheckout();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsNameDialogOpen(false)}
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button 
              type="button" 
              onClick={handleFinalCheckout}
              disabled={!nameInput.trim()}
              className="bg-blue-900 hover:bg-blue-600 text-white"
            >
              {isArabic ? "تأكيد الطلب" : "Confirm Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}