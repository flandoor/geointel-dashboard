# iFlandoor News Dashboard

Desktop application for monitoring news through RSS aggregation with real-time market data.

![Tauri](https://img.shields.io/badge/Tauri-2.0-blue) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## What is it?

**iFlandoor News Dashboard** is a Tauri desktop app that aggregates RSS feeds from major international news sources (Reuters, BBC, Al Jazeera, Defense News) and presents them in a clean, filterable interface designed for intelligence monitoring.

It combines news aggregation with live market indicators (crypto, stocks, VIX, gold, oil) and lets you categorize, tag, bookmark, and browse articles across multiple views.

## Features

### News Aggregation
- RSS feeds from Reuters, BBC, Al Jazeera, Defense News (extensible)
- Automatic background refresh every 5 minutes
- Article caching for instant load on startup
- CORS proxy fallback system for reliable fetching

### Views & Navigation
- **Grid view** — card-based layout with visual category indicators
- **List view** — split-panel: article list on the left, detail preview on the right
- Toggle between views with one click

### Filtering
- By category (Geopolitics, Military, Economy, Technology, Diplomacy, Security)
- By tags (NATO, China, Russia, USA, etc.)
- By source (individual feed selection)
- By text search (title, summary, source, tags)
- Bookmarks filter (saved articles)

### Bookmarks
- Save articles for later reading
- Quick toggle from cards, list items, and detail panel
- Clear all bookmarks with one click
- Persisted across sessions via Tauri Store

### Market Ticker
- Live crypto prices (Bitcoin, Ethereum, Solana, XRP) via CoinGecko
- Major indices (S&P 500, NASDAQ, VIX, Gold, Crude Oil)

### Persistence
- Categories, tags, feeds, and bookmarks saved in local Tauri Store
- No browser storage — fully native

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Desktop | Tauri 2.0 (Rust) |
| Persistence | @tauri-apps/plugin-store |
| External Links | @tauri-apps/plugin-shell |

## Project Structure

```
src/
├── App.tsx                 # Main state, layout, filters
├── components/
│   ├── Header.tsx          # Top bar: date, search, view toggle
│   ├── Sidebar.tsx         # Categories, tags, feeds, bookmarks
│   ├── NewsCard.tsx        # Article card (default/featured)
│   ├── NewsListItem.tsx    # Compact list item
│   ├── NewsDetail.tsx      # Full article modal
│   ├── NewsPanel.tsx       # Side panel detail (list view)
│   ├── MetricsPanel.tsx    # Market ticker
│   └── Settings.tsx        # Settings modal
├── hooks/
│   └── useAppData.tsx      # Context: categories, tags, feeds, bookmarks CRUD
├── services/
│   └── rssService.ts       # RSS fetch with proxy fallbacks
├── data/
│   └── news.ts             # Mock data and utilities
└── types/
    └── index.ts            # TypeScript interfaces
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS)
- [Rust](https://rustup.rs/) (for Tauri)
- [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/)

### Install & Run

```bash
# Install dependencies
npm install

# Dev mode (Vite only — browser)
npm run dev

# Dev mode (Tauri — desktop app)
npm run dev:tauri

# Build frontend
npm run build

# Build desktop executable
npm run build:tauri

# Build both
npm run build:all
```

### Output
```
src-tauri/target/release/iflandoor-news-dashboard.exe
```

## Configuration

### Window
- Minimum: 1024x700
- Default: 1400x900

### Default Feeds
| Name | Category |
|------|----------|
| Reuters World News | Geopolitics |
| BBC World | Geopolitics |
| Al Jazeera | Geopolitics |
| Defense News | Military |

Feeds can be added, removed, and toggled from Settings.

## License

Private project.
