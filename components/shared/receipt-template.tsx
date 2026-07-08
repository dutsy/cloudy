import { forwardRef } from "react";
import type { PaymentOrderClient } from "@/types";
import Image from "next/image";

// Using forwardRef is REQUIRED for react-to-print
export const ReceiptTemplate = forwardRef<
  HTMLDivElement,
  { order: PaymentOrderClient }
>(({ order }, ref) => {
  return (
    <div ref={ref} className="p-8 w-[80mm] bg-white text-black font-mono">
      {/* 1. Add Logo */}
      <div className="flex justify-center mb-4">
        <Image
          src="/favicon.svg"
          alt="Cloudy Coffee Logo"
          width={80}
          height={80}
          className="w-20 h-20"
        />{" "}
      </div>

      {/* 2. Order Info */}
      <div className="border-b-2 border-dashed border-black pb-4 text-center">
        <h1 className="text-xl font-bold">Cloudy Coffee</h1>
        <p>Order #{order.daily_order_number}</p>
        <p>Table: {order.table_number}</p>
      </div>

      {/* 3. Dynamic Rows */}
      <ul className="py-4">
        {order.order_items.map((item) => (
          <li key={item.id} className="flex justify-between py-1">
            <span>
              {item.quantity}x {item.products?.name ?? "Unknown Product"}
            </span>
            <span>
              ${(item.quantity * (item.products?.price ?? 0)).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      {/* 4. Footer */}
      <div className="border-t-2 border-dashed border-black pt-2 text-right font-bold">
        Total: &#8362;{order.total_amount}
      </div>
    </div>
  );
});
ReceiptTemplate.displayName = "ReceiptTemplate";
