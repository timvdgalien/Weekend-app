import { useState } from 'react'
import type { ActivitySuggestion } from '../types'
import { CATEGORY_ICONS } from '../types'

interface ActivityCardProps {
  suggestion: ActivitySuggestion
  onShuffle: () => void
  isShuffling: boolean
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {Array.from({ length: full }).map((_, i) => (
        <span key={`f${i}`} style={{ color: '#FFD60A', fontSize: 14 }}>★</span>
      ))}
      {half && <span style={{ color: '#FFD60A', fontSize: 14 }}>⭐</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={`e${i}`} style={{ color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>★</span>
      ))}
      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginLeft: 4 }}>
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

function formatDistance(meters: number): string {
  if (meters < 100) return 'Very close'
  if (meters < 1000) return `${Math.round(meters / 10) * 10}m`
  return `${(meters / 1000).toFixed(1)}km`
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

export function ActivityCard({ suggestion, onShuffle, isShuffling }: ActivityCardProps) {
  const [pressed, setPressed] = useState(false)

  const icon = CATEGORY_ICONS[suggestion.category] ?? '📍'
  const categoryLabel = suggestion.category.charAt(0).toUpperCase() + suggestion.category.slice(1)

  return (
    <div className="activity-card">
      {/* Category pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div className="pill">
          <span style={{ marginRight: 4 }}>{icon}</span>
          {categoryLabel}
        </div>
        <div
          className="pill"
          style={{
            background: suggestion.open_now
              ? 'rgba(48,209,88,0.25)'
              : 'rgba(255,69,58,0.25)',
            borderColor: suggestion.open_now
              ? 'rgba(48,209,88,0.4)'
              : 'rgba(255,69,58,0.4)',
            color: suggestion.open_now ? '#30D158' : '#FF453A',
          }}
        >
          {suggestion.open_now ? '● Open' : '● Closed'}
        </div>
      </div>

      {/* Name */}
      <h2 className="place-name">{suggestion.name}</h2>

      {/* Rating */}
      <div style={{ marginBottom: 10 }}>
        <StarRating rating={suggestion.rating} />
      </div>

      {/* Why Now badge */}
      <div className="why-now-badge">
        <span style={{ marginRight: 6 }}>⚡</span>
        {suggestion.why_now}
      </div>

      {/* Description */}
      <p className="description">{suggestion.short_description}</p>

      {/* Tip */}
      {suggestion.tip && (
        <div className="tip-box">
          <span style={{ marginRight: 6 }}>💡</span>
          <span>{suggestion.tip}</span>
        </div>
      )}

      {/* Meta row */}
      <div className="meta-row">
        <span className="meta-item">
          <span style={{ marginRight: 4 }}>📍</span>
          {formatDistance(suggestion.distance_meters)}
        </span>
        <span className="meta-item">
          <span style={{ marginRight: 4 }}>⏱</span>
          {formatDuration(suggestion.duration_minutes)}
        </span>
        <span className="meta-item" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
          {suggestion.address}
        </span>
      </div>

      {/* Shuffle button */}
      <button
        className={`shuffle-btn ${isShuffling ? 'spinning' : ''} ${pressed ? 'pressed' : ''}`}
        onClick={onShuffle}
        disabled={isShuffling}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        aria-label="Shuffle suggestion"
      >
        <svg
          viewBox="0 0 24 24"
          width={18}
          height={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isShuffling ? 'spin' : ''}
        >
          <path d="M17 1l4 4-4 4" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <path d="M7 23l-4-4 4-4" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
        {isShuffling ? 'Finding…' : 'Shuffle'}
      </button>
    </div>
  )
}
