export function parseGeneric(content) {
  const lines = content.split("\n").filter(Boolean);
  const turns = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    try {
      const obj = JSON.parse(line);
      const role = obj.role || obj.type || "unknown";
      const text = obj.content || obj.message || JSON.stringify(obj).slice(0, 300);
      const duration = obj.duration_ms || obj.duration || null;
      const model = obj.model || null;
      const tools = obj.tool_calls || obj.tools || [];
      turns.push({ idx: i, role, text: String(text).slice(0, 400), timestamp: obj.timestamp || null, duration, model, toolCalls: Array.isArray(tools) ? tools : [], raw: obj });
    } catch {
      turns.push({ idx: i, role: "text", text: line.slice(0, 400), raw: null });
    }
  }
  return { source: "generic", turns, total: turns.length };
}
