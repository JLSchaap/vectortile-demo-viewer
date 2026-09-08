# Agent Instructions

Angular app. BGT vector tiles. OpenLayers. Local Mapbox styles.

## Stack

- Angular 20.3.16; CLI 20.3.14; TypeScript 5.8.3; RxJS 7.8.2.
- OpenLayers 10.5.0; ol-mapbox-style 12.6.0; MapLibre spec 24.4.1.
- Material/CDK 20.2.2; ngx-color-picker 16.0.0; zone.js 0.15.1.
- Angular ESLint 19.3.0; Mapbox styles use `gl-style-validate`.
- Karma 6.4.4; Jasmine 5.6.0; Cypress 15.9.0; image diff 2.5.0.

## Paths

- App: `projects/vectortile-demo/src`.
- Features: `src/app/{olmap,search,searchnew,objectinfo,mapexport,mapstyler,custom-tile,demobox,location,showlink}`.
- Browser tests: `cypress/e2e/`; visualisation filters, recent selection, scrolling, TOP10NL, map-width checks.
- Generated API: `src/app/api/locatieserver/v3/**`. Never edit.
- Styles/assets: `src/mapboxstyles/**`. Build path: `styles/*`.
- Environments: `src/environments/{environment.ts,environment.prod.ts}`.

## Contracts

- `AppComponent`: selects `Visualisatie`; composes features.
- `SearchComponent`: calls `DefaultService.suggestGet(...)`; selection calls `LocationService.zoomto(wkt)`.
- `LocationService`: shared view state. Keep observable/`BehaviorSubject` contract.
- `OlmapComponent`: observes location; emits `changeView(...)` on `moveend`; sends feature/style to `ObjectinfoComponent`, map to `MapexportComponent`.
- `AppComponent`: search/category visualisation UI; categories `Alle`, `BGT`, `BAG`, `BRT`, `TOP10NL`, `DKK`, `Bestuurlijke gebieden`, `Wkpb`, `Aangepast`; stores only last 3 recent selections under `visualisatieRecent`; no favorites.
- `#map1` and OpenLayers canvas: full viewport `100vw` x `100vh`.

## Commands

- Install: `npm ci`.
- Dev/prod: `npm start` / `npm run startp`.
- Build: `npm run build`.
- Watch: `npm run watch`.
- Unit: `npm run ngtest` / `npm run ngtestci`.
- E2E: `npm run testng` / `npm run e2e`; interactive: `npm run open`.
- Focused E2E: `npx cypress run --spec cypress/e2e/testvisualisations.cy.ts` with running `npm start`.
- Lint: `npm run lint`.
- Styles: `npm run val`; format: `npm run format:styles`.
- Deploy: `npm run deploy`.

## Rules

- Keep feature code, templates, SCSS together.
- Keep standalone components and module-bootstrapped `AppModule`.
- Type public members/returns. No new `any`.
- Keep domain names: `Visualisatie`, `weergavenaam`.
- Add focused tests for behavior changes.
- Cypress: use `data-testid`, roles, stable IDs; use `{ force: true }` when moving map layers destabilize clicks.
- Move/rename styles only with `angular.json` and reference updates.
- Keep sprite, glyph, source, tile URLs consistent.
- Endpoint change? Check both environment files.
- Build has bundle/style budgets.
- `npm run valbag` points to missing `src/mapboxstyles/bagstd.json`. BAG styles live in `src/mapboxstyles/bag/`. Verify first.
- `npm run val`: BRK, BGT background/standard, tactile, WKPB. Validate BAG/BRT separately.
- Project Cypress config has `baseUrl: http://localhost:4200`; root config has no `baseUrl`, so root specs use explicit URLs.
- Root Cypress editor diagnostics may miss `cy`/`describe` types; root config has no dedicated Cypress `tsconfig`.
- Keep map sizing `100vw`/`100vh`; `99vmin` and body margins narrow wide-screen canvas or create overflow.
- npm `agents:update` scripts update `AGENTS.md` only. Use `/update-agents` for both guides.

## Updating Instructions

Stack/structure/tooling/command change? Run `/update-agents`. Updates `AGENTS.md` and this file. Keep logically aligned.
