export interface DeliveryZone {
  key: string
  label: string
  fee: number | null
  pincodes: string[]
  areas: string[]
}

export type ZoneKey = "zone_1" | "zone_2" | "zone_3" | "unsupported"

export const BAKERY_LOCATION = {
  area: "Arumbakkam",
  pincode: "600106",
}

export const CHENNAI_ZONES: Record<ZoneKey, DeliveryZone> = {
  zone_1: {
    key: "zone_1",
    label: "Chennai City / Core Delivery",
    fee: 99,
    pincodes: [
      "600001", "600002", "600003", "600005", "600007",
      "600008", "600010", "600011", "600012", "600013",
      "600014", "600015", "600016", "600017", "600018",
      "600019", "600021", "600022", "600023", "600024",
      "600025", "600026", "600028", "600029", "600030",
      "600031", "600032", "600034", "600035", "600044",
      "600045", "600046", "600050", "600051", "600053",
      "600054", "600058", "600064", "600066", "600067",
      "600074", "600075", "600078", "600082", "600083",
      "600084", "600085", "600086", "600087", "600088",
      "600089", "600090", "600091", "600092", "600093",
      "600094", "600095", "600104", "600106", "600107",
      "600004", "600009", "600020", "600036", "600040",
      "600041", "600042", "600048", "600056", "600060",
      "600061", "600062", "600063", "600065", "600069",
      "600073", "600076", "600077", "600081", "600096",
      "600097", "600098", "600099", "600100", "600101",
      "600102", "600108", "600117",
    ],
    areas: [
      "Adambakkam", "Adyar", "Alandur", "Alapakkam",
      "Alwarpet", "Alwarthirunagar", "Ambattur",
      "Aminjikarai", "Anna Nagar", "Arumbakkam",
      "Ashok Nagar", "Ayanavaram", "Basin Bridge",
      "Besant Nagar", "Chetpet", "Chintadripet",
      "Choolaimedu", "Egmore", "Ekkatuthangal",
      "Flowers Road", "George Town", "Guindy",
      "Ice House", "ICF", "Iyyappanthal", "Karambakkam",
      "Kellys", "Kilpauk", "KK Nagar", "Kodambakkam",
      "Kolathur", "Kotturpuram", "Koyambedu",
      "Maduravoyal", "Mambalam", "Manapakkam",
      "Meenambakkam", "Mint Street", "Mogappair",
      "Mylapore", "Nandambakkam", "Nanganallur",
      "Nungambakkam", "Otteri", "Park Town", "Pattalam",
      "Perambur", "Perungudi", "Purasawalkam",
      "Ramapuram", "Royapettah", "Royapuram",
      "Saidapet", "Saligramam", "Shenoy Nagar",
      "Sholinganallur", "Siruseri", "Sowcarpet",
      "St Thomas Mount", "T Nagar", "Taramani",
      "Teynampet", "Thoraipakkam", "Thousand Lights",
      "Tondiarpet", "Triplicane", "Vadapalani",
      "Valasaravakkam", "Vanagaram", "Velachery",
      "Vepery", "Virugambakkam", "Vyasarpadi",
      "Washermanpet", "West Mambalam",
    ],
  },
  zone_2: {
    key: "zone_2",
    label: "Near Chennai Suburbs",
    fee: 149,
    pincodes: [
      "600033", "600037", "600038", "600039", "600043",
      "600047", "600049", "600052", "600055", "600057",
      "600059", "600068", "600070", "600071", "600072",
      "600109", "600110", "600113", "600115", "600116",
      "600118", "600119", "600120", "600122", "600123",
      "600124", "600125", "600126", "600127", "600128",
      "600129", "600130",
    ],
    areas: [
      "Avadi", "Chitlapakkam", "Chromepet",
      "Hastinapuram", "Kattuppakkam", "Kelambakkam",
      "Korattur", "Kovilambakkam", "Kundrathur",
      "Madambakkam", "Madipakkam", "Mangadu",
      "Medavakkam", "Mudichur", "Navalur",
      "Nazerathpettai", "Pallavaram", "Pallikaranai",
      "Pammal", "Pattabiram", "Perungalathur",
      "Poonamallee", "Porur", "Puzhal",
      "Puzhuthivakkam", "Redhills", "Selaiyur",
      "Semmancheri", "Surapet", "Tambaram",
      "Thalambur", "Thirumullaivoyal", "Thiruporur",
      "Thiruverkadu", "Urapakkam", "Vandalur",
    ],
  },
  zone_3: {
    key: "zone_3",
    label: "Extended Chennai / CMA",
    fee: 299,
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
      "Chengalpattu", "Guduvancheri", "Guduvanchery",
      "Kanchipuram", "Kazhipattur", "Mahabalipuram",
      "Mahindra World City", "Maraimalai Nagar",
      "Minjur", "Oragadam", "Padappai",
      "Padur", "Ponneri", "Singaperumal Koil",
      "Siruseri", "Sriperumbudur", "Thaiyur",
      "Tiruvallur",
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
  const keys: ZoneKey[] = ["zone_1", "zone_2", "zone_3", "unsupported"]
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
  for (const key of ["zone_1", "zone_2", "zone_3"] as ZoneKey[]) {
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
  if (zone.key === "zone_3") return `Delivery fee: ₹${zone.fee} — Extended Chennai / CMA`
  if (!zone.fee) return "This area needs manual confirmation. We will contact you."
  return `Delivery fee: ₹${zone.fee}`
}
