import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server-client";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Verify User Session Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: `Auth Failure: ${authError?.message || "No active user found"}` }, { status: 401 });
    }

    const body = await request.json();
    const { items, total_amount, table_number } = body;
    console.log("DEBUG: Items arriving at server:", JSON.stringify(items, null, 2));

    // DIAGNOSTIC CHECK A: Look closely at what data is arriving on the server
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Validation Failure: Cart items payload is empty or undefined." }, { status: 400 });
    }


    console.log("PAYLOAD RECEIVED:", JSON.stringify(body, null, 2));
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: Number(total_amount),
        status: "pending",
        table_number: table_number || "Takeaway",
        notes: null // Explicitly handle the 'notes' column if it exists in your schema
      })
      .select()
      .single();

    // DIAGNOSTIC CHECK B: Capture parent creation failures instantly
    if (orderError) {
      console.error("DATABASE REJECTED PARENT ORDER WRITE:", orderError);
      return NextResponse.json({
        error: `Database Orders Table Error [Code ${orderError.code}]: ${orderError.message}. Details: ${orderError.details || "None"}. Hint: ${orderError.hint || "None"}`
      }, { status: 500 });
    }

    // 2. Map structural row items safely
    const orderItemsPayload = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: Number(item.quantity),
      price_at_purchase: Number(item.price),
      note: item.note || null,     // Ensure this is here!
    }));

    // 3. Try writing to the Child Table (order_items)
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsPayload);

    // DIAGNOSTIC CHECK C: Capture child items row failures instantly
    if (itemsError) {
      console.error("DATABASE REJECTED CHILD ITEMS WRITE:", itemsError);
      return NextResponse.json({
        error: `Database Order_Items Table Error [Code ${itemsError.code}]: ${itemsError.message}. Details: ${itemsError.details || "None"}`
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderId: order.id }, { status: 200 });

  } catch (error: any) {
    console.error("CRITICAL APP ENGINE CRASH:", error);
    return NextResponse.json({ error: `Server Crash: ${error.message || error}` }, { status: 500 });
  }
}