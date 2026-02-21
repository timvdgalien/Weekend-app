export interface Coords {
  lat: number
  lng: number
}

export interface WeatherData {
  temperature: number
  condition: string
  conditionCode: number
  windspeed: number
  is_day: number
  icon: string
}

export interface Place {
  name: string
  type: string
  lat: number
  lng: number
  distance: number
  tags?: Record<string, string>
}

export interface ActivitySuggestion {
  name: string
  category: string
  rating: number
  short_description: string
  why_now: string
  address: string
  lat: number
  lng: number
  duration_minutes: number
  distance_meters: number
  open_now: boolean
  tip?: string
}

export type AppStatus =
  | 'requesting-location'
  | 'loading'
  | 'ready'
  | 'shuffling'
  | 'error'

export const CATEGORY_ICONS: Record<string, string> = {
  sightseeing: '🏛',
  museum: '🎨',
  restaurant: '🍽',
  bar: '🍺',
  cafe: '☕',
  park: '🌿',
  market: '🛍',
  shopping: '🛒',
  entertainment: '🎭',
  waterfront: '⛵',
}

export const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: 'Clear sky', icon: '☀️' },
  1: { label: 'Mainly clear', icon: '🌤' },
  2: { label: 'Partly cloudy', icon: '⛅' },
  3: { label: 'Overcast', icon: '☁️' },
  45: { label: 'Foggy', icon: '🌫' },
  48: { label: 'Icy fog', icon: '🌫' },
  51: { label: 'Light drizzle', icon: '🌦' },
  53: { label: 'Drizzle', icon: '🌦' },
  55: { label: 'Heavy drizzle', icon: '🌧' },
  61: { label: 'Light rain', icon: '🌧' },
  63: { label: 'Rain', icon: '🌧' },
  65: { label: 'Heavy rain', icon: '⛈' },
  71: { label: 'Light snow', icon: '🌨' },
  73: { label: 'Snow', icon: '❄️' },
  75: { label: 'Heavy snow', icon: '❄️' },
  80: { label: 'Rain showers', icon: '🌦' },
  81: { label: 'Showers', icon: '🌧' },
  82: { label: 'Heavy showers', icon: '⛈' },
  95: { label: 'Thunderstorm', icon: '⛈' },
  99: { label: 'Hail storm', icon: '⛈' },
}
