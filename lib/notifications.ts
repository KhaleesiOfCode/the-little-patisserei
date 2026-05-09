import { supabase } from "./supabase/client";

export async function sendOrderConfirmation(orderId: string): Promise<boolean> {
  try {
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (!order) return false;

    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId);

    console.log(`[NOTIFICATION] Order confirmed: ${order.order_number}`, {
      customer: order.customer_name,
      phone: order.customer_phone,
      mode: order.delivery_mode,
      items: items?.length || 0,
    });

    return true;
  } catch (err) {
    console.error("[NOTIFICATION] Failed to send confirmation:", err);
    return false;
  }
}
