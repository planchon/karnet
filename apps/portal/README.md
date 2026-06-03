# Template

React 19 SPA starter for Karnet apps.

## Stack

- **React 19** with the React Compiler (dev only)
- **Vite 8** + **TypeScript 6**
- **TanStack Router** (file-based routes, code splitting)
- **TanStack Query** (shared client, route context)
- **Tailwind CSS 4** + **shadcn/ui** (Base UI)
- **Biome** via **Ultracite** for linting and formatting

## Scripts

```bash
pnpm dev        # start dev server
pnpm build      # production build (fast; no typecheck or lint)
pnpm typecheck  # TypeScript project references
pnpm preview    # preview production build
pnpm check      # lint
pnpm fix        # auto-fix lint/format issues
```

## Getting started

```bash
cp .env.example .env
pnpm install
pnpm dev
```

- `/` — minimal home page
- `/playground` — shadcn/ui component showcase (dev only)

## Environment

| Variable | Description |
| --- | --- |
| `VITE_APP_TITLE` | App title shown on the home page |

## Project layout

```
src/
  routes/          # TanStack Router file routes
  components/ui/   # shadcn/ui components
  lib/             # shared utilities (query client, cn)
  playground.tsx   # component showcase page
```

See [AGENTS.md](./AGENTS.md) for code standards.
