"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server-client";

// Fetch function
export async function getAllProducts() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw new Error(error.message);
  return data;
}

// Update function
export async function toggleProductStatus(id: string, currentStatus: boolean) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from("products")
    .update({ avaliable: !currentStatus }) 
    .eq("id", id);

  if (error) throw new Error(error.message);
  return { success: true };
}