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
}

export interface CartContextType {
  cart: CartItem[]
  addToCart: (product: CartItem) => void
  removeFromCart: (id: string) => void
  updateQty: (id: string, qty: number) => void
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

export interface OrderFormData {
  name: string
  phone: string
  address: string
  city: string
  state: string
  pin: string
  deliveryDate: string
  deliveryTime: string
  instructions: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_state: string | null
  customer_pin: string | null
  delivery_date: string | null
  delivery_time: string | null
  special_instructions: string | null
  subtotal: number
  delivery_charge: number
  total: number
  payment_method: string
  payment_status: string
  order_status: string
  notes: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  item_name: string
  item_price: number
  quantity: number
  selected_options: string | null
  created_at: string
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled"

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

export const BADGE_KEYWORDS = [
  "Best Seller",
  "Bestseller",
  "New Launch",
  "Highly Recommended",
  "Highly Reordered",
  "Seasonal",
  "Signature",
  "Customer Favourite",
] as const
