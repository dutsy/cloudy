import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import type { Json } from "@/types";
import type { KitchenItem,PaymentOrderClient } from "@/types";


// ===============================
// PLACE ORDER
// ===============================

export async function placeOrder(
  tableNumber: string,
  formattedItems: Json[],
  total: number
) {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase.rpc(
    "add_to_table_ticket",
    {
      p_table_number: tableNumber,
      p_items: formattedItems as Json,
      p_total_amount: total,
    }
  );

  if (error) throw error;

  return data;
}

export async function getUnpaidTablesWithItems(): Promise<PaymentOrderClient[]> {
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

  return data ?? [];
}


export function subscribeToPaymentUpdates(
  onUpdate: () => void
) {
  const supabase = getSupabaseBrowserClient();

  const channel = supabase
    .channel("payment-orders-queue")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
      },
      () => onUpdate()
    )
    .subscribe();


  return () => {
    supabase.removeChannel(channel);
  };
}


// ===============================
// KITCHEN
// ===============================

export async function getActiveKitchenData(): Promise<KitchenItem[]> {

  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      note,
      created_at,
      products(name, category),
      orders!inner(
        table_number,
        daily_order_number,
        created_at
      )
    `)
    .eq("is_prepared", false)
    .order("created_at", {
      ascending: true,
    });


  if (error) throw error;

  return data ?? [];
}



export async function getPendingKitchenItemsClient(): Promise<KitchenItem[]> {

  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      note,
      created_at,
      products(name, category),
      orders!inner(
        table_number,
        daily_order_number,
        created_at
      )
    `)
    .eq("is_prepared", false)
    .order("created_at", {
      ascending: true,
    });


  if (error) throw error;

  return data ?? [];
}



export async function getPendingKitchenItems(): Promise<KitchenItem[]> {

  const supabase = getSupabaseBrowserClient();


  const { data, error } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      note,
      created_at,
      products(name, category),
      orders!inner(
        table_number,
        daily_order_number,
        created_at
      )
    `)
    .eq("is_prepared", false)
    .eq("orders.is_paid", false)
    .order("created_at", {
      ascending: true,
    });


  if (error) throw error;

  return data ?? [];
}



export function subscribeToKitchenUpdates(
  onUpdate: () => void
) {

  const supabase = getSupabaseBrowserClient();


  const channel = supabase
    .channel("kitchen-orders-queue")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "order_items",
      },
      () => onUpdate()
    )
    .subscribe();


  return () => {
    supabase.removeChannel(channel);
  };
}



// ===============================
// ACTIONS
// ===============================

export async function markItemAsPrepared(
  itemId: string
) {

  const supabase = getSupabaseBrowserClient();


  const { error } = await supabase
    .from("order_items")
    .update({
      is_prepared: true,
    })
    .eq("id", itemId);


  if (error) throw error;
}



export async function markAllItemsAsPrepared(
  itemIds: string[]
) {

  const supabase = getSupabaseBrowserClient();


  const { error } = await supabase
    .from("order_items")
    .update({
      is_prepared: true,
    })
    .in("id", itemIds);


  if (error) throw error;
}



export async function markOrderAsPaid(
  orderId: string
) {

  const supabase = getSupabaseBrowserClient();


  const { error } = await supabase
    .from("orders")
    .update({
      is_paid: true,
    })
    .eq("id", orderId);


  if (error) throw error;
}