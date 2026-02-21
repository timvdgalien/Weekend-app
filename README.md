# 🏙 Zwolle Weekend Planner

Real-time AI activity planner for your weekend in Zwolle. Combines your live location, current weather, and nearby places to suggest the perfect next thing to do — powered by Claude Opus 4.6.

## Features

- **Live map** with your location and the suggested spot highlighted
- **AI-powered suggestions** via Claude that factor in time, weather, and nearby POIs
- **Shuffle button** to get a fresh pick if the first one doesn't appeal
- **Real weather** from Open-Meteo (no API key needed)
- **Real nearby places** from OpenStreetMap via Overpass API (no API key needed)
- **Apple Liquid Glass** design — frosted glass panels, ambient light effects, dark map

## Quick Start

```bash
# 1. Add your Anthropic API key
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env

# 2. Install & run
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — allow location when prompted.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Map | React Leaflet + CartoDB Dark tiles |
| Weather | [Open-Meteo](https://open-meteo.com/) (free, no key) |
| Places | [Overpass API](https://overpass-api.de/) / OpenStreetMap (free) |
| AI | Claude Opus 4.6 via `@anthropic-ai/sdk` |
| Backend | Express (proxied through Vite dev server) |

## How it works

1. Browser requests your GPS location
2. Fetches current weather from Open-Meteo
3. Fetches nearby restaurants, museums, sights etc. from OpenStreetMap
4. Sends all context to Claude Opus 4.6 with a detailed Zwolle system prompt
5. Claude picks the best activity for right now and explains why
6. Map flies to the suggestion; card shows rating, description, and distance
7. Tap **Shuffle** to get a different suggestion (previously shown places are excluded)
