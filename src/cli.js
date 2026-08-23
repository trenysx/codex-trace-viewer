#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { readFile, writeFile } from "node:fs/promises";
import { parseTrace } from "./parser/index.js";
import { analyze, search } from "./analyzer.js";
import { printTimeline, printStats } from "./reporter.js";

const program = new Command();
program.name("codex-trace-viewer").description("First trace viewer for openai/codex").version("0.1.0");

program.command("view")
  .argument("<file>", "jsonl trace file")
  .option("--json", "json output", false)
  .action(async (file, opts) => {
    const content = await readFile(file, "utf8");
    const trace = parseTrace(content, file);
    const stats = analyze(trace);
    if (opts.json) { console.log(JSON.stringify({ trace, stats }, null, 2)); return; }
    console.log(chalk.bold(`Source: ${trace.source}`));
    printTimeline(trace, stats);
  });

program.command("stats")
  .argument("<file>", "jsonl")
  .action(async (file) => {
    const content = await readFile(file, "utf8");
    const trace = parseTrace(content, file);
    const stats = analyze(trace);
    printStats(stats);
  });

program.command("search")
  .argument("<file>", "jsonl")
  .argument("<term>", "search term")
  .action(async (file, term) => {
    const content = await readFile(file, "utf8");
    const trace = parseTrace(content, file);
    const hits = search(trace, term);
    console.log(chalk.bold(`Found ${hits.length} hits for "${term}":`));
    for (const h of hits.slice(0, 10)) console.log(` #${h.idx} [${h.role}] ${h.text.slice(0, 80)}`);
  });

program.command("export")
  .argument("<file>", "jsonl")
  .argument("<out>", "markdown out")
  .action(async (file, out) => {
    const content = await readFile(file, "utf8");
    const trace = parseTrace(content, file);
    const stats = analyze(trace);
    const md = `# Codex Trace — ${file}\n\n- Turns: ${stats.total}\n- Tool calls: ${stats.toolCalls}\n- Duration: ${stats.totalDuration}ms\n- Models: ${stats.models.join(", ")}\n\n## Timeline\n\n${trace.turns.slice(0, 20).map(t => `- #${t.idx} **${t.role}** ${t.duration ? `(${t.duration}ms)` : ""}: ${t.text.slice(0, 100)}`).join("\n")}\n`;
    await writeFile(out, md, "utf8");
    console.log(chalk.green(`Wrote ${out}`));
  });

program.command("demo")
  .action(async () => {
    const sample = `{"role":"user","content":"hello codex","timestamp":"2026-08-23T12:00:00Z"}` + "\n" + `{"role":"assistant","content":"hi","tool_calls":[{"name":"read","args":{"path":"a.js"}}],"duration_ms":1200,"model":"codex-mini"}` + "\n" + `{"role":"tool","content":"file content","duration_ms":50}` + "\n" + `{"role":"assistant","content":"done","duration_ms":800}`;
    const trace = parseTrace(sample, "sample-codex.jsonl");
    const stats = analyze(trace);
    printTimeline(trace, stats);
    printStats(stats);
  });

if (process.argv.length === 2) program.parse(["node","cli.js","demo"]);
else program.parse();
