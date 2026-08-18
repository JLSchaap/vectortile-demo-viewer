# AGENTS.md

## Purpose
- This repository contains one Angular application for viewing BGT vector tiles with OpenLayers and local Mapbox style assets.
- Treat this file as the execution guide for coding agents in this repository.

## Tech Stack
- Angular 20 with Angular CLI/build, TypeScript 5.8, and RxJS 7.8.
- OpenLayers 10 with `ol-mapbox-style` and MapLibre style-spec tooling.
- Angular Material, `ngx-color-picker`, and `zone.js`.
- Unit tests use Karma/Jasmine; end-to-end and visual tests use Cypress.
- Angular ESLint provides linting; Mapbox styles use `gl-style-validate`.

## Project Structure
- Workspace app: `projects/vectortile-demo`; source root: `projects/vectortile-demo/src`.
- Feature components live under `projects/vectortile-demo/src/app`:
  - `olmap/`: map rendering, style switching, and map interactions.
  - `search/` and `searchnew/`: PDOK suggest search UI variants.
  - `objectinfo/`: selected feature properties and style-based color display.
  - `mapexport/`: export the current map canvas as PNG.
  - `mapstyler/`, `custom-tile/`, `demobox/`, `location/`, and `showlink/`: supporting map and demo UI.
- `location.service.ts`: shared map-view state and search-driven recentering.
- `api/locatieserver/v3/`: generated PDOK client; do not edit manually.
- `environments/`: development and production endpoint configuration.
- `mapboxstyles/`: style JSON, sprites, and glyph assets, copied to the build as `styles/*` by `angular.json`.

## Layer Connections
```mermaid
graph TD
  AppComponent -->|selected Visualisatie| OlmapComponent
  SearchComponent -->|suggestGet(...)| DefaultService
  SearchComponent -->|zoomto(wkt)| LocationService
  LocationService -->|currentLocation| OlmapComponent
  OlmapComponent -->|changeView() on moveend| LocationService
  OlmapComponent -->|selected feature + style| ObjectinfoComponent
  OlmapComponent -->|map instance| MapexportComponent
```

- `AppComponent` owns visualisation selection and composes the map, search, location, link, and display components.
- `SearchComponent` calls generated `DefaultService.suggestGet(...)`; selection sends WKT data to `LocationService.zoomto(...)`.
- `OlmapComponent` observes location changes, updates the map center, and sends move updates through `LocationService.changeView(...)`.
- `OlmapComponent` passes selected feature/style context to `ObjectinfoComponent` and the map instance to `MapexportComponent`.

## Build And Test Commands
- Install: `npm ci`
- Development server: `npm start`; production server: `npm run startp`.
- Build: `npm run build` (style validation, headless unit tests, then production build).
- Watch build: `npm run watch`.
- Unit tests: `npm run ngtest` or CI-style `npm run ngtestci`.
- E2E tests: `npm run testng`; interactive Cypress: `npm run open`; Angular Cypress target: `npm run e2e`.
- Lint: `npm run lint` (runs Angular ESLint with `--fix`).
- Style validation: `npm run val`; formatting: `npm run format:styles`.
- GitHub Pages deploy: `npm run deploy`.

## Code Conventions
- Preserve existing mixed Dutch/English domain vocabulary such as `Visualisatie` and `weergavenaam`.
- Keep feature logic in its component folder with templates and styles colocated.
- Preserve the existing mix of standalone component imports and the custom-bootstrapped `AppModule`.
- Prefer explicit types on new public members and return values; avoid introducing new `any`.
- Use `LocationService` as the shared view-state channel and preserve its observable/`BehaviorSubject` contract.
- Component styles are primarily SCSS; preserve an existing stylesheet extension unless migration is required.
- Add focused tests near behavior changes; avoid broad test refactors.

## High-Risk Pitfalls
- Treat `projects/vectortile-demo/src/app/api/locatieserver/v3/**` as generated code.
- Do not rename or move files under `projects/vectortile-demo/src/mapboxstyles/` without updating asset mappings and style references.
- Keep sprite, glyph, source, and tile URLs consistent; run the relevant `val*` script after style changes.
- Tile URLs and environment replacements are environment-sensitive.
- The deploy script contains the GitHub Pages repository, base href, and maintainer identity; change it deliberately.
- Production builds enforce initial bundle and component-style budgets.
- Keep Karma/Cypress config paths and the Angular project name `vectortile-demo` aligned with `angular.json`.

## Key References
- General project README: [README.md](README.md)
- Generated API notes: [projects/vectortile-demo/src/app/api/locatieserver/v3/README.md](projects/vectortile-demo/src/app/api/locatieserver/v3/README.md)
- Build and asset mapping: [angular.json](angular.json)
- CI/deploy workflow: [.github/workflows/buildanddeploy.yml](.github/workflows/buildanddeploy.yml)
