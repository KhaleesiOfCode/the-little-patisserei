import { supabase } from "./client";
import type { Order, OrderItem, OrderFormData, OrderStatus } from "../../types/menu";

export async function createOrder(
  form: OrderFormData,
  items: { name: string; price: number; qty: number; options?: string }[],
  subtotal: number,
  total: number
): Promise<Order | null> {
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

  const payload = {
    order_number: orderNumber,
    customer_name: form.name,
    customer_phone: form.phone,
    customer_address: form.address,
    customer_city: form.city,
    customer_state: form.state || null,
    customer_pin: form.pin || null,
    delivery_date: form.deliveryDate || null,
    delivery_time: form.deliveryTime || null,
    special_instructions: form.instructions || null,
    subtotal,
    delivery_charge: 50,
    total,
    payment_method: "razorpay",
    payment_status: "paid",
    order_status: "pending",
  };

  const { data: order, error } = await supabase
    .from("orders")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Failed to create order — payload:", payload, "error:", JSON.stringify(error));
    return null;
  }

  if (!order) {
    console.error("Order insert returned no data");
    return null;
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    item_name: item.name,
    item_price: item.price,
    quantity: item.qty,
    selected_options: item.options || null,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Failed to insert order items — items:", orderItems, "error:", JSON.stringify(itemsError));
    return null;
  }

  return order as Order;
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }

  return data as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !order) {
    console.error("Failed to fetch order:", error);
    return null;
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  return { ...(order as Order), items: (items as OrderItem[]) || [] };
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error || !order) {
    console.error("Failed to fetch order:", error);
    return null;
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  return { ...(order as Order), items: (items as OrderItem[]) || [] };
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<boolean> {
  const { error } = await supabase
    .from("orders")
    .update({ order_status: status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Failed to update order status:", error);
    return false;
  }

  return true;
}

export function subscribeToOrders(callback: (order: Order) => void) {
  return supabase
    .channel("orders-channel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "orders" },
      (payload) => {
        callback(payload.new as Order);
      }
    )
    .subscribe();
}
