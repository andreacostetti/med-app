# med-app

A SvelteKit web application (with optional Capacitor mobile wrappers) styled with Tailwind CSS v4.

## Stack

- **Framework**: SvelteKit 2 (Svelte 5, runes mode)
- **Bundler / Dev server**: Vite 8
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite`
- **Server adapter**: `@sveltejs/adapter-node` (Node server in production)
- **Mobile (optional)**: Capacitor 8 (Android / iOS wrappers under `android/`, `ios/`)
- **Runtime**: Node.js 22 (required by `@capacitor/cli@8`)

## Project Layout

- `src/app.html` — HTML shell (loads Google Fonts and Material Symbols)
- `src/routes/` — SvelteKit routes
  - `(app)/home/+page.svelte`
  - `(app)/test/+page.svelte`
- `src/lib/` — Shared components (`navbar.svelte`, `bottom-bar.svelte`, `module-card.svelte`, `test-card.svelte`) and `index.js`
- `static/` — Static assets served as-is
- `vite.config.js` — Vite + SvelteKit + Tailwind plugin; dev server bound to `0.0.0.0:5000` with `allowedHosts: true` so the Replit iframe proxy can reach it
- `svelte.config.js` — Uses `adapter-node`
- `capacitor.config.json`, `android/`, `ios/` — Mobile wrappers (not used in the Replit web workflow)

## Replit Setup

- **Workflow**: `Start application` runs `npm run dev` and serves on port 5000 (webview).
- **Dev host**: `0.0.0.0:5000`, all hosts allowed (required for Replit's proxied preview iframe).
- **Deployment**: Configured as `autoscale`
  - Build: `npm run build`
  - Run: `node build` (output of `adapter-node`)

## Common Commands

- `npm run dev` — Start the Vite dev server (port 5000)
- `npm run build` — Build for production via `adapter-node`
- `npm run preview` — Preview the production build locally
