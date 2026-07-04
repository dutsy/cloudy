"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getActiveKitchenData,
  subscribeToKitchenUpdates,
  markItemAsPrepared,
  markAllItemsAsPrepared,
} from "@/lib/orders-client";
import { Badge } from "@/components/ui/badge";

export default function KitchenStream({ initialItems }) {
  const [items, setItems] = useState(initialItems || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const data = await getActiveKitchenData();
    setItems(data || []);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Use the memoized grouping logic you already wrote
  const groupedTables = useMemo(() => {
    return items.reduce((acc: any, item: any) => {
      const tableNum = item.orders?.table_number;
      if (!acc[tableNum]) {
        acc[tableNum] = {
          dailyNumber: item.orders?.daily_order_number,
          items: [],
        };
      }
      acc[tableNum].items.push(item);
      return acc;
    }, {});
  }, [items]);

  // 2. REALTIME SYNC
  useEffect(() => {
    const unsubscribe = subscribeToKitchenUpdates(fetchOrders);

    // This automatically cleans up when the component unmounts
    return () => unsubscribe();
  }, [fetchOrders]);

  // Client Action handler for finishing an order
  const handleCompleteItem = async (itemId: string) => {
    setLoadingId(itemId);
    try {
      await markItemAsPrepared(itemId);
    } catch (error) {
      console.error("Failed to mark item:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleCompleteAll = async (items: any[]) => {
    const ids = items.map((item) => item.id);
    try {
      await markAllItemsAsPrepared(ids);
    } catch (error) {
      console.error("Error marking all items:", error);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-emerald-500/10 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Cloudy Kitchen
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Live Active Production Queue
          </p>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
          <Badge className="bg-emerald-500/5 text-emerald-600 animate-pulse">
            Live Stream Active
          </Badge>
          <div className="bg-emerald-500/10 text-emerald-600 font-extrabold px-3.5 py-1.5 rounded-xl text-xs sm:text-sm">
            {items.length} Open Tickets
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed rounded-2xl bg-muted/5">
          <p className="text-lg font-bold text-muted-foreground">
            All clear! No pending orders. 🎉
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {Object.entries(groupedTables).map(
            ([tableNum, data]: [string, any]) => {
              const orderTime = new Date(
                data.items[0].created_at,
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={tableNum}
                  className="flex flex-col bg-card border-2 border-emerald-600/10 rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="p-4 bg-emerald-500/[0.02] border-b border-muted flex justify-between items-center">
                    <h4 className="text-2xl font-black">Table {tableNum}</h4>

                    <span className="text-xs font-black uppercase text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      #{data.dailyNumber}
                    </span>

                    <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      🕒 {orderTime}
                    </span>
                    <button
                      onClick={() => handleCompleteAll(data.items)}
                      className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg hover:bg-emerald-500/20"
                    >
                      Mark All Ready ✓
                    </button>
                  </div>

                  <div className="p-4 sm:p-5 flex-1 space-y-4">
                    <ul className="divide-y divide-muted/60">
                      {data.items.map((item: any) => (
                        <li key={item.id} className="py-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground text-background font-black text-xs">
                                {item.quantity}
                              </span>

                              <span className="font-bold text-sm text-foreground">
                                {item.products?.name}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
                                {item.products?.category}
                              </span>
                            </div>

                            <button
                              disabled={loadingId === item.id}
                              onClick={() => handleCompleteItem(item.id)}
                              className="bg-emerald-600 text-white font-black px-3 py-1 rounded-lg text-[10px] hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                              {loadingId === item.id ? "..." : "READY ✓"}
                            </button>
                          </div>

                          {item.note && (
                            <div className="ml-8.5 px-3 py-1.5 bg-sky-500/[0.06] border border-sky-500/20 rounded-lg text-xs text-sky-800 font-medium italic">
                              {item.note}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}
