export function analyze(trace) {
  const { turns } = trace;
  const byRole = {};
  let toolCalls = 0;
  let totalDuration = 0;
  let warnings = [];
  const modelSet = new Set();

  for (const t of turns) {
    byRole[t.role] = (byRole[t.role] || 0) + 1;
    if (t.toolCalls && t.toolCalls.length) toolCalls += t.toolCalls.length;
    if (t.duration) totalDuration += Number(t.duration) || 0;
    if (t.model) modelSet.add(t.model);
    if (t.duration && Number(t.duration) > 5000) warnings.push({ idx: t.idx, type: "slow", message: `Slow call ${t.duration}ms at #${t.idx}` });
    if (/error|fail/i.test(t.text) && t.role !== "user") warnings.push({ idx: t.idx, type: "error", message: `Error hint at #${t.idx}` });
  }

  return {
    total: turns.length,
    byRole,
    toolCalls,
    totalDuration,
    avgDuration: turns.length ? Math.round(totalDuration / turns.length) : 0,
    models: [...modelSet],
    warnings,
    durationPerTurn: turns.map(t => t.duration || 0)
  };
}

export function search(trace, term) {
  const lower = term.toLowerCase();
  return trace.turns.filter(t => t.text.toLowerCase().includes(lower) || t.role.toLowerCase().includes(lower));
}
