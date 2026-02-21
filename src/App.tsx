import 'leaflet/dist/leaflet.css'
import { MapView } from './components/MapView'
import { ActivityCard } from './components/ActivityCard'
import { WeatherBar } from './components/WeatherBar'
import { LoadingScreen } from './components/LoadingScreen'
import { ErrorScreen } from './components/ErrorScreen'
import { useLocation } from './hooks/useLocation'
import { useAppState } from './hooks/useAppState'

export default function App() {
  const { coords, status: locationStatus } = useLocation()
  const { status, weather, places, suggestion, error, shuffle, retry } = useAppState(coords)

  const isLoading = !coords || status === 'loading'
  const isShuffling = status === 'shuffling'

  if (!coords || isLoading) {
    return (
      <>
        <div className="bg-gradient" />
        <div className="ambient-blob blob-1" />
        <div className="ambient-blob blob-2" />
        <div className="ambient-blob blob-3" />
        <LoadingScreen phase={!coords ? 'requesting-location' : 'loading'} />
      </>
    )
  }

  if (status === 'error' && error) {
    return (
      <>
        <div className="bg-gradient" />
        <ErrorScreen message={error} onRetry={retry} />
      </>
    )
  }

  return (
    <div className="app-shell">
      {/* Background */}
      <div className="bg-gradient" />
      <div className="ambient-blob blob-1" />
      <div className="ambient-blob blob-2" />
      <div className="ambient-blob blob-3" />

      {/* Weather bar */}
      {weather && (
        <div className="top-bar">
          <WeatherBar weather={weather} locationStatus={locationStatus} />
        </div>
      )}

      {/* Map */}
      <div className="map-container">
        <MapView
          userCoords={coords}
          suggestion={suggestion}
          places={places}
        />
        {/* Map fade edges */}
        <div className="map-fade-top" />
        <div className="map-fade-bottom" />
      </div>

      {/* Activity card */}
      <div className="card-container">
        {isShuffling ? (
          <LoadingScreen phase="shuffling" />
        ) : suggestion ? (
          <ActivityCard
            suggestion={suggestion}
            onShuffle={shuffle}
            isShuffling={isShuffling}
          />
        ) : null}
      </div>
    </div>
  )
}
