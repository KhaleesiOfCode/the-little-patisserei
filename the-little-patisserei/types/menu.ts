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
