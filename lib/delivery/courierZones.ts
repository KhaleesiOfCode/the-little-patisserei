export interface WeightSlab {
  key: string
  maxGrams: number
  label: string
}

export interface CourierZone {
  key: string
  label: string
  districts: string[]
  pricing: Record<string, number>
}

export type CourierZoneKey = "zone_a" | "zone_b" | "zone_c" | "unknown"

export const WEIGHT_SLABS: WeightSlab[] = [
  { key: "mini", maxGrams: 500, label: "up to 0.5 kg" },
  { key: "small", maxGrams: 1000, label: "up to 1 kg" },
  { key: "medium", maxGrams: 2000, label: "up to 2 kg" },
  { key: "large", maxGrams: 5000, label: "up to 5 kg" },
]

export const COURIER_ZONES: Record<CourierZoneKey, CourierZone> = {
  zone_a: {
    key: "zone_a",
    label: "Zone A — Nearby districts",
    districts: [
      "Chengalpattu", "Kanchipuram", "Tiruvallur", "Vellore",
      "Villupuram", "Puducherry", "Ranipet", "Tirupathur",
    ],
    pricing: { mini: 120, small: 180, medium: 280, large: 450 },
  },
  zone_b: {
    key: "zone_b",
    label: "Zone B — Mid-distance",
    districts: [
      "Trichy", "Tiruchirappalli", "Salem", "Erode", "Coimbatore",
      "Tiruppur", "Namakkal", "Karur", "Cuddalore", "Thanjavur",
      "Dharmapuri", "Krishnagiri", "Ariyalur", "Perambalur",
      "Nagapattinam", "Tiruvarur", "Mayiladuthurai",
    ],
    pricing: { mini: 150, small: 250, medium: 380, large: 600 },
  },
  zone_c: {
    key: "zone_c",
    label: "Zone C — Long-distance Tamil Nadu",
    districts: [
      "Madurai", "Tirunelveli", "Thoothukudi", "Kanyakumari",
      "Nagercoil", "Ramanathapuram", "Sivagangai", "Virudhunagar",
      "Dindigul", "Theni", "Tenkasi",
    ],
    pricing: { mini: 180, small: 320, medium: 480, large: 750 },
  },
  unknown: {
    key: "unknown",
    label: "Outside Tamil Nadu",
    districts: [],
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
  }
  const key = input.trim().toLowerCase()
  return map[key] || input.trim()
}

export function getCourierZone(districtOrCity: string): CourierZone {
  const normalized = normalizeDistrict(districtOrCity)

  for (const key of ["zone_a", "zone_b", "zone_c"] as CourierZoneKey[]) {
    if (COURIER_ZONES[key].districts.some((d) => d.toLowerCase() === normalized.toLowerCase())) {
      return COURIER_ZONES[key]
    }
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
      message: "Please enter your district to estimate courier charges.",
    }
  }

  const zone = getCourierZone(destinationDistrict)
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

  const baseCharge = zone.pricing[slab.key] || 0
  const totalCharge = baseCharge + fragileSurcharge

  return {
    delivery_mode: "courier",
    courier_zone: zone.key,
    total_courier_weight_grams: totalWeight,
    courier_weight_slab: slab.label,
    courier_charge: totalCharge,
    fragile_surcharge: fragileSurcharge,
    courier_fee_status: "calculated",
    message: `Courier charge estimated at ₹${totalCharge} (${slab.label}${hasFragile ? ` + ₹150 fragile packaging` : ""}). Final charge may be adjusted after booking.`,
  }
}

export const TAMIL_NADU_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
  "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Puducherry",
  "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivagangai",
  "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli",
  "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai",
  "Tiruvarur", "Vellore", "Villupuram", "Virudhunagar",
]

export function getCourierMessage(
  result: CourierCalcResult,
  isTamilNadu: boolean,
): string {
  if (!isTamilNadu) {
    return "Delivery charges will be confirmed separately for your location."
  }
  return result.message
}
