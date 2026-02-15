# Scavenger Hunt - Project Guidelines

## Project Overview
- **Type:** Next.js Static Site (SSG/SPA).
- **Deployment:** GitHub Pages (via `output: 'export'`).
- **Framework:** Next.js 16 (App Router) + TypeScript.
- **Styling:** React Bootstrap + CSS Modules.
- **Maps:** **Leaflet** via `react-leaflet` (OpenStreetMap tiles).
- **3D:** React Three Fiber (`@react-three/fiber` + `@react-three/drei`) for interactive 3D item puzzles.
- **i18n:** Custom client-side i18n via React Context (`src/i18n/`). Default language: **French**. Supported: `fr`, `en`.
- **Core Logic:** Config-driven game engine (`config.json` validated by Zod schema in `src/lib/config-schema.ts`).

## Development Commands
- **Install Deps:** `npm install`
- **Start Dev Server:** `npm run dev` (Runs on http://localhost:3000)
- **Lint Code:** `npm run lint`
- **Validate Config:** `npm run validate:config` (Checks `config.json` schema)
- **Production Build:** `npm run build` (Generates static files in `out/`)
- **Preview Production:** `npx serve@latest out` (After building)

## Testing (Playwright)
- **Run All Tests:** `npx playwright test`
- **Debug Tests:** `npx playwright test --debug`
- **Map Testing:** Tests interact with Leaflet markers via internal text/labels, as canvas interactions are tricky.

## Architecture & Patterns

### Map Implementation
- **Library:** `react-leaflet` (v5) & `leaflet`.
- **Tiles:** OpenStreetMap (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
- **Components:**
  - `src/components/Map/Map.tsx`: Main wrapper. MUST verify `window` exists (client-side only) or use dynamic imports with `{ ssr: false }`.
  - `src/components/Map/MarkerWithPopup.tsx`: Handles individual points of interest.
  - `src/components/Map/AutocompleteControl.tsx`: Custom search using `leaflet-geosearch`.
- **Icons:** Leaflet default icons behave poorly with Next.js bundling. Use explicit `L.icon` definitions referencing `/assets/`.

### Item System (Game Puzzles)
Items are interactive puzzle components rendered via `ItemFactory.tsx` using a factory pattern. Each item type exports a component, props type, and button trigger.

| Item Type         | Description                                                                                  |
|-------------------|----------------------------------------------------------------------------------------------|
| `clickable-image` | Image with positioned clickable areas that trigger actions (keyword reveal, card flip, etc.) |
| `scratch-card`    | Canvas-based scratch overlay revealing hidden text/keywords                                  |
| `card-flip`       | Two-sided card with front/back images                                                        |
| `page-flip`       | Multi-page flipbook component                                                                |
| `three-fiber`     | 3D interactive object using React Three Fiber (textured meshes with hidden keyword)          |
| `magnifier`       | Image with a magnifying glass to find a hidden keyword at specific coordinates               |
| `image`           | Simple static image display                                                                  |
| `keyword`         | Direct keyword text (no interactive puzzle)                                                  |

### i18n
- **Provider:** `I18nProvider` wraps the app in `Providers.tsx`.
- **Hook:** `useTranslation()` returns `{ language, setLanguage, t }`.
- **Translation keys:** Defined in `src/i18n/translations.ts` (type-safe via `TranslationKey`).
- **Adding translations:** Add the key to both `fr` and `en` objects in `translations.ts`.

### General Rules
- **Data Source:** Game data is defined in `config.json` at root, validated by `src/lib/config-schema.ts`.
- **Routing:** Dynamic routes via `src/app/[slug]/page.tsx`.
- **State:** React Context API (`PhraseContext`, `ToastContext`, `I18nContext`).
- **Progress:** Game progress tracked via `useHuntProgress` hook with localStorage.

## Critical Rules for Claude
1.  **NO Google Maps:** Do not suggest `@vis.gl/react-google-maps` or `google.maps` types. Use `L.Map`, `L.Marker`, or `react-leaflet` components.
2.  **Client-Side Only:** Leaflet and Three.js require the `window` object. Ensure these components are dynamically imported or checked for client execution to avoid SSR build errors (`window is not defined`).
3.  **Static Export:** Do NOT use `next/image` optimization features requiring a server. Use standard `<img>` or Bootstrap `Image`.
4.  **Mobile First:** UI must be touch-friendly. Map containers must have explicit CSS height (often `100%` or `100vh`).
5.  **i18n:** All user-facing strings should use the `t()` function from `useTranslation()`. Never hardcode French or English text in components.