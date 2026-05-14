export interface MenuItemPrice {
  quantity_label: string
  price: number
  display_order: number
}

export interface MenuItemMedia {
  media_type: "image" | "video"
  url: string
  alt_text?: string
  display_order: number
}

export interface MenuItem {
  id: string
  name: string
  description: string
  type: "veg" | "nonveg"
  keywords: string[]
  ingredient_tags: string[]
  shelf_life: string
  image: string
  images: string[]
  video: string
  price: number
  prices: MenuItemPrice[]
  badges: string[]
  category: string
  courier_supported?: boolean
  courier_weight_grams?: number | null
  courier_fragile?: boolean | null
  courier_category?: string | null
}

export interface MenuCategory {
  name: string
  items: MenuItem[]
}

export interface CartItem extends MenuItem {
  qty: number
  selectedQuantity?: string
  selectedEggOption?: string
  originalId?: string
  cakeMessage?: string
  cakeOccasion?: string
  cakeDesign?: string
}

export interface CartContextType {
  cart: CartItem[]
  addToCart: (product: CartItem) => void
  removeFromCart: (id: string) => void
  updateQty: (id: string, qty: number) => void
  updateCartItem: (id: string, updates: Partial<CartItem>) => void
  clearCart: () => void
  total: number
}

export interface SizeOption {
  label: string
  price: number
  serves: string
}

export interface CustomCakeForm {
  flavour: string
  size: string
  message: string
  occasion: string
  designDescription: string
  date: string
  time: string
  name: string
  phone: string
  address: string
  city: string
  pin: string
}

// ===================== Delivery / Order types =====================

export type DeliveryMode = "pickup" | "local_delivery" | "courier"

export interface DeliveryFeeConfig {
  base_fee: number
  per_km_fee: number
  max_km: number
  free_delivery_above: number | null
}

export const DEFAULT_DELIVERY_FEE_CONFIG: DeliveryFeeConfig = {
  base_fee: 50,
  per_km_fee: 15,
  max_km: 30,
  free_delivery_above: null,
}

export function estimateDeliveryFee(
  mode: DeliveryMode,
  subtotal: number,
  config: DeliveryFeeConfig = DEFAULT_DELIVERY_FEE_CONFIG
): { fee: number; status: "included" | "estimated" | "manual" } {
  if (mode === "pickup") return { fee: 0, status: "included" }
  if (mode === "local_delivery") {
    if (config.free_delivery_above && subtotal >= config.free_delivery_above) {
      return { fee: 0, status: "included" }
    }
    return { fee: config.base_fee, status: "estimated" }
  }
  return { fee: 0, status: "manual" }
}

export type OrderStatus =
  | "order_received"
  | "baker_confirmed"
  | "ready_for_pickup"
  | "picked_up"
  | "out_for_delivery"
  | "courier_booked"
  | "delivered"
  | "date_change_requested"
  | "cancelled"
  | "refund_initiated"
  | "refunded"

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  order_received: "Order Received",
  baker_confirmed: "Baker Confirmed",
  ready_for_pickup: "Ready for Pickup",
  picked_up: "Picked Up",
  out_for_delivery: "Out for Delivery",
  courier_booked: "Courier Booked",
  delivered: "Delivered",
  date_change_requested: "Date Change Requested",
  cancelled: "Cancelled",
  refund_initiated: "Refund Initiated",
  refunded: "Refunded",
}

export const STATUS_FLOW_PICKUP: OrderStatus[] = [
  "order_received", "baker_confirmed", "ready_for_pickup", "delivered",
]

export const STATUS_FLOW_LOCAL: OrderStatus[] = [
  "order_received", "baker_confirmed", "out_for_delivery", "delivered",
]

export const STATUS_FLOW_COURIER: OrderStatus[] = [
  "order_received", "baker_confirmed", "courier_booked", "delivered",
]

export function getStatusFlow(mode: DeliveryMode | null | undefined): OrderStatus[] {
  if (mode === "pickup") return STATUS_FLOW_PICKUP
  if (mode === "courier") return STATUS_FLOW_COURIER
  return STATUS_FLOW_LOCAL
}

export function getNextStatuses(current: OrderStatus, mode: DeliveryMode | null | undefined): OrderStatus[] {
  if (mode === "pickup") {
    const m: Record<string, OrderStatus[]> = {
      order_received: ["baker_confirmed", "cancelled"],
      baker_confirmed: ["ready_for_pickup", "cancelled"],
      ready_for_pickup: ["delivered"],
      cancelled: ["refund_initiated"],
      refund_initiated: ["refunded"],
    }
    return m[current] || []
  }
  if (mode === "courier") {
    const m: Record<string, OrderStatus[]> = {
      order_received: ["baker_confirmed", "cancelled"],
      baker_confirmed: ["courier_booked", "cancelled"],
      courier_booked: ["delivered"],
      cancelled: ["refund_initiated"],
      refund_initiated: ["refunded"],
    }
    return m[current] || []
  }
  const m: Record<string, OrderStatus[]> = {
    order_received: ["baker_confirmed", "cancelled"],
    baker_confirmed: ["out_for_delivery", "cancelled"],
    out_for_delivery: ["delivered"],
    cancelled: ["refund_initiated"],
    refund_initiated: ["refunded"],
  }
  return m[current] || []
}

export interface OrderFormData {
  deliveryMode: DeliveryMode
  name: string
  phone: string
  email: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  district: string
  pincode: string
  landmark: string
  deliveryDate: string
  deliverySlot: string
  instructions: string
  // pickup
  pickupDate: string
  pickupSlot: string
  // courier
  receiverName: string
  receiverPhone: string
  alternatePhone: string
  courierAddress: string
  courierNotes: string
  confirmCourierRisk: boolean
}

export const STATUS_COLORS: Record<string, string> = {
  order_received: "bg-amber-100 text-amber-800 ring-amber-300",
  baker_confirmed: "bg-blue-100 text-blue-800 ring-blue-300",
  ready_for_pickup: "bg-teal-100 text-teal-800 ring-teal-300",
  picked_up: "bg-green-100 text-green-800 ring-green-300",
  out_for_delivery: "bg-orange-100 text-orange-800 ring-orange-300",
  courier_booked: "bg-indigo-100 text-indigo-800 ring-indigo-300",
  delivered: "bg-green-100 text-green-800 ring-green-300",
  date_change_requested: "bg-yellow-100 text-yellow-800 ring-yellow-300",
  cancelled: "bg-red-100 text-red-800 ring-red-300",
  refund_initiated: "bg-pink-100 text-pink-800 ring-pink-300",
  refunded: "bg-gray-100 text-gray-800 ring-gray-300",
}

export const STATUS_WA_MESSAGES: Record<string, (orderNumber: string, trackingUrl: string) => string> = {
  baker_confirmed: (on, tu) => `Your order ${on} has been confirmed by our baker! ✅\n\nTrack: ${tu}`,
  ready_for_pickup: (on, tu) => `Your order ${on} is ready for pickup! 📦🎉\n\nTrack: ${tu}`,
  picked_up: (on, tu) => `Your order ${on} has been picked up! Thank you! 🎉\n\nTrack: ${tu}`,
  out_for_delivery: (on, tu) => `Your order ${on} is out for delivery! 🚚\n\nTrack: ${tu}`,
  courier_booked: (on, tu) => `Your order ${on} has been handed to the courier! 📦🚚\n\nTrack: ${tu}`,
  delivered: (on, tu) => `Your order ${on} has been delivered! 🎉 Thank you!\n\nTrack: ${tu}`,
  date_change_requested: (on, tu) => `We need to discuss a date change for order ${on}. Please contact us.\n\nTrack: ${tu}`,
  refund_initiated: (on, tu) => `A refund has been initiated for order ${on}. 💰\n\nTrack: ${tu}`,
}

// ===================== Order DB shape =====================

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_mode: DeliveryMode | null
  delivery_type: string | null
  status: OrderStatus
  payment_status: string
  payment_method: string
  subtotal: number
  delivery_fee: number | null
  delivery_charge: number
  total: number
  delivery_zone: string | null
  delivery_distance_km: number | null
  delivery_fee_status: string | null
  address_line_1: string | null
  address_line_2: string | null
  city: string | null
  state: string | null
  pincode: string | null
  landmark: string | null
  preferred_delivery_date: string | null
  preferred_delivery_slot: string | null
  pickup_date: string | null
  pickup_slot: string | null
  estimated_delivery_at: string | null
  delivery_provider_name: string | null
  delivery_partner_phone: string | null
  delivery_tracking_url: string | null
  delivery_notes: string | null
  courier_company: string | null
  courier_tracking_number: string | null
  courier_tracking_url: string | null
  courier_zone: string | null
  total_courier_weight_grams: number | null
  courier_weight_slab: string | null
  courier_charge: number | null
  fragile_surcharge: number
  courier_notes: string | null
  district: string | null
  receiver_name: string | null
  receiver_phone: string | null
  alternate_phone: string | null
  full_courier_address: string | null
  confirm_courier_risk: boolean
  baker_notes: string | null
  notes: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  item_name: string
  quantity_label: string | null
  egg_option: string | null
  unit_price: number
  quantity: number
  line_total: number
  selected_options: string | null
  created_at: string
}

export function formatQuantityLabel(label: string): string {
  const num = label.replace(/[^0-9.]/g, "");
  const unit = label.replace(/[0-9.\s]/g, "").toLowerCase();
  if (!num) return label;
  if (unit === "g" || unit === "kg") return `${num} ${unit}`;
  return `${unit.charAt(0).toUpperCase() + unit.slice(1)} of ${num}`;
}

export const BADGE_KEYWORDS = [
  "Best Seller", "Bestseller", "New Launch", "Highly Recommended",
  "Highly Reordered", "Seasonal", "Signature", "Customer Favourite",
] as const
