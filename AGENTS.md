# Kingdoom Library Agent Context

Use this file as local guidance for Jules, Codex, Antigravity, and other AI coding agents working in this repository.

## Project Overview

Kingdoom Library is a static, standalone web application that hosts the lore, rules, beginner's guide, official races, templates, and downloads (like the Android APK) for the Kingdoom gaming roleplay ecosystem.

## Repository Architecture

- `index.html`: Contains all the semantic HTML content, meta tags, lore sections, tables, and markup.
- `styles.css`: Full responsive stylesheet providing a premium book/codice aesthetic (dark theme, warm parchment accents, and animations).
- `app.js`: Main frontend logic including search filter functionality, race filtering, reading progress tracker, and copy-paste character template helpers.
- `package.json`: Project package configuration.
- `test-site.mjs`: Script to validate the structural integrity of the project without heavy test suites.

## Project Guardrails

- **Ecosystem Repositories**:
  - `Kingdoom-sync` (in `Kingdoom` folder): React frontend & panel.
  - `kingdoom-bot`: WhatsApp bot logic.
  - `kingdoom-library`: This repo.
- **Pure Web Technologies**: Avoid adding framework dependencies like React, Vue, or build compilers unless explicitly asked. Keep it pure HTML, CSS, and JS.
- **Aesthetic Consistency**: Ensure new features fit the book/codice visual language (warm colors, clean typography, responsive layout).

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Local operational paths:
- `graphify-out/` stays in the project root because Graphify, Codex, and Antigravity all look for `graphify-out/graph.json` there. It is local and ignored by Git.
- `.codex/hooks.json` is local and ignored by Git. Refresh it with `npm run graphify:setup`.

Rules:
- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output.
- For audits, debugging, architecture review, feature impact analysis, or handoff work, prefer Graphify before broad manual browsing.
- For library search, indexing, page rendering, or UI/styles organization, prefer Graphify first.
- If a change may affect connected modules, use Graphify to find neighbors and dependency clusters before editing.
- Run `npm run graphify:setup` once per clone or when hooks and local Graphify wiring need repair.
- Run `npm run graphify:update` after structural code changes that are still uncommitted, or before asking Graphify-heavy architecture questions during an active edit session.
- Run `npm run graphify:doctor` when another AI agent reports stale graph answers, missing hooks, or missing local Graphify state.
- Dirty `graphify-out/` files are expected after hooks or incremental updates; dirty graph files are not a reason to skip Graphify. Only skip Graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, prefer `npm run graphify:update` over raw CLI calls so Codex hooks and repo conventions stay aligned.
