// lib/services/orders-server.ts
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

// 1. GET: Fetch unpaid orders 
export async function getUnpaidOrders() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("orders")
        .select(`*, order_items (quantity, price_at_purchase, products (name))`)
        .eq("is_paid", false)
        .order("table_number", { ascending: true });

    if (error) throw error;
    return data;
}

// 2. UPDATE: Batch mark orders as paid 
export async function markOrdersAsPaid(orderIds: string[]) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
        .from("orders")
        .update({ is_paid: true })
        .in("id", orderIds);

    if (error) throw error;
    return { success: true };
}

// 3. GET: Pending kitchen items
export async function getPendingKitchenItems() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      note,
      products(name),
      orders!order_items_order_id_fkey(table_number)
    `)
    .eq("is_prepared", false);

  return data || [];
}

export async function getActiveKitchenData() {
  const supabase = await createSupabaseServerClient();

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