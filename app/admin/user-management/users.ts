"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) throw new Error("Could not update role");
  return { success: true };
}


export async function getUsers() {
  const supabase = await createSupabaseServerClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role")
    .order("email", { ascending: true });

  if (error) throw new Error("Failed to fetch users");
  return data;
}