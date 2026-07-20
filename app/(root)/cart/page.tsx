"use client";

import { placeOrder } from "@/lib/orders-client";
import { useCart } from "@/components/shared/cart-context";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PRODUCT_PLACEHOLDER } from "@/lib/constants";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getTableNumber, getCustomerName, setCustomerName } from "@/lib/storage";

// Import Dialog components from shadcn/ui
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- New State for Name Dialog ---
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");

  // Load saved name on mount
  useEffect(() => {
    const savedName = getCustomerName();
    if (savedName) {
      setNameInput(savedName);
    }
  }, []);

  // 1. Initial click on "Place Order"
  const handleInitiateCheckout = () => {
    if (items.length === 0) return;
    setIsNameDialogOpen(true);
  };

  // 2. Final submission after name is entered
  const handleFinalCheckout = async () => {
    if (!nameInput.trim()) {
      alert("Please enter a name for the order.");
      return;
    }

    setIsSubmitting(true);
    setIsNameDialogOpen(false); // Close dialog

    // Save name to local storage for future orders
    setCustomerName(nameInput.trim());

    const tableNumber = getTableNumber();

    const formattedItems = items.map((item) => ({
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.price,
      note: item.note || "",
    }));

    try {
      // 1. Capture the returned order ID from the Supabase RPC
      const orderId = await placeOrder(tableNumber, formattedItems, totalPrice, nameInput.trim());
      
      if (typeof clearCart === "function"){
        clearCart();
      }
      
      // 2. Safely encode the name and add both variables to the URL
      const encodedName = encodeURIComponent(nameInput.trim());
      router.push(`/welcome?name=${encodedName}&order=${orderId}`);
      
    } catch (err) {
      console.error("Checkout execution failure: ", err);
      alert("Failed to place order. Please try again.");
      setIsNameDialogOpen(true); // Re-open if it failed
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShoppingBag className="w-16 h-16 text-zinc-300" />
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Your Cart is empty
        </h1>
        <p className="text-sm text-muted-foreground">
          Looks like you haven&apos;t added any Cloudy items yet.
        </p>
        <Button
          asChild
          className="rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold px-6"
        >
          <Link href="/">Go Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-8">
        Shopping Cart ({itemCount})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <Card
              key={`${item.id}-${index}`}
              className="p-4 flex gap-4 border border-muted bg-card rounded-2xl shadow-sm"
            >
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border shrink-0 bg-muted/20">
                <Image
                  src={item.images?.[0] || PRODUCT_PLACEHOLDER}
                  alt={item.name}
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
                      {item.name}
                    </h3>
                    <p className="font-black text-sm sm:text-base text-foreground shrink-0">
                      &#8362;{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {item.note && (
                    <div className="mt-1.5 p-2 bg-emerald-500/3 border border-emerald-500/10 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                      <span className="font-bold block text-[10px] uppercase tracking-wide text-emerald-600 mb-0.5">
                        Note:
                      </span>
                      {item.note}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-3 border rounded-xl px-2.5 py-1 bg-muted/10">
                    <button
                      onClick={() => removeItem(item.id, item.note)}
                      className="text-muted-foreground hover:text-emerald-600 transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                    <span className="font-bold text-sm w-4 text-center text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addItem(item, item.note)}
                      className="text-muted-foreground hover:text-emerald-600 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24 border border-muted bg-card shadow-sm rounded-2xl space-y-5">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Order Summary
            </h2>

            <Separator className="bg-muted" />

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">
                  &#8362;{totalPrice.toFixed(2)}
                </span>
              </div>
              <Separator className="border-dashed" />
              <div className="flex justify-between items-center text-xl font-black tracking-tight text-foreground pt-1">
                <span>Total</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">
                  &#8362;{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Changed from handleCheckout to handleInitiateCheckout */}
            <Button
              onClick={handleInitiateCheckout}
              disabled={isSubmitting}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base rounded-xl shadow-md shadow-emerald-600/10 transition-all duration-200 cursor-pointer select-none active:scale-[0.99]"
            >
              {isSubmitting ? "Processing..." : "Place Order"}
            </Button>
          </Card>
        </div>
      </div>

      {/* --- Name Input Dialog --- */}
      <Dialog open={isNameDialogOpen} onOpenChange={setIsNameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Who is this order for?</DialogTitle>
            <DialogDescription>
              Please enter your name so we know who to prepare the tray for.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="name" className="sr-only">
                Name
              </Label>
              <Input
                id="name"
                placeholder="e.g. John Doe"
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
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleFinalCheckout}
              disabled={!nameInput.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Confirm Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}