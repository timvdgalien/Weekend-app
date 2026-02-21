import express from 'express'
import cors from 'cors'
import Anthropic from '@anthropic-ai/sdk'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT ? parseInt(process.env.PORT) : 3001

app.use(cors())
app.use(express.json())

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SUGGEST_TOOL: Anthropic.Tool = {
  name: 'suggest_activity',
  description: 'Suggest the single best activity to do right now in Zwolle based on current context. Choose something genuinely suited for the time, weather, and location.',
  input_schema: {
    type: 'object' as const,
    properties: {
      name: { type: 'string', description: 'Exact name of the place or activity' },
      category: {
        type: 'string',
        enum: ['sightseeing', 'museum', 'restaurant', 'bar', 'cafe', 'park', 'market', 'shopping', 'entertainment', 'waterfront'],
      },
      rating: { type: 'number', description: 'Score 1-5 for how ideal this suggestion is right now (consider time, weather, uniqueness)' },
      short_description: { type: 'string', description: '2-3 engaging sentences about why this is perfect right now. Be specific about Zwolle.' },
      why_now: { type: 'string', description: 'Punchy, specific reason why RIGHT NOW is ideal (max 8 words, e.g. "Golden hour views hitting different" or "Perfect lunch rush just started")' },
      address: { type: 'string', description: 'Street address in Zwolle' },
      lat: { type: 'number', description: 'Latitude (must be in Zwolle, Netherlands ~52.50-52.52N)' },
      lng: { type: 'number', description: 'Longitude (must be in Zwolle, Netherlands ~6.08-6.12E)' },
      duration_minutes: { type: 'number', description: 'Suggested time to spend here' },
      distance_meters: { type: 'number', description: 'Approximate walking distance from user in meters' },
      open_now: { type: 'boolean', description: 'Is this likely open right now?' },
      tip: { type: 'string', description: 'One insider tip for visiting (optional, max 1 sentence)' },
    },
    required: ['name', 'category', 'rating', 'short_description', 'why_now', 'address', 'lat', 'lng', 'duration_minutes', 'distance_meters', 'open_now'],
  },
}

interface SuggestRequest {
  location: { lat: number; lng: number }
  weather: {
    temperature: number
    condition: string
    windspeed: number
    is_day: number
  }
  places: Array<{
    name: string
    type: string
    lat: number
    lng: number
    distance: number
  }>
  time: string
  excluded: string[]
}

app.post('/api/suggest', async (req, res) => {
  const { location, weather, places, time, excluded } = req.body as SuggestRequest

  const placesText = places.length > 0
    ? places.slice(0, 20).map(p => `- ${p.name} (${p.type}, ${Math.round(p.distance)}m away)`).join('\n')
    : 'No nearby POI data available — use your knowledge of Zwolle'

  const excludedText = excluded.length > 0
    ? `\nALREADY SHOWN (do NOT suggest these): ${excluded.join(', ')}`
    : ''

  const systemPrompt = `You are a local Zwolle expert and activity concierge. Your job is to suggest the single best thing to do RIGHT NOW during a weekend visit.

Zwolle context you know well:
- Historic Hanseatic city in Overijssel, Netherlands
- Key landmarks: Sassenpoort (medieval gate), Grote Kerk (St. Michael's), Onze Lieve Vrouwenkerk, Pelserbrugje
- Museum de Fundatie (contemporary art in stunning dome building)
- Beautiful waterfront along IJssel and Zwarte Water rivers
- Lively Melkmarkt and Grote Markt squares with cafes/restaurants
- Saturday market on Grote Markt (one of Netherlands' largest)
- Cozy Dutch brown cafes (bruine kroegen) in the old city
- Pedestrian-only Diezerstraat shopping street
- Typical Dutch lunch: broodje kroket, tostis around 12:00-13:30
- Dutch dinner time: 17:30-20:00
- Terrace culture thrives when temp > 15°C

Always use the suggest_activity tool. Pick something genuinely special, not generic.`

  const userMessage = `Current situation:
📍 User location: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)} (Zwolle city center area)
🕐 Time: ${time}
🌤 Weather: ${weather.temperature}°C, ${weather.condition}, wind ${weather.windspeed} km/h, ${weather.is_day ? 'daytime' : 'evening/night'}

Nearby places from OpenStreetMap:
${placesText}
${excludedText}

Suggest the single best activity for right now. Consider the time of day, weather, and what would make this weekend in Zwolle truly memorable.`

  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      thinking: { type: 'adaptive' },
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
      tools: [SUGGEST_TOOL],
      tool_choice: { type: 'tool', name: 'suggest_activity' },
    })

    const message = await stream.finalMessage()

    const toolUse = message.content.find(b => b.type === 'tool_use')
    if (!toolUse || toolUse.type !== 'tool_use') {
      res.status(500).json({ error: 'No suggestion returned' })
      return
    }

    res.json({ suggestion: toolUse.input })
  } catch (err: unknown) {
    console.error('Claude API error:', err)
    const message = err instanceof Error ? err.message : 'Claude API error'
    res.status(500).json({ error: message })
  }
})

// Serve built frontend
const distPath = path.join(__dirname, 'dist')
app.use(express.static(distPath))
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`🗺  Zwolle Planner API running on http://localhost:${port}`)
})
