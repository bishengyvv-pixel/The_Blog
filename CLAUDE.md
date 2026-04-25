# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (port 3000, proxies /api → localhost:3002)
npm run build            # Production build (generates dist/, including rss.xml)
npm run preview          # Preview production build locally
```

Backend (optional, for Docker mode):
```bash
cd server && npm install && npm run dev   # Start API server on port 3001 (uses tsx)
cd server && npm run build && npm start   # Production mode
```

Docker:
```bash
docker-compose up -d              # Start frontend (port 10001) + backend (port 10002)
docker-compose up -d --build      # Rebuild and start
docker-compose down               # Stop
```

## Architecture

### Dual data loading (key design choice)

Post data can be loaded two ways, and pages use them **inconsistently**:

| Mode | Mechanism | Used by |
|------|-----------|---------|
| **Static (sync)** | `import.meta.glob` in `src/utils/posts.ts` — eagerly imports all `posts/*.md` at build time | `CategoryDetail`, `TagDetail`, `SeriesList`, `SeriesDetail`, `Timeline` |
| **API (async)** | `fetch()` in `src/utils/api.ts` — calls `/api/posts` REST endpoints | `Home`, `PostList`, `PostDetail`, `Categories`, `Tags` |

`fetchPosts()` returns an `ApiResponse<T>` wrapper: `{ success: boolean, data?: T, error?: string }`.
The API base URL is `import.meta.env.VITE_API_BASE || '/api'`.

**Implication:** Pages using sync functions work with zero backend (pure static mode). Pages using async fetch need either the Vite dev proxy, the Express server, or the Nginx proxy in Docker.

### CSS theming

Tailwind v4 via `@tailwindcss/vite` plugin (no PostCSS config). The theme system uses CSS custom properties on `:root` and `[data-theme="dark"]` — see `src/styles/global.css`. `ThemeToggle` sets `data-theme` on `<html>` and persists to `localStorage` key `"theme"`. Components use inline styles for dynamic CSS variable references (Tailwind can't resolve these).

### RSS generation

Custom Vite plugin in `vite-plugin-rss.ts` — reads all non-draft posts at build time, sorts by date, writes `rss.xml` to `dist/`. The `siteUrl`/`siteTitle`/`siteDescription` are configured in `vite.config.ts`.

### State management

No global state library. Each page manages its own data via `useState`/`useEffect`. Theme persisted to `localStorage`. Series reading progress persisted to `localStorage` keyed `"blog-series-progress-<seriesName>"`.

### Reading time

`src/utils/readingTime.ts` uses `@chenglou/pretext` to measure rendered line count with code blocks weighted at a slower reading rate (25 lines/min vs 60 lines/min for prose).

### Unrouted pages

`Categories.tsx` and `Tags.tsx` exist in `src/pages/` but are **not registered** in `App.tsx` routes. Only their detail variants (`/categories/:category`, `/tags/:tag`) are routed.

### Post frontmatter

Posts in `posts/*.md` use YAML frontmatter parsed by both `src/utils/posts.ts` (gray-matter, client-side) and `server/src/utils/posts.ts` (gray-matter, server-side). Supported fields: `title`, `date`, `category`, `tags`, `draft`, `summary`, `updatedAt`, `top`, `series`, `seriesOrder`, `cover`.
