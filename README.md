# StackSense

An interactive knowledge graph for AI / Data / Systems engineering. Every node is a concrete concept, open-source project, or programming language; every edge is a real dependency. Click a node to open a side panel with a one-line blurb, core concepts, related nodes, learning resources, and the questions you should be able to answer once you've internalized it.

Live: <https://stacksense.cc>

## What's in this repo

- [`src/data/graph.{en,zh}.json`](src/data) — the nodes and edges. Edges only carry IDs, so the EN file is the canonical topology; both locales render the same graph.
- [`src/data/details.{en,zh}.json`](src/data) — per-node `blurb`, `concepts`, and `questions`.
- [`src/i18n/strings.ts`](src/i18n/strings.ts) — UI chrome strings (search placeholder, section headings, etc.).

Corrections, missing nodes, and better blurbs are very welcome — open an issue or PR.

## License

MIT
