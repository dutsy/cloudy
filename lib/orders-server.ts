// lib/services/orders-server.ts
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import type { KitchenItem, UnpaidOrder, PaymentOrder } from "@/types";


export async function getUnpaidOrders(): Promise<UnpaidOrder[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        quantity,
        price_at_purchase,
        products(name)
      )
    `)
    .eq("is_paid", false)
    .order("table_number", { ascending: true });

  if (error) throw error;

  return data ?? [];
}

// lib/orders-server.ts

export async function getUnpaidTablesWithItems(): Promise<PaymentOrder[]> {
  const supabase = await createSupabaseServerClient();

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
export async function getPendingKitchenItems(): Promise<KitchenItem[]> {
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

  if (error) throw error;

  return data as KitchenItem[];
}

export async function getActiveKitchenData(): Promise<KitchenItem[]> {
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

// lib/orders-server.ts
export async function getAnalytics(range: "today" | "week" | "month") {
  const supabase = await createSupabaseServerClient();

  const now = new Date();

  const startDate = new Date(now);

if (range === "today") {
  startDate.setHours(0, 0, 0, 0);
}

if (range === "week") {
  startDate.setDate(now.getDate() - 7);
}

if (range === "month") {
  startDate.setMonth(now.getMonth() - 1);
}

  const { data, error } = await supabase
    .from("orders")
    .select("id, total_amount, created_at")
    .eq("is_paid", true)
    .gte("created_at", startDate.toISOString());

  if (error) throw error;

  const totalRevenue = (data ?? []).reduce(
    (sum, order) => sum + (order.total_amount ?? 0),
    0
  );

  const totalOrders = data?.length ?? 0;

  return { totalRevenue, totalOrders };
}

export async function getHourlyOrders() {
  const supabase = await createSupabaseServerClient();

  // Get orders from the last 24 hours
  const { data, error } = await supabase
    .from('orders')
    .select('created_at')
    .eq('is_paid', true)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  if (error) throw error;

  // Aggregate by hour
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));

  data.forEach(order => {
    const hour = new Date(order.created_at).getHours();
    hourlyData[hour].count += 1;
  });

  return hourlyData;
}

export async function getOrdersForDate(date: string) {
  const supabase = await createSupabaseServerClient();

  // Format start and end of the chosen day
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from('orders')
    .select('id, created_at, daily_order_number, total_amount')
    .eq('is_paid', true)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  if (error) throw error;
  return data || [];
}

// lib/orders-server.ts
export async function getOrdersForMonth(yearMonth: string) {
  // 1. Validate format strictly (YYYY-MM)
  if (!yearMonth || typeof yearMonth !== 'string' || !/^\d{4}-\d{2}$/.test(yearMonth)) {
    console.error("Invalid format received:", yearMonth);
    // Fallback to current month if bad data arrives
    yearMonth = new Date().toISOString().slice(0, 7);
  }

  const [yearStr, monthStr] = yearMonth.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  // 2. Safety check: Ensure month is 1-12
  if (month < 1 || month > 12) {
    throw new Error(`Invalid month: ${month}`);
  }

  // 3. Create dates safely
  // new Date(year, monthIndex, day) 
  // monthIndex is 0-11, so we use (month - 1)
  const start = new Date(year, month - 1, 1);

  // Last day of the month: 
  // Use day 0 of the NEXT month to get the last day of the current month
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  // 4. Verify dates are valid before calling toISOString()
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Date construction failed");
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('orders')
    .select('id, created_at, daily_order_number, total_amount')
    .eq('is_paid', true)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  if (error) throw error;

  const totalRevenue = data.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  return {
    orders: data || [],
    totalRevenue,
    totalCount: data?.length || 0
  };
}

export async function getMonthlyReport(yearMonth: string) {
  const supabase = await createSupabaseServerClient();
  const [year, month] = yearMonth.split('-').map(Number);

  const start = new Date(year, month - 1, 1).toISOString();
  const end = new Date(year, month, 0, 23, 59, 59).toISOString();

  const { data, error } = await supabase
    .from('orders')
    .select('id, created_at, daily_order_number, total_amount')
    .eq('is_paid', true)
    .gte('created_at', start)
    .lte('created_at', end);

  if (error) throw error;

  const totalRevenue = data.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  return {
    orders: data,
    totalRevenue,
    totalCount: data.length
  };
}


export async function getPopularProducts(filter: string) {
  const supabase = await createSupabaseServerClient();

  let query = supabase.from('order_items').select('quantity, products (name), orders!inner (created_at)');

  if (filter !== 'all') {
    const [year, month] = filter.split('-').map(Number);
    const start = new Date(year, month - 1, 1).toISOString();
    const end = new Date(year, month, 0, 23, 59, 59, 999).toISOString();
    query = query.gte('orders.created_at', start).lte('orders.created_at', end);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) return [];

  const totals = data.reduce<Record<string, number>>(
    (acc, item) => {

      const name = item.products?.name ?? "Unknown";

      acc[name] = (acc[name] ?? 0) + item.quantity;

      return acc;
    },
    {}
  );

  return Object.entries(totals).map(([name, count]) => ({ name, count }));
}


// lib/orders-server.ts

export async function archiveOrder(
  orderId: string,
  reason: string,
  staffName: string
) {
  const supabase = await createSupabaseServerClient();

  // 1. Fetch current order data
  const { data: order, error: fetchError } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single();

  if (fetchError) throw fetchError;

  // 2. Archive into the table (using the new columns)
  const { error: archiveError } = await supabase
    .from('archived_orders')
    .insert({
      original_order_id: orderId,
      order_data: order,
      reason: reason,
      deleted_by: staffName // Adding the staff name here
    });

  if (archiveError) throw archiveError;

  // 3. Remove from active orders
  const { error: deleteError } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (deleteError) throw deleteError;

  return { success: true };
}

export async function getArchivedData() {
  const supabase = await createSupabaseServerClient();

  const { data: orders } = await supabase
    .from('archived_orders')
    .select('*')
    .order('deleted_at', { ascending: false });

  const { data: items } = await supabase
    .from('archived_order_items')
    .select('*')
    .order('deleted_at', { ascending: false });

  return { orders: orders || [], items: items || [] };
}

