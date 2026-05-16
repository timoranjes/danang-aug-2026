# AGENTS.md — danang-aug-2026

## Project

Static single-page travel itinerary for a Da Nang (峴港) family trip. Deployed via **GitHub Pages** (root branch).

## Architecture

- **No build system, no bundler, no dependencies.** Each `.html` file is fully self-contained with inline `<style>` and `<script>`.
- **Leaflet.js** loaded from CDN (`unpkg.com`) for interactive maps.
- **Google Fonts** loaded via `<link>` — Noto Serif TC, Noto Sans TC, Inter, Newsreader.
- Language: **Traditional Chinese (zh-Hant)**.

## File Structure

| File/Dir | Purpose |
|---|---|
| `index.html` | **Current live page** — green/teal resort theme, the deployed version |
| `index-v3.html` | Alternate v3 layout (editorial/warm tone, gold accent) |
| `preview-info-cards.html` | Info card component preview |
| `design-archive/` | Archived design explorations (`design-*-v2.html`, `sketch-*.html`) — not deployed |
| `og.png` | Open Graph image |

When editing the live site, work in `index.html` only. Other files are design artifacts.

## Deployment

- GitHub Pages serves from the default branch root.
- `.nojekyll` prevents Jekyll processing (underscores in filenames would otherwise be ignored).
- Push to `main` → live immediately. No build step.

## Development Workflow

1. Edit `index.html` directly.
2. Open in browser to preview — no dev server needed.
3. Commit and push to deploy.

## Key Patterns

- **CSS custom properties** in `:root` for theming (colors, fonts, radii, shadows).
- **Dark mode** via `.dark` class on `<body>` — toggled by `.theme-btn`.
- **Day-based navigation**: sticky tab bar switches between `.panel` sections.
- **Leaflet map**: pins, popups, and bottom-sheet info panels for each location.
- **Mobile-first**: responsive breakpoints at ~768px and ~900px.
- **Minified inline CSS** — no whitespace in production styles for size.

## Gotchas

- **Mobile Safari**: day-tab click handling needs explicit event handling (fixed in `9de1f2a`).
- **Grid on mobile**: use explicit `grid-template-columns` — implicit grids break on iOS (fixed in `47b09ec`).
- **No `<style>` externalization** — everything stays inline; the page must remain a single file.
- **CDN dependencies**: Leaflet and Google Fonts are external; the page won't render maps offline.

## Refactoring Notes (May 2026)

- `spots` data array reformatted — one object per block, properties on own lines.
- `switchDay` uses `querySelector`/`getElementById` — no double loops.
- `filterMapDay` uses `data-filter` attributes on buttons — no `onclick` string parsing.
- All `.dark` CSS consolidated into a single block before `/* ═══ Responsive ═══ */`.
- `.story-photo` uses `content-visibility: auto` for rendering performance.
- `aria-pressed` on theme toggle is now correctly synced with localStorage.

## Git

- Commit messages follow conventional format (`fix:`, `refactor:`, etc.).
- Recent history shows iterative design → refinement → bugfix flow.
