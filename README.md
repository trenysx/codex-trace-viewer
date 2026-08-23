# codex-trace-viewer

> **First trace viewer for openai/codex — #1 trending today (2026-08-23). Parse Codex JSONL, render timeline, search, stats. Local-first.**

No viewer exists for Codex yet (vs 3+ for Claude). This is first mover.

``bash
npx codex-trace-viewer view examples/sample-codex.jsonl
npx codex-trace-viewer stats examples/sample-codex.jsonl
npx codex-trace-viewer search examples/sample-codex.jsonl "write"
npx codex-trace-viewer export examples/sample-codex.jsonl report.md
npx codex-trace-viewer demo
``

## Features

- **Codex parser** src/parser/codex.js:1 (codex/tool_calls/timestamp/duration/model) + generic fallback
- **Analyzer** src/analyzer.js:1 — counts by role, toolCalls, totalDuration, warnings (slow >5s, error hints), models
- **Reporter** src/reporter.js:1 — timeline table + stats table
- **Search** — filter turns by term
- **Export** — markdown report

## Why Codex?

openai/codex is #1 trending Aug 23 (new entrant, orangebot.ai), zero tooling. High demoability (timeline video), high shareability.

## Architecture

``
src/parser/codex.js → parser/index.js → analyzer.js → reporter.js → cli.js
``

## Test

`npm test` 6/6

## License

Apache-2.0
