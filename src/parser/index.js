import { canParseCodex, parseCodex } from "./codex.js";
import { parseGeneric } from "./generic.js";

export function parseTrace(content, fileName) {
  if (canParseCodex(content, fileName)) {
    const res = parseCodex(content);
    if (res.turns.length > 0) return res;
  }
  return parseGeneric(content);
}
