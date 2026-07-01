// app/admin/kitchen/payments/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase/server-client";
import PaymentManager from "./payment-manager";

export default async function PaymentsPage() {
  const supabase = await createSupabaseServerClient();

  // Fetch only Completed but Unpaid orders
  const { data: unpaidOrders } = await supabase
    .from("orders")
    .select(
      `
    *,
    order_items (
      quantity,
      products (name)
    )
  `,
    )
    .eq("status", "completed")
    .eq("is_paid", false)
    .order("created_at", { ascending: true });

  return (
    <div className="p-8">
      <h1 className="h1-bold mb-8">Pending Payments</h1>
      {/* Client Component handles the merging logic */}
      <PaymentManager initialOrders={unpaidOrders || []} />
    </div>
  );
}
