"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function processPayment(orderIds: string[]) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from("orders")
    .update({ is_paid: true })
    .in("id", orderIds);

  if (error) throw new Error("Failed to update payment status");
  return { success: true };
}