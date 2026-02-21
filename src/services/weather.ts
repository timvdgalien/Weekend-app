import type { WeatherData } from '../types'
import { WMO_CODES } from '../types'

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', lat.toFixed(4))
  url.searchParams.set('longitude', lng.toFixed(4))
  url.searchParams.set('current', 'temperature_2m,weathercode,windspeed_10m,is_day')
  url.searchParams.set('timezone', 'Europe/Amsterdam')

  const resp = await fetch(url.toString())
  if (!resp.ok) throw new Error('Weather fetch failed')

  const data = await resp.json()
  const c = data.current
  const code: number = c.weathercode ?? 0
  const info = WMO_CODES[code] ?? { label: 'Unknown', icon: '🌡' }

  return {
    temperature: Math.round(c.temperature_2m),
    condition: info.label,
    conditionCode: code,
    windspeed: Math.round(c.windspeed_10m),
    is_day: c.is_day,
    icon: info.icon,
  }
}
