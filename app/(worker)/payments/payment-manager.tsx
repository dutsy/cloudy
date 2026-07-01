"use client";
import { useState } from "react";
import { processPayment } from "./payments";

export default function PaymentManager({ initialOrders }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orders] = useState(() => {
    return [...initialOrders].sort((a, b) =>
      String(a.table_number).localeCompare(String(b.table_number), undefined, {
        numeric: true,
      }),
    );
  });

  const handlePrint = async () => {
    if (selected.length === 0) return;
    setIsProcessing(true);

    try {
      // 1. Update DB
      await processPayment(selected);

      // 2. Trigger Print Dialog
      window.print();

      // 3. Refresh page to remove paid items
      window.location.reload();
    } catch (err) {
      alert("Error processing payment: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };
  // Inside PaymentManager component

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order: any) => (
        <div
          key={order.id}
          className={`border-2 p-5 rounded-xl transition-all ${
            selected.includes(order.id)
              ? "border-primary bg-primary/5"
              : "border-border"
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg">Table {order.table_number}</h3>
              <p className="text-sm text-muted-foreground">
                Order #{order.daily_order_number}
              </p>
            </div>
            <input
              type="checkbox"
              className="h-6 w-6 accent-primary"
              onChange={() => toggleSelect(order.id)}
            />
          </div>

          <ul className="text-sm space-y-1 mb-4">
            {order.order_items.map((item: any, idx: number) => (
              <li key={idx} className="flex justify-between">
                <span>
                  {item.quantity}x {item.products.name}
                </span>
              </li>
            ))}
          </ul>

          <p className="font-bold border-t pt-2">
            Total: ${order.total_amount}
          </p>
        </div>
      ))}

      {/* Footer Summary - Stays visible as you scroll */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t shadow-lg flex justify-between items-center">
        <h2 className="text-xl font-black">
          Selected Total: $
          {orders
            .filter((o) => selected.includes(o.id))
            .reduce((s, o) => s + Number(o.total_amount), 0)}
        </h2>
        <button className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold">
          Print Combined Receipt ({selected.length})
        </button>
        <button
          disabled={isProcessing || selected.length === 0}
          onClick={handlePrint}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "Print & Mark Paid"}
        </button>
      </div>
    </div>
  );
}
