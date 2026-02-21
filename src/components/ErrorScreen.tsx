interface ErrorScreenProps {
  message: string
  onRetry: () => void
}

export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  const isApiKey = message.toLowerCase().includes('api') || message.toLowerCase().includes('auth')

  return (
    <div className="loading-screen">
      <div className="ambient-blob blob-1" style={{ background: 'radial-gradient(circle, rgba(255,69,58,0.4) 0%, transparent 70%)' }} />
      <div className="ambient-blob blob-2" />

      <div className="loading-glass">
        <span style={{ fontSize: 40 }}>😕</span>
        <h2 style={{ margin: '16px 0 8px', fontSize: 20, fontWeight: 700 }}>Something went wrong</h2>
        <p style={{ margin: '0 0 16px', color: 'rgba(255,255,255,0.55)', fontSize: 13, textAlign: 'center', lineHeight: 1.5 }}>
          {isApiKey
            ? 'Make sure ANTHROPIC_API_KEY is set in your .env file and the server is running.'
            : message}
        </p>

        {isApiKey && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            padding: '10px 14px',
            marginBottom: 16,
            width: '100%',
          }}>
            <code style={{ fontSize: 12, color: '#30D158' }}>
              echo "ANTHROPIC_API_KEY=sk-ant-..." &gt; .env
            </code>
          </div>
        )}

        <button className="shuffle-btn" onClick={onRetry} style={{ marginTop: 4 }}>
          Try again
        </button>
      </div>
    </div>
  )
}
