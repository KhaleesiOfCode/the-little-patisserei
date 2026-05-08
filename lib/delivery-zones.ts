export interface DeliveryZone {
  key: string
  label: string
  fee: number | null
  pincodes: string[]
  areas: string[]
}

export type ZoneKey = "zone_a" | "zone_b" | "zone_c" | "zone_d" | "zone_e" | "unsupported"

export const BAKERY_LOCATION = {
  area: "Arumbakkam",
  pincode: "600106",
}

export const CHENNAI_ZONES: Record<ZoneKey, DeliveryZone> = {
  zone_a: {
    key: "zone_a",
    label: "Zone A (0–5 km)",
    fee: 99,
    pincodes: [
      "600010", "600026", "600034", "600053", "600078",
      "600093", "600106",
    ],
    areas: [
      "Arumbakkam", "Saligramam", "Vadapalani", "Shenoy Nagar",
      "Aminjikarai", "Choolaimedu", "Kilpauk", "KK Nagar",
      "Anna Nagar", "Virugambakkam", "Alwarthirunagar",
    ],
  },
  zone_b: {
    key: "zone_b",
    label: "Zone B (5–10 km)",
    fee: 149,
    pincodes: [
      "600001", "600002", "600003", "600005", "600007",
      "600008", "600015", "600017", "600018", "600021",
      "600024", "600025", "600028", "600030", "600031",
      "600032", "600035", "600040", "600044", "600045",
      "600050", "600051", "600054", "600058", "600060",
      "600061", "600064", "600066", "600068", "600070",
      "600071", "600072", "600074", "600075", "600079",
      "600080", "600081", "600082", "600083", "600084",
      "600085", "600086", "600087", "600088", "600089",
      "600090", "600091", "600092", "600094", "600095",
    ],
    areas: [
      "Kodambakkam", "Ashok Nagar", "Nungambakkam", "Chetpet",
      "Egmore", "T Nagar", "Mambalam", "Royapettah",
      "Thousand Lights", "Teynampet", "Purasawalkam",
      "Chintadripet", "Maduravoyal", "Perambur", "Triplicane",
      "Sowcarpet", "Washermanpet", "Mogappair",
      "George Town", "Park Town", "Flowers Road",
      "Ice House", "Mint Street", "Vepery", "Kellys",
      "Ayanavaram", "Otteri", "Pattalam",
    ],
  },
  zone_c: {
    key: "zone_c",
    label: "Zone C (10–20 km)",
    fee: 249,
    pincodes: [
      "600004", "600006", "600009", "600011", "600012",
      "600013", "600014", "600016", "600019", "600020",
      "600029", "600033", "600036", "600041", "600042",
      "600046", "600048", "600056", "600062", "600063",
      "600065", "600067", "600069", "600073", "600076",
      "600077", "600096", "600097", "600098", "600099",
      "600100", "600101", "600102", "600107", "600108",
      "600117", "600118",
    ],
    areas: [
      "Saidapet", "Guindy", "Mylapore", "Kotturpuram",
      "Alwarpet", "St Thomas Mount", "Porur", "Nandambakkam",
      "Velachery", "Adyar", "Ambattur", "Ramapuram",
      "Manapakkam", "Iyyappanthangal", "Meenambakkam",
      "Poonamallee", "Pallavaram", "Kotivakkam",
      "Thoraipakkam", "Chromepet", "Alandur",
      "Adambakkam", "West Mambalam", "Tiruvallur",
    ],
  },
  zone_d: {
    key: "zone_d",
    label: "Zone D (20–30 km)",
    fee: 399,
    pincodes: [
      "600037", "600038", "600039", "600043", "600047",
      "600049", "600055", "600057", "600059", "600109",
      "600110", "600111", "600112", "600113", "600114",
      "600115", "600116", "600119", "600120", "600121",
      "600122", "600123", "600124", "600125", "600126",
      "600127", "600128", "600129", "600130", "600131",
      "600132", "600133",
    ],
    areas: [
      "Avadi", "Perungudi", "Medavakkam", "Tambaram",
      "Sholinganallur", "Pallikaranai", "Kovilambakkam",
      "Mudichur", "Thalambur", "Hastinapuram",
      "Urapakkam", "Vandalur", "Kundrathur",
      "Nazerathpettai", "Pattabiram", "Thirumullaivoyal",
      "Korattur", "Kolathur",
    ],
  },
  zone_e: {
    key: "zone_e",
    label: "Zone E (30+ km — manual)",
    fee: null,
    pincodes: [
      "600103", "600128", "600130", "601201", "601202",
      "601203", "602001", "602002", "602003",
      "603101", "603102", "603103", "603104", "603105",
      "603106", "603107", "603108", "603109", "603110",
      "603111", "603112", "603201", "603202", "603203",
      "603204", "603301", "603302", "603303", "603304",
      "603305", "603306", "603307", "603308", "603309",
      "603310", "603311", "603312", "603313", "603314",
      "603315", "603316", "603319", "603320", "603321",
    ],
    areas: [
      "Padur", "Siruseri", "Kelambakkam", "Mahabalipuram",
      "Guduvancheri", "Chengalpattu", "Maraimalai Nagar",
      "Navalur", "Thaiyur", "Kazhipattur",
    ],
  },
  unsupported: {
    key: "unsupported",
    label: "Outside Chennai",
    fee: null,
    pincodes: [],
    areas: [],
  },
}

let _areaCache: { area: string; zoneKey: ZoneKey }[] | null = null

function buildAreaIndex(): { area: string; zoneKey: ZoneKey }[] {
  if (_areaCache) return _areaCache
  const keys: ZoneKey[] = ["zone_a", "zone_b", "zone_c", "zone_d", "zone_e", "unsupported"]
  _areaCache = []
  for (const key of keys) {
    for (const area of CHENNAI_ZONES[key].areas) {
      _areaCache.push({ area: area.toLowerCase(), zoneKey: key })
    }
  }
  return _areaCache
}

export function getZoneByAreaName(areaName: string): DeliveryZone | null {
  const name = areaName.trim().toLowerCase()
  if (!name) return null

  const index = buildAreaIndex()

  let best: { zoneKey: ZoneKey; score: number } | null = null
  for (const entry of index) {
    if (entry.area.includes(name) || name.includes(entry.area)) {
      const score = Math.min(entry.area.length, name.length) /
        Math.max(entry.area.length, name.length)
      if (!best || score > best.score) {
        best = { zoneKey: entry.zoneKey, score }
      }
    }
  }

  if (best && best.score > 0.3) {
    return CHENNAI_ZONES[best.zoneKey]
  }
  return null
}

export function getDeliveryZone(city: string, pincode: string, areaName?: string): {
  zone: DeliveryZone
  isChennai: boolean
  isSupported: boolean
} {
  const cityLower = city.trim().toLowerCase()
  const pin = pincode.trim()

  const isChennai = cityLower === "chennai" || pin.startsWith("600")

  if (!isChennai) {
    return { zone: CHENNAI_ZONES.unsupported, isChennai: false, isSupported: false }
  }

  // Check by pincode first
  for (const key of ["zone_a", "zone_b", "zone_c", "zone_d", "zone_e"] as ZoneKey[]) {
    if (CHENNAI_ZONES[key].pincodes.includes(pin)) {
      return { zone: CHENNAI_ZONES[key], isChennai: true, isSupported: true }
    }
  }

  // Fallback to area name
  if (areaName) {
    const zone = getZoneByAreaName(areaName)
    if (zone && zone.fee !== undefined) {
      return { zone, isChennai: true, isSupported: zone.fee !== null }
    }
  }

  return { zone: CHENNAI_ZONES.unsupported, isChennai: true, isSupported: false }
}

export function getDeliveryFeeMessage(zone: DeliveryZone, isChennai: boolean): string {
  if (!isChennai) return "Courier orders outside Chennai require at least 48 hours. Courier charges will be confirmed separately after booking."
  if (!zone.fee) return "This area needs manual confirmation. We will contact you."
  return `Delivery fee: ₹${zone.fee}`
}
