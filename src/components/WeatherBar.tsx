import type { WeatherData } from '../types'

interface WeatherBarProps {
  weather: WeatherData
  locationStatus: string
}

export function WeatherBar({ weather, locationStatus }: WeatherBarProps) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    hour: '2-digit',
    minute: '2-digit',
  })
  const dateStr = now.toLocaleDateString('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  return (
    <div className="weather-bar">
      {/* Location pin */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>
          {locationStatus === 'granted' ? '📍' : '🏙'}
        </span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>Zwolle</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>
            {locationStatus === 'granted' ? 'Live location' : 'City center'}
          </div>
        </div>
      </div>

      {/* Center: weather */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>{weather.icon}</span>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>
            {weather.temperature}°C
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>
            {weather.condition}
          </div>
        </div>
        {weather.windspeed > 10 && (
          <div style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.5)',
            background: 'rgba(255,255,255,0.08)',
            padding: '2px 6px',
            borderRadius: 8,
          }}>
            💨 {weather.windspeed} km/h
          </div>
        )}
      </div>

      {/* Right: time */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1 }}>{timeStr}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{dateStr}</div>
      </div>
    </div>
  )
}
