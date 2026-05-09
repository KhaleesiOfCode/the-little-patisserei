export interface SouthIndiaDistrict {
  name: string
  zone: string
}

export interface SouthIndiaState {
  name: string
  districts: SouthIndiaDistrict[]
}

export const SOUTH_INDIA_STATES: SouthIndiaState[] = [
  {
    name: "Tamil Nadu",
    districts: [
      { name: "Chengalpattu", zone: "zone_a" },
      { name: "Kanchipuram", zone: "zone_a" },
      { name: "Puducherry", zone: "zone_a" },
      { name: "Ranipet", zone: "zone_a" },
      { name: "Tirupathur", zone: "zone_a" },
      { name: "Tiruvallur", zone: "zone_a" },
      { name: "Vellore", zone: "zone_a" },
      { name: "Villupuram", zone: "zone_a" },
      { name: "Ariyalur", zone: "zone_b" },
      { name: "Coimbatore", zone: "zone_b" },
      { name: "Cuddalore", zone: "zone_b" },
      { name: "Dharmapuri", zone: "zone_b" },
      { name: "Erode", zone: "zone_b" },
      { name: "Karur", zone: "zone_b" },
      { name: "Krishnagiri", zone: "zone_b" },
      { name: "Mayiladuthurai", zone: "zone_b" },
      { name: "Nagapattinam", zone: "zone_b" },
      { name: "Namakkal", zone: "zone_b" },
      { name: "Perambalur", zone: "zone_b" },
      { name: "Salem", zone: "zone_b" },
      { name: "Thanjavur", zone: "zone_b" },
      { name: "Tiruchirappalli", zone: "zone_b" },
      { name: "Tiruppur", zone: "zone_b" },
      { name: "Tiruvarur", zone: "zone_b" },
      { name: "Dindigul", zone: "zone_c" },
      { name: "Kallakurichi", zone: "zone_c" },
      { name: "Kanyakumari", zone: "zone_c" },
      { name: "Madurai", zone: "zone_c" },
      { name: "Nilgiris", zone: "zone_c" },
      { name: "Pudukkottai", zone: "zone_c" },
      { name: "Ramanathapuram", zone: "zone_c" },
      { name: "Sivagangai", zone: "zone_c" },
      { name: "Tenkasi", zone: "zone_c" },
      { name: "Theni", zone: "zone_c" },
      { name: "Thoothukudi", zone: "zone_c" },
      { name: "Tirunelveli", zone: "zone_c" },
      { name: "Tiruvannamalai", zone: "zone_c" },
      { name: "Virudhunagar", zone: "zone_c" },
    ],
  },
  {
    name: "Karnataka",
    districts: [
      { name: "Bengaluru Urban", zone: "zone_b" },
      { name: "Bengaluru Rural", zone: "zone_b" },
      { name: "Chikkaballapura", zone: "zone_b" },
      { name: "Kolar", zone: "zone_b" },
      { name: "Ramanagara", zone: "zone_b" },
      { name: "Chamarajanagara", zone: "zone_c" },
      { name: "Chikkamagaluru", zone: "zone_c" },
      { name: "Chitradurga", zone: "zone_c" },
      { name: "Davanagere", zone: "zone_c" },
      { name: "Hassan", zone: "zone_c" },
      { name: "Kodagu", zone: "zone_c" },
      { name: "Mandya", zone: "zone_c" },
      { name: "Mysuru", zone: "zone_c" },
      { name: "Shivamogga", zone: "zone_c" },
      { name: "Tumakuru", zone: "zone_c" },
      { name: "Ballari", zone: "zone_d" },
      { name: "Belagavi", zone: "zone_d" },
      { name: "Dakshina Kannada", zone: "zone_d" },
      { name: "Dharwad", zone: "zone_d" },
      { name: "Gadag", zone: "zone_d" },
      { name: "Haveri", zone: "zone_d" },
      { name: "Koppala", zone: "zone_d" },
      { name: "Raichur", zone: "zone_d" },
      { name: "Udupi", zone: "zone_d" },
      { name: "Uttara Kannada", zone: "zone_d" },
      { name: "Vijayanagara", zone: "zone_d" },
      { name: "Bagalkote", zone: "zone_e" },
      { name: "Bidar", zone: "zone_e" },
      { name: "Kalaburagi", zone: "zone_e" },
      { name: "Vijayapura", zone: "zone_e" },
      { name: "Yadgiri", zone: "zone_e" },
    ],
  },
  {
    name: "Kerala",
    districts: [
      { name: "Palakkad", zone: "zone_c" },
      { name: "Malappuram", zone: "zone_c" },
      { name: "Wayanad", zone: "zone_c" },
      { name: "Alappuzha", zone: "zone_d" },
      { name: "Ernakulam", zone: "zone_d" },
      { name: "Idukki", zone: "zone_d" },
      { name: "Kannur", zone: "zone_d" },
      { name: "Kasaragod", zone: "zone_d" },
      { name: "Kollam", zone: "zone_d" },
      { name: "Kottayam", zone: "zone_d" },
      { name: "Kozhikode", zone: "zone_d" },
      { name: "Pathanamthitta", zone: "zone_d" },
      { name: "Thiruvananthapuram", zone: "zone_d" },
      { name: "Thrissur", zone: "zone_d" },
    ],
  },
  {
    name: "Andhra Pradesh",
    districts: [
      { name: "Chittoor", zone: "zone_b" },
      { name: "Nellore", zone: "zone_b" },
      { name: "Tirupati", zone: "zone_b" },
      { name: "Annamayya", zone: "zone_c" },
      { name: "Ananthapuramu", zone: "zone_c" },
      { name: "Bapatla", zone: "zone_c" },
      { name: "Guntur", zone: "zone_c" },
      { name: "Krishna", zone: "zone_c" },
      { name: "Kurnool", zone: "zone_c" },
      { name: "Nandyal", zone: "zone_c" },
      { name: "NTR", zone: "zone_c" },
      { name: "Palnadu", zone: "zone_c" },
      { name: "Prakasam", zone: "zone_c" },
      { name: "Sri Satyasai", zone: "zone_c" },
      { name: "YSR", zone: "zone_c" },
      { name: "Alluri Sitharama Raju", zone: "zone_d" },
      { name: "Anakapalli", zone: "zone_d" },
      { name: "East Godavari", zone: "zone_d" },
      { name: "Eluru", zone: "zone_d" },
      { name: "Kakinada", zone: "zone_d" },
      { name: "Konaseema", zone: "zone_d" },
      { name: "Parvathipuram Manyam", zone: "zone_d" },
      { name: "Srikakulam", zone: "zone_d" },
      { name: "Visakhapatnam", zone: "zone_d" },
      { name: "Vizianagaram", zone: "zone_d" },
      { name: "West Godavari", zone: "zone_d" },
    ],
  },
  {
    name: "Telangana",
    districts: [
      { name: "Hyderabad", zone: "zone_c" },
      { name: "Medchal", zone: "zone_c" },
      { name: "Ranga Reddy", zone: "zone_c" },
      { name: "Sangareddy", zone: "zone_c" },
      { name: "Vikarabad", zone: "zone_c" },
      { name: "Bhadradri Kothagudem", zone: "zone_c" },
      { name: "Khammam", zone: "zone_c" },
      { name: "Mahabubnagar", zone: "zone_c" },
      { name: "Nagarkurnool", zone: "zone_c" },
      { name: "Nalgonda", zone: "zone_c" },
      { name: "Suryapet", zone: "zone_c" },
      { name: "Wanaparthy", zone: "zone_c" },
      { name: "Yadadri Bhuvanagiri", zone: "zone_c" },
      { name: "Hanamkonda", zone: "zone_d" },
      { name: "Jagtial", zone: "zone_d" },
      { name: "Jangaon", zone: "zone_d" },
      { name: "Jogulamba Gadwal", zone: "zone_d" },
      { name: "Kamareddy", zone: "zone_d" },
      { name: "Karimnagar", zone: "zone_d" },
      { name: "Mahabubabad", zone: "zone_d" },
      { name: "Medak", zone: "zone_d" },
      { name: "Mulugu", zone: "zone_d" },
      { name: "Narayanpet", zone: "zone_d" },
      { name: "Nizamabad", zone: "zone_d" },
      { name: "Peddapalli", zone: "zone_d" },
      { name: "Rajanna Sircilla", zone: "zone_d" },
      { name: "Siddipet", zone: "zone_d" },
      { name: "Warangal", zone: "zone_d" },
      { name: "Adilabad", zone: "zone_e" },
      { name: "Jayashankar Bhupalpally", zone: "zone_e" },
      { name: "Komaram Bheem Asifabad", zone: "zone_e" },
      { name: "Mancherial", zone: "zone_e" },
      { name: "Nirmal", zone: "zone_e" },
    ],
  },
]

const DISTRICT_CITIES: Record<string, string[]> = {
  "Tamil Nadu::Chengalpattu": ["Chengalpattu", "Tambaram", "Maraimalai Nagar", "Guduvancheri"],
  "Tamil Nadu::Kanchipuram": ["Kanchipuram", "Sriperumbudur", "Oragadam"],
  "Tamil Nadu::Tiruvallur": ["Tiruvallur", "Avadi", "Poonamallee"],
  "Tamil Nadu::Vellore": ["Vellore", "Katpadi"],
  "Tamil Nadu::Villupuram": ["Villupuram", "Tindivanam", "Gingee"],
  "Tamil Nadu::Coimbatore": ["Coimbatore", "Pollachi", "Mettupalayam"],
  "Tamil Nadu::Cuddalore": ["Cuddalore", "Chidambaram", "Virudhachalam"],
  "Tamil Nadu::Dindigul": ["Dindigul", "Kodaikanal"],
  "Tamil Nadu::Kanyakumari": ["Nagercoil", "Kanyakumari", "Marthandam", "Kuzhithurai"],
  "Tamil Nadu::Krishnagiri": ["Krishnagiri", "Hosur"],
  "Tamil Nadu::Nagapattinam": ["Nagapattinam", "Velankanni"],
  "Tamil Nadu::Nilgiris": ["Udhagamandalam", "Coonoor", "Kotagiri"],
  "Tamil Nadu::Ramanathapuram": ["Ramanathapuram", "Rameswaram"],
  "Tamil Nadu::Salem": ["Salem", "Attur"],
  "Tamil Nadu::Thanjavur": ["Thanjavur", "Kumbakonam", "Pattukkottai"],
  "Tamil Nadu::Thoothukudi": ["Thoothukudi", "Kovilpatti", "Kayalpattinam"],
  "Tamil Nadu::Tiruchirappalli": ["Tiruchirappalli", "Srirangam", "Lalgudi"],
  "Tamil Nadu::Tirunelveli": ["Tirunelveli"],
  "Tamil Nadu::Tiruppur": ["Tiruppur"],
  "Tamil Nadu::Virudhunagar": ["Virudhunagar", "Sivakasi", "Rajapalayam", "Sattur"],
  "Tamil Nadu::Madurai": ["Madurai"],
  "Tamil Nadu::Tenkasi": ["Tenkasi", "Kadayanallur", "Sankarankovil"],
  "Tamil Nadu::Theni": ["Theni", "Bodinayakkanur"],
  "Tamil Nadu::Puducherry": ["Puducherry"],
  "Karnataka::Bengaluru Urban": ["Bengaluru", "Yelahanka", "Kengeri"],
  "Karnataka::Bengaluru Rural": ["Doddaballapura", "Nelamangala"],
  "Karnataka::Mysuru": ["Mysuru", "Srirangapatna"],
  "Karnataka::Belagavi": ["Belagavi"],
  "Karnataka::Dharwad": ["Hubballi", "Dharwad"],
  "Karnataka::Dakshina Kannada": ["Mangaluru"],
  "Karnataka::Kalaburagi": ["Kalaburagi"],
  "Karnataka::Ballari": ["Ballari", "Hospet"],
  "Karnataka::Shivamogga": ["Shivamogga"],
  "Karnataka::Tumakuru": ["Tumakuru"],
  "Karnataka::Udupi": ["Udupi", "Manipal"],
  "Kerala::Thiruvananthapuram": ["Thiruvananthapuram"],
  "Kerala::Ernakulam": ["Kochi", "Ernakulam", "Aluva", "Muvattupuzha"],
  "Kerala::Kozhikode": ["Kozhikode", "Koyilandy"],
  "Kerala::Thrissur": ["Thrissur"],
  "Kerala::Kollam": ["Kollam"],
  "Kerala::Alappuzha": ["Alappuzha"],
  "Kerala::Palakkad": ["Palakkad"],
  "Kerala::Kannur": ["Kannur", "Taliparamba"],
  "Kerala::Kottayam": ["Kottayam", "Changanassery"],
  "Kerala::Malappuram": ["Malappuram", "Tirur", "Manjeri"],
  "Kerala::Kasaragod": ["Kasaragod"],
  "Kerala::Idukki": ["Idukki"],
  "Kerala::Pathanamthitta": ["Pathanamthitta", "Tiruvalla"],
  "Kerala::Wayanad": ["Kalpetta", "Sultan Bathery"],
  "Andhra Pradesh::Visakhapatnam": ["Visakhapatnam"],
  "Andhra Pradesh::Krishna": ["Vijayawada"],
  "Andhra Pradesh::Guntur": ["Guntur", "Tenali"],
  "Andhra Pradesh::Chittoor": ["Chittoor", "Tirupati"],
  "Andhra Pradesh::Nellore": ["Nellore"],
  "Andhra Pradesh::Kurnool": ["Kurnool"],
  "Andhra Pradesh::East Godavari": ["Kakinada", "Rajahmundry"],
  "Andhra Pradesh::West Godavari": ["Eluru", "Bhimavaram"],
  "Andhra Pradesh::Ananthapuramu": ["Anantapur"],
  "Andhra Pradesh::YSR": ["Kadapa"],
  "Andhra Pradesh::Srikakulam": ["Srikakulam"],
  "Andhra Pradesh::Vizianagaram": ["Vizianagaram"],
  "Andhra Pradesh::Prakasam": ["Ongole"],
  "Andhra Pradesh::Tirupati": ["Tirupati"],
  "Telangana::Hyderabad": ["Hyderabad"],
  "Telangana::Warangal": ["Warangal", "Hanamkonda"],
  "Telangana::Karimnagar": ["Karimnagar"],
  "Telangana::Nizamabad": ["Nizamabad"],
  "Telangana::Khammam": ["Khammam"],
  "Telangana::Ranga Reddy": ["Hyderabad", "Shamshabad"],
  "Telangana::Medchal": ["Medchal"],
  "Telangana::Nalgonda": ["Nalgonda"],
  "Telangana::Siddipet": ["Siddipet"],
  "Telangana::Mahabubnagar": ["Mahabubnagar"],
  "Telangana::Adilabad": ["Adilabad"],
  "Telangana::Bhadradri Kothagudem": ["Kothagudem"],
}

export function getCitiesForDistrict(stateName: string, districtName: string): string[] {
  const key = `${stateName}::${districtName}`
  return DISTRICT_CITIES[key] || [districtName]
}

export function getStateForDistrict(districtName: string): string | null {
  for (const state of SOUTH_INDIA_STATES) {
    for (const d of state.districts) {
      if (d.name.toLowerCase() === districtName.trim().toLowerCase()) {
        return state.name
      }
    }
  }
  return null
}

export function getDistrictsForState(stateName: string): SouthIndiaDistrict[] {
  const state = SOUTH_INDIA_STATES.find(
    (s) => s.name.toLowerCase() === stateName.trim().toLowerCase()
  )
  return state?.districts ?? []
}

export function getZoneForDistrict(stateName: string, districtName: string): string {
  const state = SOUTH_INDIA_STATES.find(
    (s) => s.name.toLowerCase() === stateName.trim().toLowerCase()
  )
  if (!state) return "unknown"
  const district = state.districts.find(
    (d) => d.name.toLowerCase() === districtName.trim().toLowerCase()
  )
  return district?.zone ?? "unknown"
}
