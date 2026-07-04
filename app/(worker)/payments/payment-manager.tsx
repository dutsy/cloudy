"use client";
import { useState, useEffect, useMemo } from "react";
import { markItemAsPrepared } from "@/lib/orders-client";

export default function KitchenStream({ initialOrders }: { initialOrders: any[] }) {
  const [items, setItems] = useState(initialOrders);

  // Group items by table_number
  const groupedItems = useMemo(() => {
    return items.reduce((acc: any, item: any) => {
      const table = item.orders?.table_number || "Takeaway";
      if (!acc[table]) acc[table] = [];
      acc[table].push(item);
      return acc;
    }, {});
  }, [items]);

  const handleCompleteItem = async (itemId: string) => {
    await markItemAsPrepared(itemId);
    // Remove only this item from local state
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(groupedItems).map(([table, tableItems]: [string, any]) => (
        <div key={table} className="border-2 border-emerald-600/20 rounded-2xl p-4 bg-card">
          <h3 className="text-xl font-black mb-4">Table {table}</h3>
          {tableItems.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-bold">{item.quantity}x {item.products?.name}</p>
                {item.note && <p className="text-xs text-sky-600 italic">{item.note}</p>}
              </div>
              <button 
                onClick={() => handleCompleteItem(item.id)}
                className="bg-emerald-600 text-white px-4 py-1 rounded-lg text-sm font-bold"
              >
                Ready
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}