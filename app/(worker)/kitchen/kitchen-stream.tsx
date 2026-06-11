"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface KitchenStreamProps {
  initialOrders: any[];
}

export default function KitchenStream({ initialOrders }: KitchenStreamProps) {
  const [orders, setOrders] = useState(initialOrders || []);
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();

  // Inside your components/shared/kitchen-stream.tsx
  const fetchOrders = useCallback(async () => {
    // 1. Get the orders
    const { data: orders, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (orderError) {
      console.error("Order Fetch Error:", orderError);
      return;
    }

    // 2. Get the items for these orders
    const orderIds = orders.map((o) => o.id);
    const { data: items, error: itemError } = await supabase
      .from("order_items")
      .select(
        `
      id,
      order_id,
      quantity,
      note,
      products (name, category)
    `,
      )
      .in("order_id", orderIds); // Get items matching our pending orders

    if (itemError) {
      console.error("Items Fetch Error:", itemError);
      return;
    }

    // 3. Manually merge the data
    const combinedData = orders.map((order) => ({
      ...order,
      order_items: items.filter((item) => item.order_id === order.id),
    }));

    console.log("MANUAL MERGE DATA:", combinedData);
    setOrders(combinedData);
  }, [supabase]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 1000);

    return () => clearTimeout(timer);
  }, [fetchOrders]);

  // 2. REALTIME SYNC
  useEffect(() => {
    const channel = supabase
      .channel("kitchen-orders-queue")
      // Listen for changes to the parent order
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          fetchOrders();
        },
      )
      // Listen for changes to the child items (where the note lives!)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_items" },
        () => {
          fetchOrders();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchOrders]);

  // Client Action handler for finishing an order
  const handleCompleteOrder = async (orderId: string) => {
    const { error } = await supabase
      .from("orders" as any)
      .update({ status: "completed" } as any)
      .eq("id", orderId);

    if (error) {
      console.error("Error completing order:", error);
    } else {
      // Optimistically clear it from client view immediately for zero lag
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      router.refresh();
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
            {orders.length} Open Tickets
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed rounded-2xl bg-muted/5">
          <p className="text-lg font-bold text-muted-foreground">
            All clear! No pending orders. 🎉
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {orders.map((order) => {
            const orderTime = new Date(order.created_at).toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" },
            );

            return (
              <div
                key={order.id}
                className="flex flex-col bg-card border-2 border-emerald-600/10 rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-4 bg-emerald-500/[0.02] border-b border-muted flex justify-between items-center">
                <h4 className="text-2xl font-black">#{order.daily_order_number}</h4>
                  <span className="text-xs font-black uppercase text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                    {order.table_number && order.table_number !== ""
                      ? `Table ${order.table_number}`
                      : "Takeaway"}
                  </span>
                  <span className="text-xs font-mono font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">
                    🕒 {orderTime}
                  </span>
                </div>

                {/* Items List */}
                <div className="p-4 sm:p-5 flex-1 space-y-4">
                  <ul className="divide-y divide-muted/60">
                    {order.order_items?.map((item: any) => (
                      <li key={item.id} className="py-3 flex flex-col gap-1.5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-foreground text-background font-black text-xs">
                              {item.quantity}
                            </span>
                            <span className="font-bold text-sm text-foreground">
                              {item.products?.name}
                            </span>
                          </div>
                          <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
                            {item.products?.category}
                          </span>
                        </div>

                        {/* IMPROVED RENDER LOGIC */}
                        {item.note ? (
                          <div className="ml-8.5 px-3 py-1.5 bg-sky-500/[0.06] border border-sky-500/20 rounded-lg text-xs text-sky-800 font-medium italic">
                            {item.note}
                          </div>
                        ) : (
                          <span className="hidden">No note found</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 sm:p-4 bg-muted/20 border-t">
                  <button
                    onClick={() => handleCompleteOrder(order.id)}
                    className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm"
                  >
                    Complete Order ✓
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
