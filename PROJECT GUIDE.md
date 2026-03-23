# iFlandöör News Dashboard - Agent Guidelines

## Descripción
Aplicación de escritorio Tauri para monitoreo de noticias de inteligencia geopolítica mediante agregación RSS con datos de mercado en tiempo real.

---

## Stack Tecnológico
- **Frontend**: React 18 + TypeScript + Vite
- **Desktop Shell**: Tauri 2.0 + Rust
- **Persistencia**: @tauri-apps/plugin-store + Dexie.js (IndexedDB)
- **URLs Externas**: @tauri-apps/plugin-shell

---

## Estructura del Proyecto

```
src/
├── App.tsx              # Estado principal, layout, filtros
├── components/
│   ├── Header.tsx       # Barra superior: fecha, búsqueda, indicadores
│   ├── Sidebar.tsx      # Navegación: categorías, tags, feeds
│   ├── NewsCard.tsx     # Tarjeta de artículo (default/featured)
│   ├── NewsDetail.tsx   # Modal de artículo completo
│   ├── MetricsPanel.tsx# Ticker de mercado (crypto/stocks)
│   ├── Settings.tsx     # Modal de configuración
│   └── FeedsTab.tsx     # Gestión de feeds RSS
├── hooks/
│   └── useAppData.tsx   # Context API: categorías, tags, feeds CRUD
├── services/
│   ├── rssService.ts    # Fetch RSS con fallbacks de proxy
│   └── articleDB.ts     # Persistencia articles con Dexie.js
├── data/
│   └── news.ts          # Mock data + utilidades
└── types/
    └── index.ts         # Interfaces TypeScript
```

---

## Features Actuales

### Core
1. **Agregación RSS** - Fetch desde 4 feeds por defecto (Reuters, BBC, Al Jazeera, Defense News)
2. **Filtro multi-capa** - Por categoría, tags, feed, búsqueda de texto
3. **Categorización** - Geopolítica, Militar, Economía, Tecnología, Diplomacia, Seguridad
4. **Tags dinámicos** - Extraídos automáticamente de artículos

### UI/UX
5. **NewsCard** - Vista previa con variantes default/featured
6. **NewsDetail** - Modal con botón "Open Original"
7. **Breaking News** - Indicador visual con badge pulsante
8. **Live Ticker** - Panel inferior con crypto (CoinGecko) y stocks (S&P 500, NASDAQ, VIX, Oro, Petróleo)

### Persistencia
9. **Configuración persistente** - Categorías, tags, feeds guardados en Tauri Store
10. **Artículos cacheados** - Carga inicial desde DB IndexedDB, refresh en background
11. **Histórico de noticias** - Búsqueda por fecha (hasta 7 días), categoría, tag, feed
12. **Sistema de estados de artículos** - unread → archived → cleanup (7 días) / bookmarked (nunca)

### Article Lifecycle (Estados)
```
┌─────────────┐     leer     ┌─────────────┐   7 días   ┌──────────┐
│   UNREAD    │ ───────────► │  ARCHIVED   │ ─────────► │ DELETED  │
└─────────────┘              └─────────────┘           └──────────┘
       │                          │
       │ bookmark                 │ bookmark
       ▼                          ▼
┌─────────────┐              ┌─────────────┐
│ BOOKMARKED  │◄─────────────│   ANY       │
└─────────────┘              └─────────────┘
     (nunca se borra)
```

**Flujo:**
1. Nuevo artículo entra como `unread`
2. Usuario lee → se marca como leído (localStorage) + en próximo refresh → `archived`
3. Artículos `archived` viven 7 días, luego se borran
4. Si están `bookmarked` → nunca se borran automáticamente
5. Desmarcar bookmark → vuelve a `archived` (si fue leído) o `unread` (si no)

---

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│  Usuario (clic, búsqueda, refresh)                           │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  App.tsx (Estado: articles, filters, selectedArticle)      │
└─────────────────────────────┬───────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────────┐
│  Sidebar.tsx   │   │ useAppData.tsx│   │  rssService.ts    │
│  (filtros UI)  │   │ (CRUD context)│   │  (fetch feeds)    │
└───────────────┘   └───────────────┘   └───────────────────┘
                                                  │
                                                  ▼
                                         ┌───────────────────┐
                                         │  RSS Feeds (URL)  │
                                         │  via Proxy APIs   │
                                         └───────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Tauri Store (appdata.json)                                  │
│  - categories, tags, feeds, bookmarkedArticleIds              │
├─────────────────────────────────────────────────────────────┤
│  Dexie DB (IndexedDB)                                        │
│  - articles (hasta 7 días de histórico para archived)       │
│  - índice por: source, category, savedAt, publishedAt,      │
│    status, archivedAt, readAt, tags                          │
│  - campos: id, title, summary, content, source, category,   │
│    tags, publishedAt, isBreaking, readTime, link, status,    │
│    archivedAt, readAt, savedAt                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Comportamiento Esperado

### Inicialización
1. Cargar artículos cacheados desde IndexedDB
2. Cargar IDs de artículos leídos desde localStorage
3. Mostrar UI inmediatamente con datos cacheados
4. Background refresh cada 5 min (configurable)
5. En refresh: archivar artículos leídos + cleanup de old archived

### Filtros
- Status → unread / archived / bookmarked / all (default: unread)
- Cambio de categoría → refiltra artículos instantly
- Búsqueda → match en título/descripción (case-insensitive)
- Tags → filtro múltiple (OR logic)
- Feed → filtro por fuente específica
- Fecha → rango de fechas (desde/hasta)

### RSS Fetching
- Proxies en orden: allorigins.win → corsproxy.io → codetabs.com
- Timeout: 10 segundos por feed
- Error en un feed no rompe otros

### Persistencia
- Categorías/Tags/Feeds: auto-guardado en Store al cambiar
- Artículos leídos: trackeados en localStorage (readArticleIds)
- Artículos: guardados en IndexedDB con status (unread/archived/bookmarked)
- Artículos archived > 7 días: auto-deleted en cada refresh

### Links Externos
- "Open Original" → Tauri shell plugin → abre en navegador del sistema

---

## Convenciones de Código

### TypeScript
- Strict mode, sin `any`
- Interfaces para todos los tipos
- Functional components + hooks

### Nombrado
```
Components:  PascalCase (NewsCard.tsx)
Hooks:      camelCase con 'use' (useAppData.tsx)
Types:      PascalCase (NewsArticle, ArticleStatus)
CSS:        Mismo nombre que componente (NewsCard.css)
```

### Article Status Enum
```typescript
type ArticleStatus = 'unread' | 'archived' | 'bookmarked';
```

### Import Order
```typescript
// 1. React
// 2. Tauri APIs (@tauri-apps/plugin-*)
// 3. Local imports (./components, ./hooks, ./types)
// 4. Styles
```

---

## Comandos de Build

```bash
npm run dev          # Vite dev server (localhost:1420)
npm run dev:tauri     # Tauri dev mode (compila Rust + inicia app)
npm run build         # Build frontend a dist/
npm run build:tauri   # Build ejecutable desktop
npm run build:all     # Frontend + Desktop

# Output: src-tauri/target/release/iflandoor-news-dashboard.exe
```

---

## Notas Importantes

1. **No Browser APIs**: No usar localStorage/cookies (usar Tauri Store)
2. **Desktop UX**: Diseñar para mouse/teclado, no touch
3. **Window Size**: Min 1024x700, default 1400x900
4. **Errores RSS**: No mostrar errores al usuario por cada feed fallido
