import { getZoneForDistrict } from "./southIndiaData"

export interface WeightSlab {
  key: string
  maxGrams: number
  label: string
}

export interface CourierZone {
  key: string
  label: string
  pricing: Record<string, number>
}

export type CourierZoneKey = "zone_a" | "zone_b" | "zone_c" | "zone_d" | "zone_e" | "unknown"

export const WEIGHT_SLABS: WeightSlab[] = [
  { key: "mini", maxGrams: 500, label: "up to 0.5 kg" },
  { key: "small", maxGrams: 1000, label: "up to 1 kg" },
  { key: "medium", maxGrams: 2000, label: "up to 2 kg" },
  { key: "large", maxGrams: 5000, label: "up to 5 kg" },
]

export const ZONE_PRICING: Record<string, Record<string, number>> = {
  zone_a: { mini: 120, small: 180, medium: 280, large: 450 },
  zone_b: { mini: 150, small: 250, medium: 380, large: 600 },
  zone_c: { mini: 180, small: 320, medium: 480, large: 750 },
  zone_d: { mini: 250, small: 400, medium: 600, large: 950 },
  zone_e: { mini: 320, small: 500, medium: 780, large: 1200 },
}

export const COURIER_ZONES: Record<CourierZoneKey, CourierZone> = {
  zone_a: {
    key: "zone_a",
    label: "Zone A — Nearby districts",
    pricing: { mini: 120, small: 180, medium: 280, large: 450 },
  },
  zone_b: {
    key: "zone_b",
    label: "Zone B — Mid-distance",
    pricing: { mini: 150, small: 250, medium: 380, large: 600 },
  },
  zone_c: {
    key: "zone_c",
    label: "Zone C — Long-distance",
    pricing: { mini: 180, small: 320, medium: 480, large: 750 },
  },
  zone_d: {
    key: "zone_d",
    label: "Zone D — Extended South India",
    pricing: { mini: 250, small: 400, medium: 600, large: 950 },
  },
  zone_e: {
    key: "zone_e",
    label: "Zone E — Far South India",
    pricing: { mini: 320, small: 500, medium: 780, large: 1200 },
  },
  unknown: {
    key: "unknown",
    label: "Outside serviceable area",
    pricing: {},
  },
}

export function normalizeDistrict(input: string): string {
  const map: Record<string, string> = {
    "trichy": "Tiruchirappalli",
    "trichirappalli": "Tiruchirappalli",
    "trichinopoly": "Tiruchirappalli",
    "vellore": "Vellore",
    "coimbatore": "Coimbatore",
    "covai": "Coimbatore",
    "madurai": "Madurai",
    "salem": "Salem",
    "erode": "Erode",
    "tiruppur": "Tiruppur",
    "tirupur": "Tiruppur",
    "namakkal": "Namakkal",
    "karur": "Karur",
    "thanjavur": "Thanjavur",
    "tanjore": "Thanjavur",
    "cuddalore": "Cuddalore",
    "villupuram": "Villupuram",
    "viluppuram": "Villupuram",
    "chengalpattu": "Chengalpattu",
    "kanchipuram": "Kanchipuram",
    "kanchi": "Kanchipuram",
    "tiruvallur": "Tiruvallur",
    "puducherry": "Puducherry",
    "pondicherry": "Puducherry",
    "dindigul": "Dindigul",
    "theni": "Theni",
    "thenkasi": "Tenkasi",
    "tenkasi": "Tenkasi",
    "tirunelveli": "Tirunelveli",
    "thoothukudi": "Thoothukudi",
    "tuticorin": "Thoothukudi",
    "kanyakumari": "Kanyakumari",
    "nagercoil": "Kanyakumari",
    "ramanathapuram": "Ramanathapuram",
    "ramnad": "Ramanathapuram",
    "sivagangai": "Sivagangai",
    "virudhunagar": "Virudhunagar",
    "dharmapuri": "Dharmapuri",
    "krishnagiri": "Krishnagiri",
    "ariyalur": "Ariyalur",
    "perambalur": "Perambalur",
    "nagapattinam": "Nagapattinam",
    "tiruvarur": "Tiruvarur",
    "mayiladuthurai": "Mayiladuthurai",
    "ranipet": "Ranipet",
    "tirupathur": "Tirupathur",
    "tiruvannamalai": "Tiruvannamalai",
    "pudukkottai": "Pudukkottai",
    "kallakurichi": "Kallakurichi",
    "nilgiris": "Nilgiris",
    "bangalore": "Bengaluru Urban",
    "bengaluru": "Bengaluru Urban",
    "mysore": "Mysuru",
    "mangalore": "Dakshina Kannada",
    "mangaluru": "Dakshina Kannada",
    "hubli": "Dharwad",
    "belgaum": "Belagavi",
    "gulbarga": "Kalaburagi",
    "bijapur": "Vijayapura",
    "bellary": "Ballari",
    "shimoga": "Shivamogga",
    "tumkur": "Tumakuru",
    "trivandrum": "Thiruvananthapuram",
    "thiruvananthapuram": "Thiruvananthapuram",
    "kochi": "Ernakulam",
    "ernakulam": "Ernakulam",
    "calicut": "Kozhikode",
    "kozhikode": "Kozhikode",
    "trichur": "Thrissur",
    "thrissur": "Thrissur",
    "alleppey": "Alappuzha",
    "alappuzha": "Alappuzha",
    "vijayawada": "Krishna",
    "guntur": "Guntur",
    "visakhapatnam": "Visakhapatnam",
    "vizag": "Visakhapatnam",
    "kadapa": "YSR",
    "vizianagaram": "Vizianagaram",
    "kurnool": "Kurnool",
    "nellore": "Nellore",
    "chittoor": "Chittoor",
    "tirupati": "Tirupati",
    "hyderabad": "Hyderabad",
    "warangal": "Warangal",
    "nizamabad": "Nizamabad",
    "karimnagar": "Karimnagar",
    "khammam": "Khammam",
  }
  const key = input.trim().toLowerCase()
  return map[key] || input.trim()
}

export function getCourierZone(stateName: string, districtName: string): CourierZone {
  const zoneKey = getZoneForDistrict(stateName, districtName)
  if (zoneKey !== "unknown" && COURIER_ZONES[zoneKey as CourierZoneKey]) {
    return COURIER_ZONES[zoneKey as CourierZoneKey]
  }
  return COURIER_ZONES.unknown
}

export function getWeightSlab(totalGrams: number): WeightSlab {
  for (const slab of WEIGHT_SLABS) {
    if (totalGrams <= slab.maxGrams) return slab
  }
  return { key: "oversize", maxGrams: Infinity, label: "over 5 kg" }
}

export function estimateItemWeight(
  quantityLabel: string | undefined,
  courierWeightGrams: number | undefined | null,
): number {
  if (courierWeightGrams) return courierWeightGrams

  const label = (quantityLabel || "").toLowerCase()
  if (label.includes("500g") || label.includes("0.5kg")) return 500
  if (label.includes("1kg") || label.includes("1 kg")) return 1000
  if (label.includes("2kg") || label.includes("2 kg")) return 2000
  if (label.includes("box of 12") || label.includes("box of 6")) return 500
  if (label.includes("single") || label.includes("piece")) return 250
  return 1000
}

export interface CourierCalcResult {
  delivery_mode: "courier"
  courier_zone: string | null
  total_courier_weight_grams: number
  courier_weight_slab: string
  courier_charge: number | null
  fragile_surcharge: number
  courier_fee_status: "calculated" | "manual_confirmation"
  message: string
}

export function calculateCourierCharge(
  items: { quantityLabel?: string; courierWeightGrams?: number | null; courierFragile?: boolean | null }[],
  quantities: number[],
  destinationState: string,
  destinationDistrict: string,
): CourierCalcResult {
  if (!destinationDistrict || destinationDistrict.trim() === "") {
    return {
      delivery_mode: "courier",
      courier_zone: null,
      total_courier_weight_grams: 0,
      courier_weight_slab: "",
      courier_charge: null,
      fragile_surcharge: 0,
      courier_fee_status: "manual_confirmation",
      message: "Please select your state and district to estimate courier charges.",
    }
  }

  if (!destinationState || destinationState.trim() === "") {
    return {
      delivery_mode: "courier",
      courier_zone: null,
      total_courier_weight_grams: 0,
      courier_weight_slab: "",
      courier_charge: null,
      fragile_surcharge: 0,
      courier_fee_status: "manual_confirmation",
      message: "Please select your state to estimate courier charges.",
    }
  }

  const zone = getCourierZone(destinationState, destinationDistrict)
  let totalWeight = 0
  let hasFragile = false

  for (let i = 0; i < items.length; i++) {
    const itemWeight = estimateItemWeight(items[i].quantityLabel, items[i].courierWeightGrams)
    totalWeight += itemWeight * (quantities[i] || 1)
    if (items[i].courierFragile) hasFragile = true
  }

  const slab = getWeightSlab(totalWeight)
  const fragileSurcharge = hasFragile ? 150 : 0

  if (zone.key === "unknown") {
    return {
      delivery_mode: "courier",
      courier_zone: "unknown",
      total_courier_weight_grams: totalWeight,
      courier_weight_slab: slab.label,
      courier_charge: null,
      fragile_surcharge: fragileSurcharge,
      courier_fee_status: "manual_confirmation",
      message: "Courier charges will be confirmed separately for your location.",
    }
  }

  if (slab.key === "oversize") {
    return {
      delivery_mode: "courier",
      courier_zone: zone.key,
      total_courier_weight_grams: totalWeight,
      courier_weight_slab: slab.label,
      courier_charge: null,
      fragile_surcharge: fragileSurcharge,
      courier_fee_status: "manual_confirmation",
      message: "Courier charge will be confirmed separately for large orders.",
    }
  }

  const zonePricing = ZONE_PRICING[zone.key] || {}
  const baseCharge = zonePricing[slab.key] || 0
  const totalCharge = baseCharge + fragileSurcharge

  return {
    delivery_mode: "courier",
    courier_zone: zone.key,
    total_courier_weight_grams: totalWeight,
    courier_weight_slab: slab.label,
    courier_charge: totalCharge,
    fragile_surcharge: fragileSurcharge,
    courier_fee_status: "calculated",
    message: `Courier charge estimated at ₹${totalCharge} (${slab.label}${hasFragile ? ` + ₹150 fragile packaging` : ""}).`,
  }
}

export function getCourierMessage(result: CourierCalcResult): string {
  return result.message
}
