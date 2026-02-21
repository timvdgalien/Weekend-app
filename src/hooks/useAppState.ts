import { useState, useEffect, useCallback } from 'react'
import type { WeatherData, Place, ActivitySuggestion, AppStatus, Coords } from '../types'
import { fetchWeather } from '../services/weather'
import { fetchNearbyPlaces } from '../services/overpass'
import { fetchSuggestion } from '../services/claude'

export function useAppState(coords: Coords | null) {
  const [status, setStatus] = useState<AppStatus>('loading')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [suggestion, setSuggestion] = useState<ActivitySuggestion | null>(null)
  const [excluded, setExcluded] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async (location: Coords, excl: string[]) => {
    try {
      const [w, p] = await Promise.all([
        fetchWeather(location.lat, location.lng),
        fetchNearbyPlaces(location.lat, location.lng).catch(() => [] as Place[]),
      ])
      setWeather(w)
      setPlaces(p)
      const s = await fetchSuggestion(location, w, p, excl)
      setSuggestion(s)
      setStatus('ready')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    if (!coords) return
    setStatus('loading')
    loadData(coords, [])
  }, [coords, loadData])

  const shuffle = useCallback(async () => {
    if (!coords || !weather) return
    setStatus('shuffling')
    const newExcluded = suggestion ? [...excluded, suggestion.name] : excluded
    setExcluded(newExcluded)
    try {
      const s = await fetchSuggestion(coords, weather, places, newExcluded)
      setSuggestion(s)
      setStatus('ready')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Shuffle failed')
      setStatus('error')
    }
  }, [coords, weather, places, suggestion, excluded])

  const retry = useCallback(() => {
    if (!coords) return
    setError(null)
    setStatus('loading')
    setExcluded([])
    loadData(coords, [])
  }, [coords, loadData])

  return { status, weather, places, suggestion, error, shuffle, retry }
}
