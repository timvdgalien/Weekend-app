interface LoadingScreenProps {
  phase: 'requesting-location' | 'loading' | 'shuffling'
}

const MESSAGES = {
  'requesting-location': {
    icon: '📍',
    title: 'Finding you…',
    subtitle: 'Allow location for the best suggestions',
  },
  loading: {
    icon: '🔍',
    title: 'Scouting Zwolle…',
    subtitle: 'Checking weather, nearby spots & asking Claude',
  },
  shuffling: {
    icon: '🎲',
    title: 'Finding something different…',
    subtitle: 'Claude is considering your options',
  },
}

export function LoadingScreen({ phase }: LoadingScreenProps) {
  const msg = MESSAGES[phase]

  return (
    <div className="loading-screen">
      {/* Background ambient blobs */}
      <div className="ambient-blob blob-1" />
      <div className="ambient-blob blob-2" />
      <div className="ambient-blob blob-3" />

      <div className="loading-glass">
        <div className="loading-icon-ring">
          <span style={{ fontSize: 36 }}>{msg.icon}</span>
        </div>
        <h2 style={{ margin: '16px 0 8px', fontSize: 20, fontWeight: 700 }}>{msg.title}</h2>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: 14, textAlign: 'center' }}>
          {msg.subtitle}
        </p>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginTop: 24 }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.6)',
                animation: `dotBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
