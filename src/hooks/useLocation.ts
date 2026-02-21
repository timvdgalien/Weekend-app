import { useState, useEffect } from 'react'
import type { Coords } from '../types'

// Zwolle city center fallback
const ZWOLLE_CENTER: Coords = { lat: 52.5168, lng: 6.0830 }

export function useLocation() {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'pending' | 'granted' | 'denied' | 'fallback'>('pending')

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords(ZWOLLE_CENTER)
      setStatus('fallback')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('granted')
      },
      (err) => {
        console.warn('Geolocation denied, using Zwolle center:', err.message)
        setCoords(ZWOLLE_CENTER)
        setStatus('fallback')
        setError(err.message)
      },
      { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
    )
  }, [])

  return { coords, error, status }
}
