import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Coords, ActivitySuggestion, Place } from '../types'
import { CATEGORY_ICONS } from '../types'

// Fix Leaflet default icon path issue with Vite
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createEmojiIcon(emoji: string, size = 36, isPrimary = false) {
  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${isPrimary ? 'rgba(0,122,255,0.9)' : 'rgba(255,255,255,0.85)'};
      backdrop-filter:blur(8px);
      border:${isPrimary ? '2.5px solid rgba(255,255,255,0.9)' : '1.5px solid rgba(255,255,255,0.5)'};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:${isPrimary ? size * 0.5 : size * 0.45}px;
      box-shadow:${isPrimary ? '0 4px 20px rgba(0,122,255,0.6)' : '0 2px 10px rgba(0,0,0,0.3)'};
      ${isPrimary ? 'animation:pulse 2s infinite;' : ''}
    ">${emoji}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

function createUserIcon() {
  return L.divIcon({
    html: `<div style="
      width:18px;height:18px;
      background:#007AFF;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 0 0 4px rgba(0,122,255,0.3);
    "></div>`,
    className: '',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

function FlyToSuggestion({ suggestion }: { suggestion: ActivitySuggestion | null }) {
  const map = useMap()
  const prevSuggestion = useRef<string | null>(null)

  useEffect(() => {
    if (!suggestion) return
    const key = `${suggestion.lat},${suggestion.lng}`
    if (key === prevSuggestion.current) return
    prevSuggestion.current = key

    map.flyTo([suggestion.lat, suggestion.lng], 16, { duration: 1.4, easeLinearity: 0.3 })
  }, [map, suggestion])

  return null
}

interface MapViewProps {
  userCoords: Coords
  suggestion: ActivitySuggestion | null
  places: Place[]
}

export function MapView({ userCoords, suggestion, places }: MapViewProps) {
  const center: [number, number] = suggestion
    ? [suggestion.lat, suggestion.lng]
    : [userCoords.lat, userCoords.lng]

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />

      {/* Small place markers */}
      {places.slice(0, 15).map((place, i) => {
        if (suggestion && Math.abs(place.lat - suggestion.lat) < 0.0001 && Math.abs(place.lng - suggestion.lng) < 0.0001) return null
        const icon = CATEGORY_ICONS[place.type] ?? '📍'
        return (
          <Marker
            key={i}
            position={[place.lat, place.lng]}
            icon={createEmojiIcon(icon, 28)}
          >
            <Popup className="glass-popup">
              <strong>{place.name}</strong><br />
              <span style={{ opacity: 0.7 }}>{place.type} · {Math.round(place.distance)}m</span>
            </Popup>
          </Marker>
        )
      })}

      {/* Suggestion marker */}
      {suggestion && (
        <>
          <Circle
            center={[suggestion.lat, suggestion.lng]}
            radius={40}
            pathOptions={{
              color: 'rgba(0,122,255,0.8)',
              fillColor: 'rgba(0,122,255,0.15)',
              fillOpacity: 1,
              weight: 2,
            }}
          />
          <Marker
            position={[suggestion.lat, suggestion.lng]}
            icon={createEmojiIcon(CATEGORY_ICONS[suggestion.category] ?? '📍', 44, true)}
          >
            <Popup className="glass-popup">
              <strong>{suggestion.name}</strong><br />
              <span style={{ opacity: 0.7 }}>{suggestion.address}</span>
            </Popup>
          </Marker>
        </>
      )}

      {/* User location */}
      <Marker position={[userCoords.lat, userCoords.lng]} icon={createUserIcon()}>
        <Popup>You are here</Popup>
      </Marker>

      <FlyToSuggestion suggestion={suggestion} />
    </MapContainer>
  )
}
