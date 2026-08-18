AI agents and robots: read [AGENTS.ai.md](AGENTS.ai.md) first for the compact operational instructions.

# AGENTS.md

## Purpose
- This repository contains one Angular application for viewing BGT vector tiles with OpenLayers and local Mapbox style assets.
- Treat this file as the execution guide for coding agents in this repository.

## Tech Stack
- Angular 20.3.16 with Angular CLI/build 20.3.14, TypeScript 5.8.3, and RxJS 7.8.2.
- OpenLayers 10.5.0 with `ol-mapbox-style` 12.6.0 and `@maplibre/maplibre-gl-style-spec` 24.4.1.
- Angular Material and CDK 20.2.2, `ngx-color-picker` 16.0.0, and `zone.js` 0.15.1.
- Unit tests use Karma 6.4.4/Jasmine 5.6.0; end-to-end and visual tests use Cypress 15.9.0 with `cypress-image-diff-js` 2.5.0.
- Angular ESLint 19.3.0 provides linting; Mapbox styles use `gl-style-validate`.

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
- `mapboxstyles/`: style JSON, sprites, and glyph assets, copied to the build as `styles/*` by `angular.json`. Root styles include BGT background/standard, tactile, annotated administrative areas, and line-test styles; BAG, BGT, BRK, and BRT variants are grouped in subdirectories where applicable.

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
- Build: `npm run build` (style validation, headless unit tests, then the default production build); output is under `dist/vectortile-demo/browser`.
- Watch build: `npm run watch`.
- Unit tests: `npm run ngtest` or CI-style `npm run ngtestci`.
- E2E tests: `npm run testng`; interactive Cypress: `npm run open`; Angular Cypress target: `npm run e2e`.
- Lint: `npm run lint` (runs Angular ESLint with `--fix`).
- Style validation: `npm run val`; formatting: `npm run format:styles`.
- GitHub Pages deploy: `npm run deploy`.
- BAG validation: `npm run valbag` currently targets a legacy `bagstd.json` path; verify or correct that path before relying on the command.

## Code Conventions
- Preserve existing mixed Dutch/English domain vocabulary such as `Visualisatie` and `weergavenaam`.
- Keep feature logic in its component folder with templates and styles colocated.
- Preserve the existing mix of standalone component imports and the module-bootstrapped `AppModule`.
- Prefer explicit types on new public members and return values; avoid introducing new `any`.
- Use `LocationService` as the shared view-state channel and preserve its observable/`BehaviorSubject` contract.
- Component styles are primarily SCSS; preserve an existing stylesheet extension unless migration is required.
- Add focused tests near behavior changes; avoid broad test refactors.

## High-Risk Pitfalls
- Treat `projects/vectortile-demo/src/app/api/locatieserver/v3/**` as generated code.
- Do not rename or move files under `projects/vectortile-demo/src/mapboxstyles/` without updating asset mappings and style references.
- Keep sprite, glyph, source, and tile URLs consistent; run the relevant `val*` script after style changes.
- Note that `npm run val` covers BRK, BGT background, standard, tactile, and WKPB styles; use `valbag` or `valbrt` separately when changing BAG or BRT styles.
- The `valbag` script currently references `projects/vectortile-demo/src/mapboxstyles/bagstd.json`, which is absent; the BAG styles are under the `mapboxstyles/bag/` directory.
- The npm `agents:update` scripts still request updates to `AGENTS.md` only; use `/update-agents` to update both agent guides.
- Tile URLs and environment replacements are environment-sensitive.
- The deploy script contains the GitHub Pages repository, base href, and maintainer identity; change it deliberately.
- Production builds enforce initial bundle and component-style budgets.
- `angular.json` replaces `environment.ts` with `environment.prod.ts` for production builds; verify endpoint changes in both environment files.
- Keep Karma/Cypress config paths and the Angular project name `vectortile-demo` aligned with `angular.json`.
- The `agents:update` npm script invokes the CLI directly; the reusable `/update-agents` prompt is available through VS Code Chat.

## Key References
- General project README: [README.md](README.md)
- Reusable AGENTS update prompt: [.github/prompts/update-agents.prompt.md](.github/prompts/update-agents.prompt.md)
- Generated API notes: [projects/vectortile-demo/src/app/api/locatieserver/v3/README.md](projects/vectortile-demo/src/app/api/locatieserver/v3/README.md)
- Build and asset mapping: [angular.json](angular.json)
- CI/deploy workflow: [.github/workflows/buildanddeploy.yml](.github/workflows/buildanddeploy.yml)
