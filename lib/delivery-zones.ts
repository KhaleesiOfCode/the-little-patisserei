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
      "600010", "600026", "600029", "600030", "600032",
      "600034", "600046", "600050", "600051", "600053",
      "600054", "600078", "600093", "600106",
    ],
    areas: [
      "Alwarthirunagar", "Aminjikarai", "Anna Nagar",
      "Arumbakkam", "Choolaimedu", "Kilpauk", "KK Nagar",
      "Koyambedu", "Saligramam", "Shenoy Nagar",
      "Vadapalani", "Valasaravakkam", "Virugambakkam",
    ],
  },
  zone_b: {
    key: "zone_b",
    label: "Zone B (5–10 km)",
    fee: 149,
    pincodes: [
      "600001", "600002", "600003", "600005", "600007",
      "600008", "600011", "600012", "600013", "600014",
      "600015", "600016", "600017", "600018", "600019",
      "600021", "600022", "600023", "600024", "600025",
      "600028", "600031", "600035", "600044", "600045",
      "600058", "600064", "600066", "600067", "600074",
      "600075", "600082", "600083", "600084", "600085",
      "600086", "600087", "600088", "600089", "600090",
      "600091", "600092", "600094", "600095", "600104",
      "600107",
    ],
    areas: [
      "Alapakkam", "Ashok Nagar", "Ayanavaram",
      "Basin Bridge", "Chetpet", "Chintadripet",
      "Egmore", "Ekkatuthangal", "Flowers Road",
      "George Town", "Ice House", "ICF", "Karambakkam",
      "Kellys", "Kodambakkam", "Kolathur",
      "Maduravoyal", "Mambalam", "Mint Street",
      "Mogappair", "Nungambakkam", "Otteri", "Park Town",
      "Pattalam", "Perambur", "Porur", "Purasawalkam",
      "Ramapuram", "Royapettah", "Royapuram",
      "Sowcarpet", "T Nagar", "Teynampet",
      "Thousand Lights", "Tondiarpet", "Triplicane",
      "Vanagaram", "Vepery", "Vyasarpadi",
      "Washermanpet", "West Mambalam",
    ],
  },
  zone_c: {
    key: "zone_c",
    label: "Zone C (10–20 km)",
    fee: 249,
    pincodes: [
      "600004", "600006", "600009", "600020", "600033",
      "600036", "600040", "600041", "600042", "600048",
      "600056", "600060", "600061", "600062", "600063",
      "600065", "600069", "600073", "600076", "600077",
      "600081", "600096", "600097", "600098", "600099",
      "600100", "600101", "600102", "600108", "600117",
    ],
    areas: [
      "Adambakkam", "Adyar", "Alandur",
      "Alwarpet", "Ambattur", "Chromepet",
      "Guindy", "Iyyappanthal", "Kotturpuram",
      "Manapakkam", "Meenambakkam", "Mylapore",
      "Nandambakkam", "Nanganallur", "Pallavaram",
      "Poonamallee", "Puzhal", "Saidapet",
      "St Thomas Mount", "Taramani", "Thoraipakkam",
      "Tiruvallur", "Velachery",
    ],
  },
  zone_d: {
    key: "zone_d",
    label: "Zone D (20–30 km)",
    fee: 399,
    pincodes: [
      "600037", "600038", "600039", "600043", "600047",
      "600049", "600052", "600055", "600057", "600059",
      "600068", "600070", "600071", "600072", "600109",
      "600110", "600113", "600115", "600116", "600118",
      "600119", "600120", "600122", "600123", "600124",
      "600125", "600126", "600127", "600128", "600129",
      "600130",
    ],
    areas: [
      "Avadi", "Chitlapakkam", "Hastinapuram",
      "Kattuppakkam", "Kolathur", "Korattur",
      "Kovilambakkam", "Kundrathur", "Madambakkam",
      "Madipakkam", "Medavakkam", "Mudichur",
      "Nazerathpettai", "Pallikaranai", "Pammal",
      "Pattabiram", "Perungalathur", "Perungudi",
      "Puzhuthivakkam", "Redhills", "Selaiyur",
      "Semmancheri", "Sholinganallur", "Siruseri",
      "Surapet", "Tambaram", "Thalambur",
      "Thirumullaivoyal", "Thiruporur", "Urapakkam",
      "Vandalur",
    ],
  },
  zone_e: {
    key: "zone_e",
    label: "Zone E (30+ km — manual)",
    fee: null,
    pincodes: [
      "600103", "601201", "601202",
      "601203", "602001", "602002", "602003",
      "603001", "603002", "603003", "603101",
      "603102", "603103", "603104", "603105",
      "603106", "603107", "603108", "603109",
      "603110", "603111", "603112", "603127",
      "603201", "603202", "603203", "603204",
      "603209", "603210", "603211", "603301",
      "603302", "603303", "603304", "603305",
      "603306", "603307", "603308", "603309",
      "603310", "603311", "603312", "603313",
      "603314", "603319",
    ],
    areas: [
      "Chengalpattu", "Guduvancheri", "Kazhipattur",
      "Kelambakkam", "Mahabalipuram", "Maraimalai Nagar",
      "Navalur", "Padur", "Siruseri",
      "Thaiyur",
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
