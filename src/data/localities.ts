export type Locality = { city: string; zone: string; name: string };

// Structured locality catalog. Extend freely (or replace with a DB fetch later).
export const LOCALITIES: Locality[] = [
  // Bangalore - North
  { city: "Bangalore", zone: "North Bangalore", name: "Hebbal" },
  { city: "Bangalore", zone: "North Bangalore", name: "Yelahanka" },
  { city: "Bangalore", zone: "North Bangalore", name: "Sahakar Nagar" },
  { city: "Bangalore", zone: "North Bangalore", name: "RT Nagar" },
  { city: "Bangalore", zone: "North Bangalore", name: "Sanjay Nagar" },
  { city: "Bangalore", zone: "North Bangalore", name: "Devanahalli" },
  { city: "Bangalore", zone: "North Bangalore", name: "Jakkur" },
  { city: "Bangalore", zone: "North Bangalore", name: "Thanisandra" },

  // Bangalore - West
  { city: "Bangalore", zone: "West Bangalore", name: "Rajajinagar" },
  { city: "Bangalore", zone: "West Bangalore", name: "Malleshwaram" },
  { city: "Bangalore", zone: "West Bangalore", name: "Vijayanagar" },
  { city: "Bangalore", zone: "West Bangalore", name: "Nagarbhavi" },
  { city: "Bangalore", zone: "West Bangalore", name: "Kengeri" },
  { city: "Bangalore", zone: "West Bangalore", name: "RR Nagar" },
  { city: "Bangalore", zone: "West Bangalore", name: "Yeshwanthpur" },
  { city: "Bangalore", zone: "West Bangalore", name: "Peenya" },
  { city: "Bangalore", zone: "West Bangalore", name: "Basaveshwaranagar" },

  // Bangalore - East
  { city: "Bangalore", zone: "East Bangalore", name: "Whitefield" },
  { city: "Bangalore", zone: "East Bangalore", name: "KR Puram" },
  { city: "Bangalore", zone: "East Bangalore", name: "Marathahalli" },
  { city: "Bangalore", zone: "East Bangalore", name: "Mahadevapura" },
  { city: "Bangalore", zone: "East Bangalore", name: "Kadugodi" },
  { city: "Bangalore", zone: "East Bangalore", name: "Varthur" },
  { city: "Bangalore", zone: "East Bangalore", name: "CV Raman Nagar" },
  { city: "Bangalore", zone: "East Bangalore", name: "Ramamurthy Nagar" },
  { city: "Bangalore", zone: "East Bangalore", name: "Kalyan Nagar" },
  { city: "Bangalore", zone: "East Bangalore", name: "Kammanahalli" },
  { city: "Bangalore", zone: "East Bangalore", name: "ITPL" },

  // Bangalore - Central
  { city: "Bangalore", zone: "Central Bangalore", name: "Indiranagar" },
  { city: "Bangalore", zone: "Central Bangalore", name: "MG Road" },
  { city: "Bangalore", zone: "Central Bangalore", name: "Brigade Road" },
  { city: "Bangalore", zone: "Central Bangalore", name: "Ulsoor" },
  { city: "Bangalore", zone: "Central Bangalore", name: "Shivajinagar" },
  { city: "Bangalore", zone: "Central Bangalore", name: "Richmond Town" },
  { city: "Bangalore", zone: "Central Bangalore", name: "Cunningham Road" },
  { city: "Bangalore", zone: "Central Bangalore", name: "Lavelle Road" },
  { city: "Bangalore", zone: "Central Bangalore", name: "Frazer Town" },
  { city: "Bangalore", zone: "Central Bangalore", name: "Cox Town" },
  { city: "Bangalore", zone: "Central Bangalore", name: "Domlur" },
  { city: "Bangalore", zone: "Central Bangalore", name: "Sadashivanagar" },

  // Bangalore - South
  { city: "Bangalore", zone: "South Bangalore", name: "Jayanagar" },
  { city: "Bangalore", zone: "South Bangalore", name: "JP Nagar" },
  { city: "Bangalore", zone: "South Bangalore", name: "Banashankari" },
  { city: "Bangalore", zone: "South Bangalore", name: "Basavanagudi" },
  { city: "Bangalore", zone: "South Bangalore", name: "BTM Layout" },
  { city: "Bangalore", zone: "South Bangalore", name: "Bannerghatta Road" },
  { city: "Bangalore", zone: "South Bangalore", name: "Kanakapura Road" },
  { city: "Bangalore", zone: "South Bangalore", name: "Uttarahalli" },
  { city: "Bangalore", zone: "South Bangalore", name: "Girinagar" },

  // Bangalore - South-East
  { city: "Bangalore", zone: "South-East Bangalore", name: "Koramangala" },
  { city: "Bangalore", zone: "South-East Bangalore", name: "HSR Layout" },
  { city: "Bangalore", zone: "South-East Bangalore", name: "Bellandur" },
  { city: "Bangalore", zone: "South-East Bangalore", name: "Sarjapur" },
  { city: "Bangalore", zone: "South-East Bangalore", name: "Electronic City" },
  { city: "Bangalore", zone: "South-East Bangalore", name: "Bommanahalli" },
  { city: "Bangalore", zone: "South-East Bangalore", name: "Begur" },
  { city: "Bangalore", zone: "South-East Bangalore", name: "Bommasandra" },
  { city: "Bangalore", zone: "South-East Bangalore", name: "Hosur Road" },
  { city: "Bangalore", zone: "South-East Bangalore", name: "Outer Ring Road" },

  // Hyderabad
  { city: "Hyderabad", zone: "West Hyderabad", name: "Gachibowli" },
  { city: "Hyderabad", zone: "West Hyderabad", name: "Kondapur" },
  { city: "Hyderabad", zone: "West Hyderabad", name: "Madhapur" },
  { city: "Hyderabad", zone: "West Hyderabad", name: "Hitech City" },
  { city: "Hyderabad", zone: "Central Hyderabad", name: "Banjara Hills" },
  { city: "Hyderabad", zone: "Central Hyderabad", name: "Jubilee Hills" },
  { city: "Hyderabad", zone: "Central Hyderabad", name: "Begumpet" },
  { city: "Hyderabad", zone: "Central Hyderabad", name: "Ameerpet" },
  { city: "Hyderabad", zone: "North Hyderabad", name: "Kukatpally" },
  { city: "Hyderabad", zone: "North Hyderabad", name: "Miyapur" },
  { city: "Hyderabad", zone: "North Hyderabad", name: "Secunderabad" },

  // Chennai
  { city: "Chennai", zone: "South Chennai", name: "Adyar" },
  { city: "Chennai", zone: "South Chennai", name: "Velachery" },
  { city: "Chennai", zone: "South Chennai", name: "OMR" },
  { city: "Chennai", zone: "Central Chennai", name: "T Nagar" },
  { city: "Chennai", zone: "Central Chennai", name: "Nungambakkam" },
  { city: "Chennai", zone: "Central Chennai", name: "Mylapore" },
  { city: "Chennai", zone: "North Chennai", name: "Anna Nagar" },

  // Mumbai
  { city: "Mumbai", zone: "Western Mumbai", name: "Bandra" },
  { city: "Mumbai", zone: "Western Mumbai", name: "Andheri" },
  { city: "Mumbai", zone: "Western Mumbai", name: "Juhu" },
  { city: "Mumbai", zone: "Western Mumbai", name: "Malad" },
  { city: "Mumbai", zone: "Western Mumbai", name: "Goregaon" },
  { city: "Mumbai", zone: "Central Mumbai", name: "Worli" },
  { city: "Mumbai", zone: "Central Mumbai", name: "Powai" },
  { city: "Mumbai", zone: "Thane", name: "Thane" },
];

// Case-insensitive fuzzy score: prefix > substring > subsequence.
export function localityScore(query: string, target: string): number {
  const q = query.trim().toLowerCase();
  const t = target.toLowerCase();
  if (!q) return 0;
  if (t.startsWith(q)) return 1000 - t.length;
  const idx = t.indexOf(q);
  if (idx !== -1) return 500 - idx;
  let i = 0;
  for (const ch of t) {
    if (ch === q[i]) i++;
    if (i === q.length) return 100 - t.length;
  }
  return -1;
}

export function filterLocalities(
  query: string,
  opts: { city?: string; zone?: string; limit?: number } = {},
): Locality[] {
  const { city, zone, limit = 8 } = opts;
  let pool = LOCALITIES;
  if (city) pool = pool.filter((l) => l.city.toLowerCase() === city.toLowerCase());
  if (zone) {
    const z = zone.toLowerCase();
    // Match either exact zone or zone name that contains the selected area (e.g. "Whitefield").
    const zoneMatch = pool.filter((l) => l.zone.toLowerCase() === z);
    if (zoneMatch.length) pool = zoneMatch;
  }
  const q = query.trim();
  if (!q) return pool.slice(0, limit);
  return pool
    .map((l) => ({ l, score: localityScore(q, l.name) }))
    .filter((x) => x.score > -1)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.l);
}
