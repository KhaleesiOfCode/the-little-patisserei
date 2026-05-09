import { supabase } from "./client";
import type { Order, OrderItem, OrderFormData, OrderStatus, DeliveryMode } from "../../types/menu";
import { getMinDateTime } from "../../types/menu";

export async function createOrder(
  form: OrderFormData,
  items: { name: string; price: number; qty: number; quantityLabel?: string; eggOption?: string; productId?: string }[],
  subtotal: number,
  deliveryFee: number,
  deliveryZone: string | null,
  courierZone?: string | null,
  totalWeight?: number | null,
  weightSlab?: string | null,
  fragileSurcharge?: number,
): Promise<Order | null> {
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
  const mode = form.deliveryMode;
  const minAt = getMinDateTime(mode);

  const isCourierCalculated = mode === "courier" && deliveryFee > 0
  const feeStatus = mode === "pickup" ? "included" : mode === "courier" ? (isCourierCalculated ? "calculated" : "pending_confirmation") : "zone";
  const actualFee = mode === "courier" ? deliveryFee : deliveryFee;
  const orderTotal = subtotal + actualFee + (fragileSurcharge ?? 0);

  const payload: Record<string, any> = {
    order_number: orderNumber,
    delivery_mode: mode,
    delivery_zone: deliveryZone,
    courier_zone: courierZone || null,
    total_courier_weight_grams: totalWeight || null,
    courier_weight_slab: weightSlab || null,
    fragile_surcharge: fragileSurcharge ?? 0,
    district: form.district || null,
    status: "order_received",
    payment_status: "paid",
    payment_method: "razorpay",
    subtotal,
    delivery_fee: actualFee,
    delivery_fee_status: feeStatus,
    delivery_charge: actualFee,
    total: orderTotal,
    estimated_delivery_at: minAt.toISOString(),
    customer_name: form.name,
    customer_phone: form.phone,
    customer_email: form.email || null,
    notes: form.instructions || null,
  };

  if (mode === "pickup") {
    payload.pickup_date = form.pickupDate || null;
    payload.pickup_slot = form.pickupSlot || null;
    payload.preferred_delivery_date = form.pickupDate || null;
    payload.preferred_delivery_slot = form.pickupSlot || null;
    payload.city = "Chennai";
  } else {
    const isChennai = form.city?.trim().toLowerCase() === "chennai" ||
      form.pincode?.trim().slice(0, 3) === "600";
    payload.delivery_type = isChennai ? "chennai" : "outside_chennai";
    payload.address_line_1 = form.addressLine1;
    payload.address_line_2 = form.addressLine2 || null;
    payload.city = form.city;
    payload.state = form.state;
    payload.pincode = form.pincode;
    payload.landmark = form.landmark || null;
    payload.preferred_delivery_date = form.deliveryDate || null;
    payload.preferred_delivery_slot = form.deliverySlot || null;

    if (mode === "courier") {
      payload.receiver_name = form.receiverName || null;
      payload.receiver_phone = form.receiverPhone || null;
      payload.alternate_phone = form.alternatePhone || null;
      payload.full_courier_address = form.courierAddress || null;
      payload.courier_notes = form.courierNotes || null;
      payload.confirm_courier_risk = form.confirmCourierRisk || false;
    }
  }

  const { data: order, error } = await supabase
    .from("orders")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Failed to create order — error:", JSON.stringify(error));
    return null;
  }

  if (!order) {
    console.error("Order insert returned no data");
    return null;
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId || null,
    item_name: item.name,
    quantity_label: item.quantityLabel || null,
    egg_option: item.eggOption || null,
    unit_price: item.price,
    quantity: item.qty,
    line_total: item.price * item.qty,
    selected_options: [item.quantityLabel, item.eggOption].filter(Boolean).join(" · ") || null,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Failed to insert order items — error:", JSON.stringify(itemsError));
    return null;
  }

  return order as Order;
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data || []).map((o: any) => ({
    ...o,
    items: (o.order_items || []) as OrderItem[],
  })) as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data: order, error } = await supabase
    .from("orders").select("*").eq("id", id).single();
  if (error || !order) return null;
  const { data: items } = await supabase
    .from("order_items").select("*").eq("order_id", id).order("created_at", { ascending: true });
  return { ...(order as Order), items: (items as OrderItem[]) || [] };
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const { data: order, error } = await supabase
    .from("orders").select("*").eq("order_number", orderNumber).single();
  if (error || !order) return null;
  const { data: items } = await supabase
    .from("order_items").select("*").eq("order_id", order.id).order("created_at", { ascending: true });
  return { ...(order as Order), items: (items as OrderItem[]) || [] };
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  const { error } = await supabase
    .from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return false;
  return true;
}

export async function updateDeliveryFee(id: string, fee: number): Promise<boolean> {
  const order = await getOrderById(id);
  if (!order) return false;
  const { error } = await supabase
    .from("orders").update({
      delivery_fee: fee,
      delivery_fee_status: "manual",
      delivery_charge: fee,
      total: order.subtotal + fee,
      updated_at: new Date().toISOString(),
    }).eq("id", id);
  return !error;
}

export async function updateDeliveryInfo(
  id: string,
  data: { provider_name?: string; partner_phone?: string; tracking_url?: string; notes?: string }
): Promise<boolean> {
  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (data.provider_name !== undefined) updates.delivery_provider_name = data.provider_name;
  if (data.partner_phone !== undefined) updates.delivery_partner_phone = data.partner_phone;
  if (data.tracking_url !== undefined) updates.delivery_tracking_url = data.tracking_url;
  if (data.notes !== undefined) updates.delivery_notes = data.notes;
  const { error } = await supabase.from("orders").update(updates).eq("id", id);
  return !error;
}

export async function updateCourierInfo(
  id: string,
  data: { company?: string; tracking_number?: string; tracking_url?: string; charge?: number; notes?: string }
): Promise<boolean> {
  const order = await getOrderById(id);
  if (!order) return false;
  const updates: Record<string, any> = { updated_at: new Date().toISOString() };
  if (data.company !== undefined) updates.courier_company = data.company;
  if (data.tracking_number !== undefined) updates.courier_tracking_number = data.tracking_number;
  if (data.tracking_url !== undefined) updates.courier_tracking_url = data.tracking_url;
  if (data.charge !== undefined) updates.courier_charge = data.charge;
  if (data.notes !== undefined) updates.courier_notes = data.notes;
  if (data.charge !== undefined && data.charge > 0) {
    updates.delivery_fee_status = "confirmed";
    updates.delivery_fee = data.charge;
    updates.delivery_charge = data.charge;
    updates.total = order.subtotal + data.charge;
  }
  const { error } = await supabase.from("orders").update(updates).eq("id", id);
  return !error;
}

export async function updateBakerNotes(id: string, bakerNotes: string): Promise<boolean> {
  const { error } = await supabase
    .from("orders").update({ baker_notes: bakerNotes, updated_at: new Date().toISOString() }).eq("id", id);
  return !error;
}

export function subscribeToOrders(callback: (order: Order) => void) {
  return supabase
    .channel("orders-channel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "orders" },
      (payload) => callback(payload.new as Order),
    )
    .subscribe();
}
