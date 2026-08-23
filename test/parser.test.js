import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTrace } from "../src/parser/index.js";
import { analyze, search } from "../src/analyzer.js";

test("parseTrace codex", () => {
  const content = `{"role":"user","content":"hi"}` + "\n" + `{"role":"assistant","content":"hello","tool_calls":[{"name":"read"}]}`;
  const t = parseTrace(content, "codex.jsonl");
  assert.equal(t.turns.length, 2);
});

test("analyze counts", () => {
  const content = `{"role":"user","content":"hi"}` + "\n" + `{"role":"assistant","content":"x","duration_ms":6000}`;
  const t = parseTrace(content, "sample.jsonl");
  const s = analyze(t);
  assert.equal(s.total, 2);
  assert.ok(s.warnings.some(w => w.type === "slow"), JSON.stringify(s.warnings));
});

test("search", () => {
  const content = `{"role":"user","content":"hello world"}` + "\n" + `{"role":"assistant","content":"hi"}`;
  const t = parseTrace(content, "a.jsonl");
  const hits = search(t, "hello");
  assert.equal(hits.length, 1);
});

test("demo trace stats", () => {
  const sample = `{"role":"user","content":"hello codex"}` + "\n" + `{"role":"assistant","content":"hi","tool_calls":[{"name":"read"}],"duration_ms":1200}` + "\n" + `{"role":"tool","content":"file"}`;
  const t = parseTrace(sample, "codex.jsonl");
  const s = analyze(t);
  assert.equal(s.toolCalls, 1);
});

test("generic fallback", () => {
  const content = `{"type":"unknown","message":"test"}`;
  const t = parseTrace(content, "generic.jsonl");
  assert.ok(t.turns.length === 1);
});
