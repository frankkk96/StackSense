# StackSense

An interactive knowledge graph for AI / Data / Systems engineering. Every node is a concrete concept, open-source project, or programming language; every edge is a real dependency. Click a node to open a side panel with a one-line blurb, core concepts, related nodes, learning resources, and the questions you should be able to answer once you've internalized it.

Live: <https://stacksense.cc>

## Tech stack

- **Next.js 15** (App Router, static export)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (CSS-first config via `@theme`)
- **react-force-graph-2d** for the canvas-based force-directed layout
- **lucide-react** for icons

The whole site is statically exported (`output: 'export'`) — no server, no API. Data lives in `src/data/*.json` and is loaded into the client bundle at build time. EN/ZH locales are switched at runtime; the choice persists in `localStorage`.

## Run locally

```sh
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

Requires Node 20+.

## Project layout

```
src/
  app/            # Next.js App Router (layout.tsx, page.tsx)
  components/
    Graph/        # orchestrator + header / search / lang switcher / zoom controls
    SidePanel/    # node detail panel
  hooks/          # useLocale, useContainerSize, useGraphSearch
  lib/
    graph-canvas.ts   # theme tokens, label measurement, geometry, custom d3 force
    graph-data.ts     # locale-scoped lookups + panel derivation helpers
  data/
    graph.{en,zh}.json    # nodes + edges (edges are locale-agnostic)
    details.{en,zh}.json  # blurb, concepts, questions per node
    types.ts, site.ts
  i18n/strings.ts        # UI chrome strings
  styles/globals.css     # Tailwind import + @theme tokens + minimal base layer
```

## Adding or editing nodes

1. Add the node to both `src/data/graph.en.json` and `src/data/graph.zh.json` (same `id`, locale-specific `label`).
2. Optionally add a detail entry to `src/data/details.en.json` and `details.zh.json` (`blurb`, `concepts`, `questions`).
3. Add edges in `src/data/graph.en.json` (the EN file is the canonical source for topology — edges only carry IDs, so they apply to both locales).

## License

MIT
