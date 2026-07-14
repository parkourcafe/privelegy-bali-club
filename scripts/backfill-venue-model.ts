#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { VENUE_TYPES } from "../lib/schema/venue";
import { readVenueSnapshot } from "./audit-venues";

type SourceMode = "snapshot";

export interface BackfillVenueOptions {
  source: SourceMode;
  input: string | null;
  outputDir: string;
  asOf: string | null;
  help: boolean;
}

export interface BackfillCandidate {
  slug: string;
  field: string;
  legacyField: string;
  legacyValue: unknown;
  proposedValue: unknown;
  rule: string;
}

export interface BackfillReviewFinding {
  slug: string;
  field: string;
  legacyValue: unknown;
  reason: string;
}

export interface BackfillVenueReport {
  schemaVersion: 1;
  mode: "read_only";
  source: string;
  asOf: string | null;
  ready: boolean;
  summary: {
    totalVenues: number;
    deterministicCandidates: number;
    manualReviewFindings: number;
    affectedVenues: number;
  };
  deterministicCandidates: BackfillCandidate[];
  manualReview: BackfillReviewFinding[];
}

const VENUE_TYPE_SET = new Set<string>(VENUE_TYPES);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function iso(value: string, option: string): string {
  if (!value.trim() || !Number.isFinite(Date.parse(value))) {
    throw new Error(`${option} must be a valid ISO date/timestamp`);
  }
  return new Date(value).toISOString();
}

function valueAfter(argv: string[], index: number, name: string): { value: string; consumed: number } {
  const argument = argv[index];
  if (argument.startsWith(`${name}=`)) {
    const value = argument.slice(name.length + 1);
    if (!value) throw new Error(`${name} requires a value`);
    return { value, consumed: 1 };
  }
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`${name} requires a value`);
  return { value, consumed: 2 };
}

export function parseBackfillVenueArgs(argv: string[]): BackfillVenueOptions {
  const options: BackfillVenueOptions = {
    source: "snapshot",
    input: null,
    outputDir: "artifacts/data-audit",
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
    const name = ["--input", "--source", "--output-dir", "--as-of"]
      .find((candidate) => argument === candidate || argument.startsWith(`${candidate}=`));
    if (!name) throw new Error(`Unknown argument: ${argument}`);
    const { value, consumed } = valueAfter(argv, index, name);
    if (name === "--input") options.input = value;
    if (name === "--output-dir") options.outputDir = value;
    if (name === "--as-of") options.asOf = iso(value, "--as-of");
    if (name === "--source") {
      if (value !== "snapshot") {
        throw new Error("backfill review requires a complete operator snapshot; anonymous DB reads omit review rows");
      }
      options.source = "snapshot";
    }
    index += consumed;
  }
  if (!options.help && !options.input) {
    throw new Error("A complete source is required: pass --input <operator-snapshot.json>");
  }
  return options;
}

function stable(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

export function buildBackfillVenueReport(
  rows: unknown[],
  metadata: { source: string; asOf: string | null },
): BackfillVenueReport {
  const deterministicCandidates: BackfillCandidate[] = [];
  const manualReview: BackfillReviewFinding[] = [];

  rows.forEach((input, index) => {
    if (!isRecord(input)) {
      manualReview.push({
        slug: `row-${index}`,
        field: "$",
        legacyValue: null,
        reason: "row is not an object and cannot be migrated",
      });
      return;
    }
    const slug = text(input.slug) ?? `row-${index}`;
    const category = text(input.category);
    const area = text(input.area);
    const address = text(input.address);
    const publication = text(input.publication_status);
    const legacyVerifiedAt = text(input.last_verified_at);
    const verifiedAt = text(input.verified_at) ?? legacyVerifiedAt;
    const photoUrl = text(input.photo_url);

    if (!text(input.venue_type) && category) {
      if (VENUE_TYPE_SET.has(category)) {
        deterministicCandidates.push({
          slug, field: "venue_type", legacyField: "category",
          legacyValue: category, proposedValue: category,
          rule: "approved legacy category maps one-to-one",
        });
      } else {
        manualReview.push({
          slug, field: "venue_type", legacyValue: category,
          reason: "legacy category is outside the approved venue taxonomy",
        });
      }
    }

    if (!text(input.full_address) && address) {
      deterministicCandidates.push({
        slug, field: "full_address", legacyField: "address",
        legacyValue: address, proposedValue: address,
        rule: "non-empty legacy address is copied verbatim",
      });
    }

    if (!text(input.subarea) && area) {
      if (area.includes("/")) {
        manualReview.push({
          slug, field: "subarea", legacyValue: area,
          reason: "legacy area contains multiple slash-delimited candidates",
        });
      } else {
        deterministicCandidates.push({
          slug, field: "subarea", legacyField: "area",
          legacyValue: area, proposedValue: area,
          rule: "single legacy area is copied verbatim",
        });
      }
    }

    if (!text(input.verified_at) && legacyVerifiedAt) {
      deterministicCandidates.push({
        slug, field: "verified_at", legacyField: "last_verified_at",
        legacyValue: legacyVerifiedAt, proposedValue: legacyVerifiedAt,
        rule: "recorded legacy verification date becomes UTC verification timestamp",
      });
    }
    if (publication === "published" && !verifiedAt) {
      manualReview.push({
        slug, field: "verified_at", legacyValue: publication,
        reason: "legacy published row has no recorded verification timestamp",
      });
    }
    if (verifiedAt && !text(input.verification_source)) {
      manualReview.push({
        slug, field: "verification_source", legacyValue: verifiedAt,
        reason: "verification timestamp requires provenance; related fact evidence must be checked",
      });
    }

    if (list(input.jobs).length > 0 && list(input.occasions).length === 0) {
      manualReview.push({
        slug, field: "occasions", legacyValue: input.jobs,
        reason: "legacy jobs require editorial classification before becoming occasions",
      });
    }

    if (input.photo_status == null) {
      deterministicCandidates.push({
        slug, field: "photo_status", legacyField: "photo_url",
        legacyValue: photoUrl,
        proposedValue: photoUrl ? "needs_verification" : "missing",
        rule: "legacy photo presence is classified but never approved",
      });
    }
    if (photoUrl && (text(input.photo_status) === "needs_verification" || input.photo_status == null)) {
      manualReview.push({
        slug, field: "photo_status", legacyValue: photoUrl,
        reason: "legacy photo URL needs exact rights evidence before approval",
      });
    }
  });

  const ordering = <T extends { slug: string; field: string }>(left: T, right: T) =>
    left.slug.localeCompare(right.slug) || left.field.localeCompare(right.field) ||
    stable(left).localeCompare(stable(right));
  deterministicCandidates.sort(ordering);
  manualReview.sort(ordering);
  const affected = new Set([
    ...deterministicCandidates.map((item) => item.slug),
    ...manualReview.map((item) => item.slug),
  ]);

  return {
    schemaVersion: 1,
    mode: "read_only",
    source: metadata.source,
    asOf: metadata.asOf,
    ready: manualReview.length === 0,
    summary: {
      totalVenues: rows.length,
      deterministicCandidates: deterministicCandidates.length,
      manualReviewFindings: manualReview.length,
      affectedVenues: affected.size,
    },
    deterministicCandidates,
    manualReview,
  };
}

function cell(value: unknown): string {
  return stable(value).replace(/\|/g, "\\|").replace(/[\r\n]+/g, " ");
}

export function backfillVenueMarkdown(report: BackfillVenueReport): string {
  const candidateRows = report.deterministicCandidates.length
    ? report.deterministicCandidates.map((item) =>
      `| ${cell(item.slug)} | ${cell(item.field)} | ${cell(item.legacyField)} | ${cell(item.proposedValue)} | ${cell(item.rule)} |`,
    ).join("\n")
    : "| — | — | — | — | No deterministic transfers pending |";
  const reviewRows = report.manualReview.length
    ? report.manualReview.map((item) =>
      `| ${cell(item.slug)} | ${cell(item.field)} | ${cell(item.legacyValue)} | ${cell(item.reason)} |`,
    ).join("\n")
    : "| — | — | — | No manual review findings |";
  return [
    "# Venue model backfill review",
    "",
    "This is a read-only dry-run report. It never writes venue data and never invents missing values.",
    "",
    `- Status: **${report.ready ? "READY" : "MANUAL REVIEW REQUIRED"}**`,
    `- Source: \`${cell(report.source)}\``,
    `- As of: ${report.asOf ? `\`${report.asOf}\`` : "not supplied"}`,
    `- Venues: ${report.summary.totalVenues}`,
    `- Deterministic candidates: ${report.summary.deterministicCandidates}`,
    `- Manual review findings: ${report.summary.manualReviewFindings}`,
    "",
    "## Deterministic candidates",
    "",
    "| Venue | Target field | Legacy field | Proposed value | Rule |",
    "| --- | --- | --- | --- | --- |",
    candidateRows,
    "",
    "## Manual review",
    "",
    "| Venue | Field | Legacy value | Reason |",
    "| --- | --- | --- | --- |",
    reviewRows,
    "",
  ].join("\n");
}

export async function runBackfillVenueReview(options: BackfillVenueOptions) {
  const snapshot = await readVenueSnapshot(options.input!);
  const report = buildBackfillVenueReport(snapshot.venues, {
    source: snapshot.source,
    asOf: options.asOf ?? snapshot.asOf,
  });
  const outputDir = path.resolve(options.outputDir);
  const jsonPath = path.join(outputDir, "backfill-review.json");
  const markdownPath = path.join(outputDir, "backfill-review.md");
  await mkdir(outputDir, { recursive: true });
  await Promise.all([
    writeFile(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8"),
    writeFile(markdownPath, backfillVenueMarkdown(report), "utf8"),
  ]);
  return { report, jsonPath, markdownPath };
}

export function backfillVenueUsage(): string {
  return [
    "Usage:",
    "  tsx scripts/backfill-venue-model.ts --input <snapshot.json>",
    "",
    "Options:",
    "  --output-dir <dir>  Default: artifacts/data-audit",
    "  --as-of <ISO>       Override report timestamp",
    "",
    "This command is always read-only and needs no credentials. It intentionally rejects anonymous DB mode because venue RLS hides review rows; provide a complete operator-generated snapshot instead. A service-role key is never read by this CLI or CI.",
  ].join("\n");
}

export async function main(argv = process.argv.slice(2)): Promise<number> {
  try {
    const options = parseBackfillVenueArgs(argv);
    if (options.help) {
      process.stdout.write(`${backfillVenueUsage()}\n`);
      return 0;
    }
    const result = await runBackfillVenueReview(options);
    process.stdout.write(`${result.report.ready ? "READY" : "MANUAL REVIEW REQUIRED"}: JSON ${result.jsonPath}; Markdown ${result.markdownPath}\n`);
    return result.report.ready ? 0 : 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown backfill review error";
    process.stderr.write(`Venue backfill review failed closed: ${message}\n`);
    return 2;
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  void main().then((code) => {
    process.exitCode = code;
  });
}
