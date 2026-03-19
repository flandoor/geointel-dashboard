# GeoIntel Dashboard - Agent Guidelines

## IMPORTANT: This is a Desktop Application

This is a **Tauri desktop application** (not a web app). The UI runs in a native WebView window, not in a browser. Design decisions should prioritize desktop UX patterns.

---

## Project Overview

A geopolitical intelligence dashboard built with:
- **React 18** + **TypeScript** + **Vite** (frontend)
- **Tauri 2.0** + **Rust** (desktop shell)
- **Tauri Store Plugin** for persistent settings

The app runs as a native Windows/macOS/Linux application using WebView2 (Windows) or WebKit (macOS/Linux).

---

## Build Commands

```bash
# Development
npm run dev              # Start Vite dev server (http://localhost:1420)
npm run dev:tauri        # Run app in Tauri dev mode (with hot reload)

# Production Build
npm run build            # Build frontend to dist/
npm run build:tauri       # Build Tauri desktop executable
npm run build:all         # Build both frontend and desktop app

# Executable location after build:
# src-tauri/target/release/geopolitical-dashboard.exe (Windows)
```

---

## Desktop-Specific Guidelines

### Window Management
- App runs in a fixed window (min 1024x700)
- Native window decorations (title bar, controls)
- No responsive design needed - optimize for desktop viewport

### Data Persistence
- Use `@tauri-apps/plugin-store` for persistent settings
- Settings auto-save to `settings.json`
- No localStorage needed (Tauri store handles it)

### Native Features
- Window controls handled by OS
- Notifications via Tauri notification API
- System tray support available if needed

---

## Code Style Guidelines

### TypeScript/React

- **Strict TypeScript**: No `any` types, define proper interfaces
- **Functional Components**: Always use hooks for state/effects
- **CSS Files**: Co-located with components (`.tsx` + `.css`)

### Naming Conventions

```
Components:     PascalCase (e.g., NewsCard.tsx)
CSS Files:      Same name as component (e.g., NewsCard.css)
Hooks:         camelCase with 'use' prefix
Types/Interfaces: PascalCase
```

### Import Order

```typescript
// 1. React
import { useState, useEffect } from 'react';

// 2. Tauri APIs
import { load } from '@tauri-apps/plugin-store';

// 3. Local imports
import Header from './components/Header';
import { newsArticles } from './data/news';
import type { NewsArticle } from './types';

// 4. Styles
import './App.css';
```

### CSS Guidelines

- Use CSS variables (defined in `index.css`)
- Dark theme default (black/gray + blue/red accents)
- Fonts: `JetBrains Mono` (mono), `Syne` (display)
- Animations with `animation-delay` for stagger effects

---

## Architecture

### Directory Structure

```
src/
├── main.tsx              # React entry point
├── App.tsx               # Main app component
├── App.css               # App-level styles
├── index.css             # Global styles + CSS variables
├── components/           # React components
│   ├── Header.tsx/css
│   ├── Sidebar.tsx/css
│   ├── NewsCard.tsx/css
│   ├── MetricsPanel.tsx/css
│   ├── SummaryTicker.tsx/css
│   └── Settings.tsx/css
├── data/
│   └── news.ts           # Mock data + utilities
└── types/
    └── index.ts          # TypeScript interfaces
```

### State Management

- Local state with `useState`
- `useCallback` for event handlers
- Tauri Store for persistent settings
- No Redux/Zustand needed

---

## Tauri Configuration

- Config: `src-tauri/tauri.conf.json`
- Rust code: `src-tauri/src/lib.rs` & `main.rs`
- Icons: `src-tauri/icons/`
- Capabilities: `src-tauri/capabilities/default.json`

### Tauri Plugins Used

- `@tauri-apps/plugin-store` - Persistent storage
- `@tauri-apps/plugin-shell` - Open external links

---

## Important Notes

1. **No Browser APIs**: Don't assume browser features (localStorage, etc.) - use Tauri APIs instead
2. **Desktop UX**: Design for mouse/keyboard, not touch
3. **Window Size**: Fixed minimum size, no responsive breakpoints needed
4. **Settings**: Must persist via Tauri Store, not localStorage
5. **Build Target**: Always test with `npm run dev:tauri` before building executable
