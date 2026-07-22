# AGENTS.md

## Purpose
- This repository contains a single Angular demo app for viewing BGT vector tiles with OpenLayers and local Mapbox style assets.
- Use this file as the default execution guide for coding agents working in this repo.

## Tech Stack
- Angular 12 (`@angular/* ~12.2.x`) with Angular CLI 12.
- TypeScript 4.3 (`strict: true` in root TypeScript config).
- RxJS 6.6.
- OpenLayers 6 (`ol`) + `ol-mapbox-style`.
- Test stack: Karma + Jasmine.

## Project Structure
- App root: `projects/vectortile-demo/src/app`.
- Main feature components:
  - `olmap/`: map rendering, style switching, map interactions.
  - `search/`: PDOK suggest search UI.
  - `objectinfo/`: selected feature properties + style-based color display.
  - `mapexport/`: export current map canvas as PNG.
- Shared state/service:
  - `location.service.ts`: map view state and search-driven recentering.
- API client:
  - `api/locatieserver/v3/`: generated PDOK client code. Do not modify this code, it is only generated once consider this as a static part of this codebase. 
- Static map style assets:
  - `src/mapboxstyles/` (style JSON, sprites, glyph fonts), served as `styles/*` via Angular assets config.

## Layer Connections
- Dependency wiregraph:
```mermaid
graph TD
  AppComponent -->|Input visualisation| OlmapComponent
  SearchComponent -->|suggestGet(...)| DefaultService
  SearchComponent -->|zoomto(wkt)| LocationService
  LocationService -->|currentLocation| OlmapComponent
  OlmapComponent -->|changeView() on moveend| LocationService
  OlmapComponent -->|selected feature + style| ObjectinfoComponent
  OlmapComponent -->|map instance| MapexportComponent
```

- Composition root:
  - `AppComponent` wires UI state and passes selected visualisation into `OlmapComponent`.
- Search -> map flow:
  - `SearchComponent` calls generated `DefaultService.suggestGet(...)`.
  - Selected result sends WKT centroid into `LocationService.zoomto(...)`.
  - `OlmapComponent` subscribes to `LocationService.currentLocation` and updates map center.
- Map -> shared state flow:
  - `OlmapComponent` emits map move updates through `LocationService.changeView(...)` on `moveend`.
- Map child tools:
  - `OlmapComponent` passes selected feature/style context to `ObjectinfoComponent`.
  - `OlmapComponent` passes map instance to `MapexportComponent`.

## Build And Test Commands
- Install: `npm ci`
- Dev server: `npm start` (Angular serve, development config)
- Build: `npm run build` (production by default)
- Watch build: `npm run watch`
- Unit tests: `npm test`
- Deploy (GitHub Pages): `npm run deploy`
- Lint: no lint script is configured; do not assume `npm run lint` exists.

## Code Conventions
- Preserve current naming style:
  - Domain terms are mixed Dutch/English (`Visualisatie`, `weergavenaam`, etc.).
  - Keep existing domain vocabulary; do not rename broadly for language consistency only.
- Angular conventions:
  - Keep feature logic inside its component folder.
  - Keep templates/styles colocated with components.
- TypeScript conventions in this repo:
  - Prefer explicit types on new public members and function returns.
  - Avoid introducing new `any`; if unavoidable, keep it tightly scoped and documented.
  - Existing code uses occasional non-null assertions (`!`); do not expand this pattern without need.
- RxJS conventions:
  - Use `LocationService` as the shared view-state channel.
  - Keep observable usage simple and consistent with current `BehaviorSubject` pattern.
- Styling conventions:
  - Default component style extension is SCSS.
  - `SearchComponent` currently uses CSS; preserve existing extension unless there is a clear migration reason.
- Testing conventions:
  - Existing tests are mostly creation/smoke tests.
  - For behavior changes, add focused tests near changed logic instead of broad refactors.

## High-Risk Areas And Pitfalls
- Generated API code:
  - Treat `projects/vectortile-demo/src/app/api/locatieserver/v3/**` as generated.
  - Avoid manual edits to generated files unless regeneration is explicitly intended.
- Map style/static assets:
  - Do not rename or move files under `src/mapboxstyles/` without updating asset references.
  - Validate style JSON/sprite/glyph paths after edits.
- Endpoint/deployment coupling:
  - Tile URL and deploy settings are environment-sensitive.
  - Changing `tileurl.ts`, `package.json` deploy script, or GitHub workflow may break demo deployment.

## Key References
- General project README: [README.md](README.md)
- Generated API notes: [projects/vectortile-demo/src/app/api/locatieserver/v3/README.md](projects/vectortile-demo/src/app/api/locatieserver/v3/README.md)
- Build and asset mapping: [angular.json](angular.json)
- CI/deploy workflow: [.github/workflows/buildanddeploy.yml](.github/workflows/buildanddeploy.yml)
