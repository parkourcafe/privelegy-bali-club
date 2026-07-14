import type { Perk } from "../types";
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

function refFor(row: Record<string, unknown>, index?: number): ValidationRecordRef {
  return {
    id: normalizedText(row.id),
    slug: normalizedText(row.venue_slug),
    ...(index === undefined ? {} : { index }),
  };
}

function requiredText(
  row: Record<string, unknown>,
  key: "id" | "venue_slug" | "title",
  issues: ValidationIssue[],
  ref: ValidationRecordRef,
): string | null {
  const value = row[key];
  if (typeof value !== "string") {
    issues.push(makeIssue(
      `perk.${key}.invalid_type`,
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
      `perk.${key}.required`,
      key,
      `${key} must be a non-empty string`,
      "raw",
      "error",
      ref,
    ));
  }
  return text;
}

export function parsePublicPerkRow(input: unknown, index?: number): ValidationResult<Perk> {
  if (!isRecord(input)) {
    return {
      ok: false,
      data: null,
      issues: [makeIssue(
        "perk.input.not_object",
        "$",
        "perk row must be an object",
        "raw",
        "error",
        { id: null, slug: null, ...(index === undefined ? {} : { index }) },
      )],
    };
  }

  const issues: ValidationIssue[] = [];
  const ref = refFor(input, index);
  const id = requiredText(input, "id", issues, ref);
  const venueSlug = requiredText(input, "venue_slug", issues, ref);
  const title = requiredText(input, "title", issues, ref);
  if (venueSlug && (!SLUG_PATTERN.test(venueSlug) || venueSlug.length > 120)) {
    issues.push(makeIssue(
      "perk.venue_slug.invalid",
      "venue_slug",
      "venue_slug must be lowercase kebab-case",
      "raw",
      "error",
      ref,
    ));
  }

  let terms = "";
  if (input.terms != null) {
    if (typeof input.terms !== "string") {
      issues.push(makeIssue(
        "perk.terms.invalid_type",
        "terms",
        "terms must be a string or null",
        "raw",
        "error",
        ref,
      ));
    } else {
      terms = normalizedText(input.terms) ?? "";
    }
  }

  if (hasErrors(issues) || !id || !venueSlug || !title) {
    return { ok: false, data: null, issues };
  }
  return {
    ok: true,
    data: { id, venueSlug, title, terms },
    issues,
  };
}
