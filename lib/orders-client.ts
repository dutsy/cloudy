// lib/services/orders-client.ts
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

// 1. POST: Place order
export async function placeOrder(tableNumber: string, formattedItems: any[], total: number) {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase.rpc("add_to_table_ticket", {
    p_table_number: tableNumber,
    p_items: formattedItems,
    p_total_amount: total,
  } as any);

  if (error) throw error;
  return data;
}

// lib/orders-server.ts

export async function getUnpaidTablesWithItems() {
  const supabase = getSupabaseBrowserClient();  
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        id, 
        quantity, 
        products(name, price)
      )
    `)
    .eq("is_paid", false);

  if (error) throw error;
  return data || [];
}


export function subscribeToPaymentUpdates(onUpdate: () => void) {
  const supabase = getSupabaseBrowserClient();

  const channel = supabase
    .channel("payment-orders-queue")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      () => onUpdate()
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}



export async function getActiveKitchenData() {
  const supabase = getSupabaseBrowserClient();

  // We fetch items that are not prepared.
  // The !inner join ensures that we ONLY return items linked to orders.
  const { data, error } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      note,
      created_at,
      products(name, category),
      orders!inner(table_number, daily_order_number)
    `)
    .eq("is_prepared", false)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

// lib/services/orders-client.ts


export async function getPendingKitchenItemsClient() {
  const supabase = getSupabaseBrowserClient();
  
  // Fetch all items not yet prepared
  const { data, error } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      note,
      created_at,
      products(name),
      orders!order_items_order_id_fkey(table_number)
    `)
    .eq("is_prepared", false)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Kitchen Fetch Error:", error);
    return [];
  }
  return data || [];
}


export async function getPendingKitchenItems() {
  const supabase = getSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      note,
      orders!inner(table_number, daily_order_number, created_at),
      products(name, category)
    `)
    .eq("is_prepared", false)
    .eq("orders.is_paid", false)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

// lib/services/orders-client.ts

export function subscribeToKitchenUpdates(onUpdate: () => void) {
  const supabase = getSupabaseBrowserClient();

  const channel = supabase
    .channel("kitchen-orders-queue")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "order_items" },
      () => onUpdate()
    )
    .subscribe();

  // Return a cleanup function to be called in useEffect
  return () => {
    supabase.removeChannel(channel);
  };
}


export async function markItemAsPrepared(itemId: string) {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase
    .from("order_items")
    .update({ is_prepared: true })
    .eq("id", itemId);

  if (error) {
    console.error("Error marking item as prepared:", error);
    throw error;
  }
}


export async function markAllItemsAsPrepared(itemIds: string[]) {
  const supabase = getSupabaseBrowserClient();
  
  // We use .in() to update multiple rows at once
  const { error } = await supabase
    .from("order_items")
    .update({ is_prepared: true })
    .in("id", itemIds);

  if (error) throw error;
}


export async function markOrderAsPaid(orderId: string) {

  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase
    .from("orders")
    .update({ is_paid: true })
    .eq("id", orderId);

  if (error) {
    console.error("Error marking order as paid:", error);
    throw error;
  }
}

