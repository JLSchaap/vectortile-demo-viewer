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
- `cypress/e2e/`: root Cypress browser scenarios for visualisation selection, filters, scrolling, TOP10NL selection, and viewport-width map checks.

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
- `AppComponent` visualisation UI supports search, source categories, recent selections, Escape closing, and local `visualisatieRecent` storage; favorites are not part of the feature.
- `#map1` and its OpenLayers canvas use the full viewport (`100vw` by `100vh`).

## Build And Test Commands
- Install: `npm ci`
- Development server: `npm start`; production server: `npm run startp`.
- Build: `npm run build` (style validation, headless unit tests, then the default production build); output is under `dist/vectortile-demo/browser`.
- Watch build: `npm run watch`.
- Unit tests: `npm run ngtest` or CI-style `npm run ngtestci`.
- E2E tests: `npm run testng`; interactive Cypress: `npm run open`; Angular Cypress target: `npm run e2e`.
- Focused visualisation E2E: `npx cypress run --spec cypress/e2e/testvisualisations.cy.ts` against a running `npm start` server.
- Lint: `npm run lint` (runs Angular ESLint with `--fix`).
- Style validation: `npm run val`; formatting: `npm run format:styles`.
- GitHub Pages deploy: `npm run deploy`.
- BAG validation: `npm run valbag` currently targets a legacy `bagstd.json` path; verify or correct that path before relying on the command.

## TypeScript and Angular Conventions

- **Explicit types**: Prefer explicit return types on public methods and properties; avoid `any`.
- **Components**: Keep component logic, templates, and styles colocated in the feature folder. Do not break apart component files.
- **Services**: Use `LocationService` as the primary shared view-state channel; preserve its observable/`BehaviorSubject` contract.
- **Module structure**: Preserve the existing mix of standalone component imports and the module-bootstrapped `AppModule`.
- **Domain vocabulary**: Maintain existing mixed Dutch/English vocabulary (e.g., `Visualisatie`, `weergavenaam`). Do not anglicize these terms.

## Mapbox Style Conventions

- **Style JSON locations**: All Mapbox styles live under `projects/vectortile-demo/src/mapboxstyles/`:
  - Root styles: `bgt_standaardvisualisatie.json`, `bgt_achtergrondvisualisatie.json`, `tactielevisualisatie.json`, and line-test styles.
  - Grouped variants: `bag/`, `bgt/`, `brk/`, `brt/` subdirectories.
- **Do not move files** without updating asset mappings in `angular.json` and all style references in code.
- **Validate after changes**: Run `npm run val` after any style JSON modification. For BAG styles, use `npm run valbag`; for BRT, use `npm run valbrt`.
- **Formatting**: Use `npm run format:styles` to format all style JSON files.

## Testing Conventions

- **Unit tests**: Use Karma/Jasmine. Run `npm run ngtest` for interactive mode or `npm run ngtestci` for CI headless mode.
- **Add focused tests near behavior changes**; do not refactor entire test suites in unrelated PRs.
- **E2E tests**: Use Cypress. Run `npm run testng` for headless, `npm run open` for interactive.
- **Browser selectors**: Prefer `data-testid`, semantic roles, and stable IDs such as `#visualisaties-DKK`; map motion can require Cypress `{ force: true }` clicks.
- **Visualisation coverage**: Keep tests for `Alle`, DKK, TOP10NL, search/category filtering, recent selection, menu scrolling, and full-width map/canvas layout.
- **Build includes tests**: `npm run build` runs `npm run ngtestci` before building; ensure all tests pass.

## Code Style

- **Linting**: Run `npm run lint` (Angular ESLint with `--fix`). Linter config is in `.eslintrc.json`.
- **SCSS**: Component styles use SCSS; preserve the `.scss` extension unless migration is explicitly required.

## Build and Deployment

- **Development**: `npm start` (serves at http://localhost:4200/).
- **Production server**: `npm run startp`.
- **Build process**:
  1. `npm run val` — validate Mapbox styles.
  2. `npm run ngtestci` — run headless unit tests.
  3. `ng build` — production build; output: `dist/vectortile-demo/browser`.
- **Watch mode**: `npm run watch` for development builds.
- **Deploy**: `npm run deploy` (GitHub Pages to PDOK repository; credentials and base href in `package.json`).

## Generated Code

- **Do not edit** `projects/vectortile-demo/src/app/api/locatieserver/v3/**` — this is generated code from PDOK client schema.
- **Update process**: If PDOK client changes, regenerate this directory using your client generator.

## Environment and Configuration

- **Environment files**: 
  - Development: `projects/vectortile-demo/src/environments/environment.ts`
  - Production: `projects/vectortile-demo/src/environments/environment.prod.ts`
  - `angular.json` swaps these for production builds; verify both files when changing endpoints.
- **URL configuration**: `urlQuad.ts` and `environment*.ts` control tile and API URLs.

## High-Risk Pitfalls

- **BAG validation**: The `npm run valbag` script references a legacy path (`projects/vectortile-demo/src/mapboxstyles/bagstd.json`), which is absent. BAG styles are under `mapboxstyles/bag/`; verify before relying on the command.
- **Tile URL consistency**: Keep sprite, glyph, source, and tile URLs aligned across all style JSON files. Mismatches break the viewer.
- **Cypress config paths**: Keep paths in `cypress.config.ts` and `projects/vectortile-demo/cypress.config.ts` aligned with `angular.json`.
- **Cypress base URLs**: `projects/vectortile-demo/cypress.config.ts` defines `http://localhost:4200`; root `cypress.config.ts` does not, so root specs must use an explicit URL or configure `baseUrl`.
- **Cypress type diagnostics**: Root Cypress specs may show missing `cy`/`describe` editor types because the root config has no dedicated Cypress `tsconfig`; check the project test setup before adding framework types.
- **Angular project name**: The workspace project is `vectortile-demo`; keep this name consistent in `angular.json` and all build scripts.
- **Bundle budgets**: Production builds enforce initial bundle and component-style budgets; verify build output against `angular.json` thresholds.
- **Viewport layout**: Do not restore `99vmin` map sizing or body margins; these make the map canvas narrower than wide screens. Keep `100vw`/`100vh` and check for horizontal overflow.
- `angular.json` replaces `environment.ts` with `environment.prod.ts` for production builds; verify endpoint changes in both environment files.
- Keep Karma/Cypress config paths and the Angular project name `vectortile-demo` aligned with `angular.json`.
- The `agents:update` npm script invokes the CLI directly; the reusable `/update-agents` prompt is available through VS Code Chat.

## Maintenance Matrix

When making changes to these file categories, update related files to maintain consistency:

| When You Change | Also Update | Why |
|-----------------|-------------|-----|
| Feature component (add/remove/rename) | `app.component.ts` or parent component imports; update tests | Layer connections, routing, parent-child bonds |
| `LocationService` (signature or observables) | Components consuming `currentLocation` or calling `changeView()` | Prevent runtime errors from changed contracts |
| Mapbox style JSON (any root style) | `stdstyles.ts` (enum), `mapboxstyles` export; test style switching | Style picker reflects current options; build includes all styles |
| Build command or Node version | `package.json`, `.github/workflows/buildanddeploy.yml`, `.github/workflows/copilot-setup-steps.yml` | CI/deployment uses correct toolchain |
| Environment endpoints (URLs, API keys) | Both `environment.ts` AND `environment.prod.ts` | Production builds use prod env; development uses dev |
| Test coverage or new test files | `projects/vectortile-demo/tsconfig.spec.json`, `karma.conf.cjs`, `cypress/` configs | Test runners discover tests; coverage thresholds stay current |
| Visualisation UI or selection behavior | `app.component.ts`, `app.component.html`, `app.component.scss`, `local-storage-service.ts`, app/Cypress specs | Keep categories, recent selection storage, styling, and browser coverage aligned |
| Map viewport sizing | `olmap.component.scss`, `styles.scss`, Cypress layout spec | Keep map and canvas full-width without horizontal overflow |
| PDOK API client (locatieserver) | Generated code in `projects/vectortile-demo/src/app/api/locatieserver/v3/`; do NOT edit manually | Keep generated code in sync with PDOK schema |
| Angular/TypeScript major version | `tsconfig.json`, `package.json`, `angular.json`, build scripts | Toolchain consistency; some APIs change between major versions |
| CI workflow or deploy process | `AGENTS.md` "Build And Test Commands" section | Documentation stays current for contributors |

## Key References
- General project README: [README.md](README.md)
- Reusable AGENTS update prompt: [.github/prompts/update-agents.prompt.md](.github/prompts/update-agents.prompt.md)
- Generated API notes: [projects/vectortile-demo/src/app/api/locatieserver/v3/README.md](projects/vectortile-demo/src/app/api/locatieserver/v3/README.md)
- Build and asset mapping: [angular.json](angular.json)
- CI/deploy workflow: [.github/workflows/buildanddeploy.yml](.github/workflows/buildanddeploy.yml)



