import { test } from "node:test";
import assert from "node:assert/strict";
import { parseTrace } from "../src/parser/index.js";
import { analyze } from "../src/analyzer.js";

test("reporter does not throw on empty", () => {
  const t = parseTrace("", "empty.jsonl");
  const s = analyze(t);
  assert.equal(s.total, 0);
});
