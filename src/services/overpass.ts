import type { Place } from '../types'

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function classifyPlace(tags: Record<string, string>): string {
  if (tags.tourism === 'museum') return 'museum'
  if (tags.tourism === 'attraction' || tags.tourism === 'viewpoint') return 'sightseeing'
  if (tags.tourism === 'gallery') return 'museum'
  if (tags.amenity === 'restaurant') return 'restaurant'
  if (tags.amenity === 'cafe') return 'cafe'
  if (tags.amenity === 'bar' || tags.amenity === 'pub') return 'bar'
  if (tags.amenity === 'fast_food') return 'restaurant'
  if (tags.leisure === 'park') return 'park'
  if (tags.waterway || tags.natural === 'water') return 'waterfront'
  if (tags.shop) return 'shopping'
  if (tags.amenity === 'theatre' || tags.amenity === 'cinema') return 'entertainment'
  if (tags.historic) return 'sightseeing'
  return 'other'
}

export async function fetchNearbyPlaces(lat: number, lng: number, radiusM = 1200): Promise<Place[]> {
  const query = `
[out:json][timeout:10];
(
  node["tourism"~"museum|attraction|viewpoint|gallery"](around:${radiusM},${lat},${lng});
  node["amenity"~"restaurant|cafe|bar|pub|fast_food"](around:${radiusM},${lat},${lng});
  node["leisure"="park"](around:${radiusM},${lat},${lng});
  node["historic"](around:${radiusM},${lat},${lng});
  node["amenity"~"theatre|cinema"](around:${radiusM},${lat},${lng});
  way["tourism"~"museum|attraction|viewpoint"](around:${radiusM},${lat},${lng});
  way["historic"](around:${radiusM},${lat},${lng});
  way["leisure"="park"](around:${radiusM},${lat},${lng});
);
out center tags 40;
`

  const resp = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: query,
    signal: AbortSignal.timeout(12000),
  })

  if (!resp.ok) throw new Error('Overpass fetch failed')
  const data = await resp.json()

  const places: Place[] = []
  const seen = new Set<string>()

  for (const el of data.elements ?? []) {
    const tags = el.tags ?? {}
    const name = tags.name || tags['name:en'] || tags['name:nl']
    if (!name) continue

    const elLat = el.lat ?? el.center?.lat
    const elLng = el.lon ?? el.center?.lon
    if (!elLat || !elLng) continue

    const key = name.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)

    const type = classifyPlace(tags)
    if (type === 'other') continue

    places.push({
      name,
      type,
      lat: elLat,
      lng: elLng,
      distance: haversine(lat, lng, elLat, elLng),
      tags,
    })
  }

  return places.sort((a, b) => a.distance - b.distance)
}
