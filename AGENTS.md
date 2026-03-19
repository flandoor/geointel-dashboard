# GeoIntel Dashboard - Agent Guidelines

## Project Overview

A geopolitical intelligence dashboard application built with Next.js 14 (App Router) and Tauri 2.0 for desktop. Features real-time news feeds, category/tag filtering, and a terminal-inspired dark UI.

---

## Build Commands

```bash
# Development
npm run dev              # Start Next.js dev server (http://localhost:3000)
npm run dev:tauri        # Run as Tauri desktop app with hot reload

# Production Build
npm run build            # Build Next.js frontend
npm run build:tauri      # Build Tauri desktop executable
npm run build:all        # Build both frontend and desktop app

# Desktop app location after build:
# src-tauri/target/release/geopolitical-dashboard.exe
```

---

## Code Style Guidelines

### TypeScript/React

- **Strict Mode**: TypeScript strict mode is enabled
- **'use client'**: All interactive components must have `'use client'` directive
- **CSS Modules**: Use `.module.css` files for component styles (not inline styles or Tailwind)
- **Functional Components**: Always use functional components with hooks

### Naming Conventions

```
Components:     PascalCase (e.g., NewsCard.tsx, SummaryTicker.tsx)
CSS Modules:    Same as component (e.g., NewsCard.module.css)
Hooks:         camelCase with 'use' prefix (e.g., useNewsFilter)
Types/Interfaces: PascalCase (e.g., NewsArticle, Category)
Files:          kebab-case for utilities (e.g., news-data.ts)
```

### Import Order

```typescript
// 1. React / Next.js
import { useState, useMemo } from 'react';
import NextLink from 'next/link';

// 2. Absolute imports (src/*)
import Header from '@/components/Header';
import { newsArticles } from '@/data/news';
import { Category } from '@/types';

// 3. Relative imports
import styles from './Component.module.css';
```

### CSS Guidelines

- Use CSS variables for theming (defined in `globals.css`)
- Variables follow pattern: `--bg-*`, `--text-*`, `--accent-*`
- Dark theme colors: black/gray base with blue/red accents
- Font families: `JetBrains Mono` for mono, `Syne` for display headings
- Use `animation-delay` for staggered entrance effects

### Error Handling

- Always include proper TypeScript types for function parameters
- Use `useMemo` for expensive computations to avoid unnecessary re-renders
- Handle optional values explicitly (never use non-null assertion without justification)

---

## Architecture

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Main dashboard page
│   ├── globals.css         # Global styles + CSS variables
│   └── *.module.css        # Page-specific styles
├── components/             # React components
│   ├── Header.tsx/css      # Top navigation bar
│   ├── Sidebar.tsx/css     # Category/tag navigation
│   ├── NewsCard.tsx/css    # Article cards
│   ├── MetricsPanel.tsx/css # Key indicators
│   ├── SummaryTicker.tsx/css # Regional alerts ticker
│   └── Settings.tsx/css    # Settings modal
├── data/
│   └── news.ts             # Mock data + utility functions
└── types/
    └── index.ts            # TypeScript interfaces
```

### State Management

- Local component state with `useState`
- Derived state with `useMemo`
- Props drilling for parent-to-child communication
- No external state library (Redux/Zustand) needed for current scope

---

## Tauri Desktop App

### Configuration

- Config file: `src-tauri/tauri.conf.json`
- Rust code: `src-tauri/src/lib.rs` and `main.rs`
- Icons: `src-tauri/icons/`
- Capabilities: `src-tauri/capabilities/default.json`

### Requirements for Tauri Build

- Rust toolchain (install via `rustup.rs`)
- WebView2 runtime (Windows) or WebKit (macOS/Linux)
- Run `npm run dev:tauri` to test desktop app

---

## Important Notes

1. **CSS Modules**: Always co-locate CSS files with components (Component.tsx + Component.module.css)
2. **Type Safety**: Avoid `any` types; define proper interfaces in `src/types/index.ts`
3. **Server Components**: Use `'use client'` for any component with hooks or event handlers
4. **Icons**: Use inline SVGs instead of icon libraries for consistency
5. **Git Workflow**: Commit changes with clear messages; push to remote after significant updates
