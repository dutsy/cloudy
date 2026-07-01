"use client";

import { useCart } from "@/components/shared/cart-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PRODUCT_PLACEHOLDER } from "@/lib/constants";
import { Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, addItem, removeItem, totalPrice, itemCount, clearCart } =
    useCart();
  const router = useRouter();

  // Unified State management moved right to the parent container
  const [tableNumber, setTableNumber] = useState<string>("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    const orderPayload = {
      items: items, // Using your active array hook data mapping name
      total_amount: totalPrice,
      table_number: tableNumber || "Takeaway",
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (typeof clearCart === "function") {
        clearCart();
      }

      if (res.ok) {
        const data = await res.json();
        router.push(`/welcome?order=${data.orderNumber}`);
      }
    } catch (err) {
      console.error("Checkout execution failure: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // EMPTY STATE INTERFACE
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShoppingBag className="w-16 h-16 text-zinc-300" />
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Your tray is empty
        </h1>
        <p className="text-sm text-muted-foreground">
          Looks like you haven't added any Cloudy items yet.
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
        Shopping Tray ({itemCount})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: LIST OF ITEMS */}
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
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* DISPLAY SPECIAL INSTRUCTION ITEM NOTES */}
                  {item.note && (
                    <div className="mt-1.5 p-2 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                      <span className="font-bold block text-[10px] uppercase tracking-wide text-emerald-600 mb-0.5">
                        Note:
                      </span>
                      {item.note}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-3">
                  {/* QUANTITY RECONCILIATION TOGGLE COUNTER */}
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

        {/* RIGHT COLUMN: MERGED STICKY SUMMARY MODAL */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24 border border-muted bg-card shadow-sm rounded-2xl space-y-5">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Order Summary
            </h2>

            {/* DYNAMIC TABLE SELECTOR COMPONENT FIELD */}
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                Dining Option
              </label>
              <select
                value={tableNumber}
                onChange={(e) => {
                  console.log("Selected Table:", e.target.value);
                  setTableNumber(e.target.value);
                }}
                className="w-full h-11 px-3 rounded-xl border border-input bg-background font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="1">☕ Table 1</option>
                <option value="2">☕ Table 2</option>
                <option value="3">☕ Table 3</option>
                <option value="4">☕ Table 4</option>
                <option value="5">☕ Table 5</option>
                <option value="6">☕ Table 6</option>
                <option value="7">☕ Table 7</option>
                <option value="8">☕ Table 8</option>
                <option value="9">☕ Table 9</option>
                <option value="10">☕ Table 10</option>
                <option value="11">☕ Table 11</option>
                <option value="12">☕ Table 12</option>
                <option value="13">☕ Table 13</option>
              </select>
            </div>

            <Separator className="bg-muted" />

            {/* BALANCE TOTAL CALCULATOR FOOTER */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Separator className="border-dashed" />
              <div className="flex justify-between items-center text-xl font-black tracking-tight text-foreground pt-1">
                <span>Total</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base rounded-xl shadow-md shadow-emerald-600/10 transition-all duration-200 cursor-pointer select-none active:scale-[0.99]"
            >
              {isSubmitting ? "Processing Tray..." : "Place Order"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
