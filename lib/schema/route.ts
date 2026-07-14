import { SLOTS, type PlanEntry, type RouteStopDef, type Slot } from "../types";
import {
  hasErrors,
  isRecord,
  makeIssue,
  normalizedText,
  type ValidationIssue,
  type ValidationRecordRef,
  type ValidationResult,
} from "./common";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SLOT_SET = new Set<Slot>(SLOTS.map(({ key }) => key));

export interface PublicRouteRow {
  slug: string;
  title: string;
  subtitle?: string;
  rank: number;
}

export interface PublicRouteStopRow extends RouteStopDef {
  routeSlug: string;
  rank: number;
}

function refFor(
  row: Record<string, unknown>,
  slugKey: "venue_slug" | "slug" | "route_slug",
  index?: number,
): ValidationRecordRef {
  return {
    id: normalizedText(row.id),
    slug: normalizedText(row[slugKey]),
    ...(index === undefined ? {} : { index }),
  };
}

function requiredText(
  entity: "plan_entry" | "route" | "route_stop",
  row: Record<string, unknown>,
  key: string,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): string | null {
  const value = row[key];
  if (typeof value !== "string") {
    issues.push(makeIssue(
      `${entity}.${key}.invalid_type`,
      key,
      `${key} must be a string`,
      "raw",
      "error",
      ref,
    ));
    return null;
  }
  const text = normalizedText(value);
  if (!text) {
    issues.push(makeIssue(
      `${entity}.${key}.required`,
      key,
      `${key} must be a non-empty string`,
      "raw",
      "error",
      ref,
    ));
  }
  return text;
}

function optionalText(
  entity: "plan_entry" | "route" | "route_stop",
  row: Record<string, unknown>,
  key: string,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): string | undefined {
  const value = row[key];
  if (value == null) return undefined;
  if (typeof value !== "string") {
    issues.push(makeIssue(
      `${entity}.${key}.invalid_type`,
      key,
      `${key} must be a string or null`,
      "raw",
      "error",
      ref,
    ));
    return undefined;
  }
  return normalizedText(value) ?? undefined;
}

function rankValue(
  entity: "plan_entry" | "route" | "route_stop",
  row: Record<string, unknown>,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): number | null {
  if (!Number.isSafeInteger(row.rank)) {
    issues.push(makeIssue(
      `${entity}.rank.invalid_type`,
      "rank",
      "rank must be a safe integer",
      "raw",
      "error",
      ref,
    ));
    return null;
  }
  return row.rank as number;
}

function validSlug(
  entity: "plan_entry" | "route" | "route_stop",
  key: string,
  value: string | null,
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): value is string {
  if (!value) return false;
  if (!SLUG_PATTERN.test(value) || value.length > 120) {
    issues.push(makeIssue(
      `${entity}.${key}.invalid`,
      key,
      `${key} must be lowercase kebab-case`,
      "raw",
      "error",
      ref,
    ));
    return false;
  }
  return true;
}

function notObjectIssue(
  entity: "plan_entry" | "route" | "route_stop",
  index?: number,
): ValidationResult<never> {
  return {
    ok: false,
    data: null,
    issues: [makeIssue(
      `${entity}.input.not_object`,
      "$",
      `${entity} row must be an object`,
      "raw",
      "error",
      { id: null, slug: null, ...(index === undefined ? {} : { index }) },
    )],
  };
}

export function parsePlanEntryRow(input: unknown, index?: number): ValidationResult<PlanEntry> {
  if (!isRecord(input)) return notObjectIssue("plan_entry", index);
  const issues: ValidationIssue[] = [];
  const ref = refFor(input, "venue_slug", index);
  const venueSlug = requiredText("plan_entry", input, "venue_slug", issues, ref);
  validSlug("plan_entry", "venue_slug", venueSlug, issues, ref);
  const slotValue = requiredText("plan_entry", input, "slot", issues, ref);
  if (slotValue && !SLOT_SET.has(slotValue as Slot)) {
    issues.push(makeIssue(
      "plan_entry.slot.unknown",
      "slot",
      "slot is not supported",
      "raw",
      "error",
      ref,
    ));
  }
  const rank = rankValue("plan_entry", input, issues, ref);
  const blurb = optionalText("plan_entry", input, "blurb", issues, ref) ?? "";
  if (hasErrors(issues) || !venueSlug || !slotValue || rank === null) {
    return { ok: false, data: null, issues };
  }
  return {
    ok: true,
    data: { venueSlug, slot: slotValue as Slot, rank, blurb },
    issues,
  };
}

export function parseRouteRow(input: unknown, index?: number): ValidationResult<PublicRouteRow> {
  if (!isRecord(input)) return notObjectIssue("route", index);
  const issues: ValidationIssue[] = [];
  const ref = refFor(input, "slug", index);
  const slug = requiredText("route", input, "slug", issues, ref);
  validSlug("route", "slug", slug, issues, ref);
  const title = requiredText("route", input, "title", issues, ref);
  const subtitle = optionalText("route", input, "subtitle", issues, ref);
  const rank = rankValue("route", input, issues, ref);
  if (hasErrors(issues) || !slug || !title || rank === null) {
    return { ok: false, data: null, issues };
  }
  return {
    ok: true,
    data: { slug, title, ...(subtitle ? { subtitle } : {}), rank },
    issues,
  };
}

export function parseRouteStopRow(
  input: unknown,
  index?: number,
): ValidationResult<PublicRouteStopRow> {
  if (!isRecord(input)) return notObjectIssue("route_stop", index);
  const issues: ValidationIssue[] = [];
  const ref = refFor(input, "route_slug", index);
  const routeSlug = requiredText("route_stop", input, "route_slug", issues, ref);
  validSlug("route_stop", "route_slug", routeSlug, issues, ref);
  const venueSlug = requiredText("route_stop", input, "venue_slug", issues, ref);
  validSlug("route_stop", "venue_slug", venueSlug, issues, ref);
  const rank = rankValue("route_stop", input, issues, ref);
  const note = optionalText("route_stop", input, "note", issues, ref);
  if (hasErrors(issues) || !routeSlug || !venueSlug || rank === null) {
    return { ok: false, data: null, issues };
  }
  return {
    ok: true,
    data: { routeSlug, venueSlug, rank, ...(note ? { note } : {}) },
    issues,
  };
}
