# Bundle Builder Monorepo

A React bundle-builder frontend and an Express API, managed as one npm-workspace repository.

## Repository layout

```text
apps/
  web/                  React 19 + TypeScript + Vite client
  api/                  Express API and production web host
scripts/
  dev.mjs               Starts both development servers
```

The API owns the catalog at `apps/api/public/data.json` and serves it at `GET /api/data`.
The client consumes `/api/data`; in development, Vite proxies that path to the API on port `3000`.

## Prerequisites

- Node.js 22 or newer
- npm 10 or newer

## Install

From the repository root:

```bash
npm install
```

This installs dependencies for both workspace packages. The committed root `package-lock.json` enables reproducible CI and production installs with `npm ci`.

## Development

Start both applications together:

```bash
npm run dev
```

Services:

- Web UI: `http://localhost:5173`
- API: `http://localhost:3000`
- Data endpoint: `http://localhost:3000/api/data`
- Health check: `http://localhost:3000/health`

To run them independently:

```bash
npm run dev:api
npm run dev:web
```

The frontend automatically proxies `/api/*` to the API during development. For a different API origin, copy `apps/web/.env.example` to `apps/web/.env.local` and set `VITE_BUNDLE_DATA_URL`.

## Quality checks

```bash
npm run test
npm run lint
npm run build
```

The unit tests cover reducer transitions, derived review and pricing calculations, API payload validation, and the API's health/data endpoints. `npm run build` builds the Vite app first, then compiles the API.

## Production

The production API serves both the built React app and `/api/data` from the same origin.

```bash
npm ci
npm run build
npm start
```

The server listens on port `3000` by default. Set `PORT` to change it:

```bash
PORT=8080 npm start
```

On PowerShell:

```powershell
$env:PORT = 8080
npm start
```

After deployment, open the application at the server root. The API remains available at `/api/data`, and deployment monitoring can use `/health`.

## API contract

`GET /api/data` returns:

```ts
interface ProductData {
  products: Product[];
  initialCart: Record<string, number>;
}
```

The frontend validates this response at runtime before it initializes bundle state. LocalStorage only retains the customer bundle configuration; product catalog data always comes from the API.