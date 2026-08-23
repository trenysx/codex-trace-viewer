import Table from "cli-table3";
import chalk from "chalk";

export function printTimeline(trace, stats) {
  console.log(chalk.bold.cyan(`\nTrace: ${stats.total} turns, ${stats.toolCalls} tool calls, ${stats.totalDuration}ms total`));
  if (stats.models.length) console.log(chalk.dim(`Models: ${stats.models.join(", ")}`));
  const t = new Table({ head: [chalk.cyan("#"), chalk.cyan("Role"), chalk.cyan("Duration"), chalk.cyan("Preview")], colWidths: [4, 12, 10, 60], style: { head: [], border: [] } });
  for (const turn of trace.turns.slice(0, 15)) {
    const role = turn.role === "assistant" ? chalk.green(turn.role) : turn.role === "tool" ? chalk.yellow(turn.role) : chalk.white(turn.role);
    t.push([String(turn.idx), role, turn.duration ? `${turn.duration}ms` : "-", turn.text.slice(0, 60)]);
  }
  console.log(t.toString());
  if (trace.turns.length > 15) console.log(chalk.dim(`... and ${trace.turns.length - 15} more`));
  if (stats.warnings.length) {
    console.log(chalk.yellow.bold(`\nWarnings (${stats.warnings.length}):`));
    for (const w of stats.warnings.slice(0, 5)) console.log(chalk.yellow(`  ! #${w.idx} ${w.type}: ${w.message}`));
  }
}

export function printStats(stats) {
  const t = new Table({ head: [chalk.cyan("Metric"), chalk.cyan("Value")], colWidths: [20, 40], style: { head: [], border: [] } });
  t.push(["Total turns", String(stats.total)]);
  t.push(["Tool calls", String(stats.toolCalls)]);
  t.push(["Total duration", `${stats.totalDuration}ms`]);
  t.push(["Avg / turn", `${stats.avgDuration}ms`]);
  t.push(["By role", JSON.stringify(stats.byRole)]);
  t.push(["Models", stats.models.join(", ") || "-"]);
  console.log(t.toString());
}
