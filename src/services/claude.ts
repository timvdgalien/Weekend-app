import type { ActivitySuggestion, WeatherData, Place, Coords } from '../types'

export async function fetchSuggestion(
  location: Coords,
  weather: WeatherData,
  places: Place[],
  excluded: string[]
): Promise<ActivitySuggestion> {
  const now = new Date()
  const timeStr = now.toLocaleString('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })

  const resp = await fetch('/api/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location,
      weather: {
        temperature: weather.temperature,
        condition: weather.condition,
        windspeed: weather.windspeed,
        is_day: weather.is_day,
      },
      places: places.map(p => ({
        name: p.name,
        type: p.type,
        lat: p.lat,
        lng: p.lng,
        distance: p.distance,
      })),
      time: timeStr,
      excluded,
    }),
  })

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(err.error ?? 'Suggestion failed')
  }

  const data = await resp.json()
  return data.suggestion as ActivitySuggestion
}
