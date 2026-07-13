import { readFile } from "node:fs/promises";

const EXAMPLE_HOSTS = new Set(["example.com", "www.example.com", "tablepilot.example"]);

export function validHttps(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !EXAMPLE_HOSTS.has(url.hostname.toLowerCase());
  } catch { return false; }
}

export async function readCandidate(path) {
  if (!path) throw new Error("Provide a JSON candidate path. This command is validation-only and never imports data.");
  return JSON.parse(await readFile(path, "utf8"));
}

function evidenceErrors(row) {
  const errors = [];
  if (!validHttps(row.sourceUrl)) errors.push("sourceUrl must be a non-example HTTPS URL");
  if (!String(row.sourceLabel ?? "").trim()) errors.push("sourceLabel is required");
  if (!Number.isFinite(Date.parse(row.capturedAt ?? ""))) errors.push("capturedAt must be an ISO timestamp");
  if (!Number.isFinite(Date.parse(row.verifiedAt ?? ""))) errors.push("verifiedAt must be an ISO timestamp");
  return errors;
}

export function validateMenu(row, index) {
  const errors = evidenceErrors(row);
  if (!String(row.venueSlug ?? "").trim()) errors.push("venueSlug is required");
  if (!String(row.title ?? "").trim()) errors.push("title is required");
  if (!Array.isArray(row.sections) || row.sections.length === 0) errors.push("at least one section is required");
  if (Array.isArray(row.sections) && !row.sections.some((section) => Array.isArray(section.items) && section.items.length > 0)) errors.push("at least one item is required");
  if (row.status && !["draft", "review"].includes(row.status)) errors.push("import candidates must remain draft or review");
  for (const section of row.sections ?? []) for (const item of section.items ?? []) {
    if (item.editorialPick === true || item.editorialNote) errors.push("Data Ops/partner candidates cannot set editorial fields");
    if (item.priceMinor != null && (!Number.isSafeInteger(item.priceMinor) || item.priceMinor < 0)) errors.push("priceMinor must be a non-negative safe integer");
  }
  return { kind: "menu", index, venueSlug: row.venueSlug ?? null, errors };
}

export function validateCapability(row, index) {
  const errors = evidenceErrors(row);
  if (!String(row.venueSlug ?? "").trim()) errors.push("venueSlug is required");
  if (!["reserve", "delivery", "takeaway", "preorder", "website", "whatsapp", "maps"].includes(row.kind)) errors.push("kind is not supported");
  if (!validHttps(row.url)) errors.push("url must be a non-example HTTPS provider URL");
  if (row.status && !["draft", "review"].includes(row.status)) errors.push("import candidates must remain draft or review");
  if (!Number.isInteger(row.priority) || row.priority < 0) errors.push("priority must be a non-negative integer");
  return { kind: "capability", index, venueSlug: row.venueSlug ?? null, errors };
}

export function printReport(results) {
  const blockers = results.filter((result) => result.errors.length > 0);
  console.log(JSON.stringify({ mode: "dry-run", rows: results.length, valid: results.length - blockers.length, blocked: blockers.length, results }, null, 2));
  return blockers.length === 0 ? 0 : 1;
}

