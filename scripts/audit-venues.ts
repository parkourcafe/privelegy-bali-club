#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  VENUE_ANON_AUDIT_COLUMNS,
  auditVenueRows,
  type VenueAuditReport,
} from "../lib/schema/venue";

export interface AuditVenueCliOptions {
  input: string | null;
  source: "snapshot" | "db";
  outputDir: string;
  jsonPath: string | null;
  markdownPath: string | null;
  asOf: string | null;
  help: boolean;
}

interface SnapshotEnvelope {
  venues: unknown[];
  asOf: string | null;
  source: string;
}

function optionValue(argv: string[], index: number, name: string): { value: string; consumed: number } {
  const argument = argv[index];
  const inline = argument.slice(name.length + 1);
  if (argument.startsWith(`${name}=`)) {
    if (!inline) throw new Error(`${name} requires a value`);
    return { value: inline, consumed: 1 };
  }
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
  return { value, consumed: 2 };
}

export function parseAuditVenueArgs(argv: string[]): AuditVenueCliOptions {
  const options: AuditVenueCliOptions = {
    input: null,
    source: "snapshot",
    outputDir: "artifacts/data-audit",
    jsonPath: null,
    markdownPath: null,
    asOf: null,
    help: false,
  };
  for (let index = 0; index < argv.length;) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") {
      options.help = true;
      index += 1;
      continue;
    }
    const matching = ["--input", "--source", "--output-dir", "--json", "--markdown", "--as-of"]
      .find((name) => argument === name || argument.startsWith(`${name}=`));
    if (!matching) throw new Error(`Unknown argument: ${argument}`);
    const { value, consumed } = optionValue(argv, index, matching);
    if (matching === "--input") options.input = value;
    if (matching === "--source") {
      if (value === "db") {
        options.source = "db";
      } else if (value === "snapshot") {
        options.source = "snapshot";
      } else {
        // Backwards-compatible explicit-path form: --source snapshot.json.
        options.source = "snapshot";
        options.input = value;
      }
    }
    if (matching === "--output-dir") options.outputDir = value;
    if (matching === "--json") options.jsonPath = value;
    if (matching === "--markdown") options.markdownPath = value;
    if (matching === "--as-of") options.asOf = validAsOf(value, "--as-of");
    index += consumed;
  }
  if (options.source === "db" && options.input) {
    throw new Error("Use either --input <snapshot.json> or --source db, not both");
  }
  if (!options.help && options.source === "snapshot" && !options.input) {
    throw new Error("A source is required: pass --input <snapshot.json> or --source db");
  }
  return options;
}

function validAsOf(value: unknown, field: string): string | null {
  if (value == null) return null;
  if (typeof value !== "string" || !value.trim() || !Number.isFinite(Date.parse(value))) {
    throw new Error(`${field} must be a valid ISO date/timestamp`);
  }
  return new Date(value).toISOString();
}

function snapshotSource(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim()) return value.trim().slice(0, 200);
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const label = (value as Record<string, unknown>).label;
    if (typeof label === "string" && label.trim()) return label.trim().slice(0, 200);
  }
  return fallback;
}

export async function readVenueSnapshot(inputPath: string): Promise<SnapshotEnvelope> {
  const absolutePath = path.resolve(inputPath);
  let parsed: unknown;
  try {
    parsed = JSON.parse(await readFile(absolutePath, "utf8"));
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown read error";
    throw new Error(`Unable to read venue snapshot ${inputPath}: ${reason}`);
  }
  if (Array.isArray(parsed)) {
    return { venues: parsed, asOf: null, source: `snapshot:${inputPath}` };
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Venue snapshot must be an array or an object with a venues array");
  }
  const envelope = parsed as Record<string, unknown>;
  if (!Array.isArray(envelope.venues)) {
    throw new Error("Venue snapshot object must contain a venues array");
  }
  return {
    venues: envelope.venues,
    asOf: validAsOf(envelope.asOf, "snapshot asOf"),
    source: snapshotSource(envelope.source, `snapshot:${inputPath}`),
  };
}

function configuredAnonDatabase(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error("DB audit requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (service role is never used)");
  }
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Supabase URL is invalid");
  }
  const local = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  if (parsed.protocol !== "https:" && !(local && parsed.protocol === "http:")) {
    throw new Error("Supabase URL must use HTTPS (HTTP is allowed only for localhost)");
  }
  return { url: parsed.toString().replace(/\/$/, ""), anonKey };
}

export async function readVenuesFromAnonDatabase(): Promise<SnapshotEnvelope> {
  const { url, anonKey } = configuredAnonDatabase();
  const endpoint = new URL(`${url}/rest/v1/venues`);
  endpoint.searchParams.set("select", VENUE_ANON_AUDIT_COLUMNS.join(","));
  endpoint.searchParams.set("order", "slug.asc");
  const response = await fetch(endpoint, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    const requestId = response.headers.get("x-request-id");
    throw new Error(`Anonymous venues read failed (${response.status}${requestId ? `, request ${requestId}` : ""})`);
  }
  const venues: unknown = await response.json();
  if (!Array.isArray(venues)) throw new Error("Anonymous venues read returned a non-array payload");
  return {
    venues,
    asOf: new Date().toISOString(),
    source: `anon-db:${new URL(url).hostname}/venues`,
  };
}

function markdownCell(value: unknown): string {
  return String(value ?? "").replace(/\|/g, "\\|").replace(/[\r\n]+/g, " ");
}

export function venueAuditMarkdown(report: VenueAuditReport): string {
  const summaryRows = Object.entries(report.summary)
    .map(([metric, value]) => `| ${markdownCell(metric)} | ${value} |`)
    .join("\n");
  const issueRows = report.issues.length === 0
    ? "| — | — | — | No validation issues |"
    : report.issues.map((issue) =>
      `| ${markdownCell(issue.severity)} | ${markdownCell(issue.record?.slug ?? issue.record?.id ?? `row ${issue.record?.index ?? "?"}`)} | ${markdownCell(issue.code)} | ${markdownCell(issue.path)}: ${markdownCell(issue.message)} |`,
    ).join("\n");
  return [
    "# Venue data audit",
    "",
    `- Status: **${report.ready ? "READY" : "NOT READY"}**`,
    `- Source: \`${markdownCell(report.source)}\``,
    `- As of: ${report.asOf ? `\`${report.asOf}\`` : "not supplied by snapshot"}`,
    `- Contract: runtime venue schema v${report.schemaVersion}`,
    "",
    "## Summary",
    "",
    "| Metric | Count |",
    "| --- | ---: |",
    summaryRows,
    "",
    "## Findings",
    "",
    "| Severity | Venue | Code | Exact reason |",
    "| --- | --- | --- | --- |",
    issueRows,
    "",
    "## Gate semantics",
    "",
    "A READY report means every row conforms to the normalized schema and every row marked published passes the publication gate. Review rows are not promoted. Invalid rows are excluded from public output; no missing value is fabricated.",
    "",
  ].join("\n");
}

export async function runVenueAudit(options: AuditVenueCliOptions): Promise<{ report: VenueAuditReport; jsonPath: string; markdownPath: string }> {
  const source = options.source === "db"
    ? await readVenuesFromAnonDatabase()
    : await readVenueSnapshot(options.input!);
  const asOf = options.asOf ?? source.asOf;
  const report = auditVenueRows(source.venues, { source: source.source, asOf });
  const outputDir = path.resolve(options.outputDir);
  const jsonPath = path.resolve(options.jsonPath ?? path.join(outputDir, "data-audit.json"));
  const markdownPath = path.resolve(options.markdownPath ?? path.join(outputDir, "data-audit.md"));
  await Promise.all([
    mkdir(path.dirname(jsonPath), { recursive: true }),
    mkdir(path.dirname(markdownPath), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8"),
    writeFile(markdownPath, venueAuditMarkdown(report), "utf8"),
  ]);
  return { report, jsonPath, markdownPath };
}

export function auditVenueUsage(): string {
  return [
    "Usage:",
    "  tsx scripts/audit-venues.ts --input <snapshot.json> [--output-dir <dir>]",
    "  tsx scripts/audit-venues.ts --source db [--output-dir <dir>]",
    "",
    "Options:",
    "  --json <path>       Override the JSON report path",
    "  --markdown <path>   Override the Markdown report path",
    "  --as-of <ISO>       Override the report as-of timestamp",
    "",
    "Snapshot mode is deterministic and uses no production secret. DB mode uses only the anon key and an explicit read-only column list.",
  ].join("\n");
}

export async function main(argv = process.argv.slice(2)): Promise<number> {
  try {
    const options = parseAuditVenueArgs(argv);
    if (options.help) {
      process.stdout.write(`${auditVenueUsage()}\n`);
      return 0;
    }
    const result = await runVenueAudit(options);
    process.stdout.write(`${result.report.ready ? "READY" : "NOT READY"}: ${result.report.summary.totalVenues} venues; JSON ${result.jsonPath}; Markdown ${result.markdownPath}\n`);
    return result.report.ready ? 0 : 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown audit error";
    process.stderr.write(`Venue audit failed closed: ${message}\n`);
    return 2;
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  void main().then((code) => {
    process.exitCode = code;
  });
}
