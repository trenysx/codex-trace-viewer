export function canParseCodex(content, fileName) {
  if (fileName && fileName.includes("codex")) return true;
  const sample = content.slice(0, 2000).toLowerCase();
  return sample.includes("codex") || sample.includes("openai") || sample.includes("tool_calls") || sample.includes("duration_ms");
}
export function parseCodex(content) {
  const lines = content.split("\n").filter(Boolean);
  const turns = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    try {
      const obj = JSON.parse(line);
      const role = obj.role || obj.type || (obj.tool_calls ? "assistant" : "unknown");
      const text = obj.content || obj.message || obj.text || JSON.stringify(obj).slice(0, 300);
      const ts = obj.timestamp || obj.created_at || null;
      const duration = obj.duration_ms || obj.duration || null;
      const model = obj.model || null;
      const tools = obj.tool_calls || obj.tools || [];
      turns.push({ idx: i, role, text: String(text).slice(0, 400), timestamp: ts, duration, model, toolCalls: Array.isArray(tools) ? tools : [], raw: obj });
    } catch { turns.push({ idx: i, role: "text", text: line.slice(0, 400), raw: null }); }
  }
  return { source: "codex", turns, total: turns.length };
}
