# VectortileDemoViewer

This [viewer](https://pdok.github.io/vectortile-demo-viewer/) is made to demonstrate the capabilities of the Vectortiles to developers.
Enjoy the [demo online](https://pdok.github.io/vectortile-demo-viewer/).

## Development server

Run `npm start` for a development server. Navigate to `http://localhost:4200/`. The app automatically reloads when source files change. Use `npm run startp` for the production configuration.

## Build

Run `npm run build` to validate styles, run headless unit tests, and create a production build. Artifacts are stored in `dist/vectortile-demo/browser`.

## Running unit tests

Run `npm run ngtest` to execute unit tests via [Karma](https://karma-runner.github.io). Use `npm run ngtestci` for a headless CI run.

## Running end-to-end tests

Run `npm run testng` for headless Cypress tests. Use `npm run e2e` for the Angular Cypress target or `npm run open` for interactive Cypress.

## Repository instructions

AI agents and robots: read [AGENTS.ai.md](AGENTS.ai.md) first for compact operational instructions. See [AGENTS.md](AGENTS.md) for the complete repository guide.

In VS Code Chat, run `/update-agents` after changes to the tech stack, structure, tooling, or commands. It updates both `AGENTS.md` and `AGENTS.ai.md`; the latter uses Caveman syntax for high information density.
