"use client";

import { useCart } from "@/components/shared/cart-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PRODUCT_PLACEHOLDER } from "@/lib/constants";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, addItem, removeItem, totalPrice, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <ShoppingBag className="w-16 h-16 text-zinc-300" />
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">
          Looks like you haven't added any Cloudy items yet.
        </p>
        <Button asChild className="rounded-full">
          <Link href="/">Go Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({itemCount})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE: LIST OF ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <Card key={`${item.id}-${index}`} className="p-4 flex gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                <Image
                  src={item.images[0] || PRODUCT_PLACEHOLDER}
                  alt={item.name}
                  fill
                  className="object-cover"
                  priority={index < 3}
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100px"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* IMPORTANT: DISPLAY THE NOTE */}
                  {item.note && (
                    <div className="mt-1 p-2 bg-orange-50 border border-orange-100 rounded text-xs text-orange-700 italic">
                      " {item.note} "
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  {/* QUANTITY CONTROLS */}
                  <div className="flex items-center gap-3 border rounded-full px-3 py-1">
                    <button
                      onClick={() => removeItem(item.id, item.note)}
                      className="hover:text-primary transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-medium text-sm w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addItem(item, item.note)}
                      className="hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      // Optional: Create a 'deleteRow' function in context
                      // or just loop removeItem until it's gone
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button> */}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* RIGHT SIDE: SUMMARY */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {/* <div className="flex justify-between text-muted-foreground">
                <span>Estimated Shipping</span>
                <span className="text-green-600">FREE</span>
              </div> */}
              <Separator />
              <div className="flex justify-between text-xl font-bold pt-2">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full mt-8 h-12 rounded-full text-lg shadow-lg">
              Checkout
            </Button>

            {/* <p className="text-[10px] text-center text-muted-foreground mt-4">
              By proceeding, you agree to the Cloudy Terms of Service.
            </p> */}
          </Card>
        </div>
      </div>
    </div>
  );
}
