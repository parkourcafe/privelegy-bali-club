import { readFile } from "node:fs/promises";

export const VALIDATION_MODES = Object.freeze({
  IMPORT_DRY_RUN: "import-dry-run",
  PUBLISH: "publish",
});

export const SUPPORTED_ACTION_KINDS = Object.freeze([
  "reserve",
  "delivery",
  "takeaway",
  "preorder",
  "website",
  "whatsapp",
  "maps",
]);

export const SUPPORTED_ACTION_PROVIDERS = Object.freeze([
  "tablepilot",
  "google_maps",
  "whatsapp",
  "grabfood",
  "gofood",
  "shopeefood",
  "official",
  "sevenrooms",
  "tablecheck",
  "chope",
  "resdiary",
  "dishcult",
]);

const EXAMPLE_HOSTS = new Set(["example.com", "www.example.com", "tablepilot.example"]);
const PROVIDER_ALIASES = new Map(Object.entries({
  tablepilot: "tablepilot",
  table_pilot: "tablepilot",
  google_maps: "google_maps",
  googlemaps: "google_maps",
  maps: "google_maps",
  whatsapp: "whatsapp",
  whats_app: "whatsapp",
  grab: "grabfood",
  grabfood: "grabfood",
  grab_food: "grabfood",
  gofood: "gofood",
  go_food: "gofood",
  gojek: "gofood",
  shopeefood: "shopeefood",
  shopee_food: "shopeefood",
  official: "official",
  direct: "official",
  venue: "official",
  website: "official",
  official_website: "official",
  official_booking: "official",
  official_order: "official",
  sevenrooms: "sevenrooms",
  seven_rooms: "sevenrooms",
  tablecheck: "tablecheck",
  table_check: "tablecheck",
  chope: "chope",
  resdiary: "resdiary",
  res_diary: "resdiary",
  dishcult: "dishcult",
  dish_cult: "dishcult",
}));

const PROVIDER_HOSTS = Object.freeze({
  tablepilot: ["tablepilot-id.vercel.app"],
  google_maps: ["google.com", "goo.gl"],
  whatsapp: ["wa.me", "whatsapp.com"],
  grabfood: ["grab.com", "grab.onelink.me"],
  gofood: ["gofood.co.id", "gofood.link", "gojek.com", "gojek.page.link"],
  shopeefood: ["shopee.co.id", "shopeefood.co.id"],
  sevenrooms: ["sevenrooms.com"],
  tablecheck: ["tablecheck.com"],
  chope: ["chope.co", "chope.co.id"],
  resdiary: ["resdiary.com"],
  dishcult: ["dishcult.com"],
});

const ORDERING_PROVIDERS = new Set(["grabfood", "gofood", "shopeefood"]);
const BOOKING_PROVIDERS = new Set(["sevenrooms", "tablecheck", "chope", "resdiary", "dishcult"]);

function parseHttps(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || !url.hostname) return null;
    if (EXAMPLE_HOSTS.has(url.hostname.toLowerCase())) return null;
    return url;
  } catch {
    return null;
  }
}

export function validHttps(value) {
  return Boolean(parseHttps(value));
}

export function hostMatches(hostname, allowedHost) {
  const host = String(hostname).toLowerCase().replace(/\.$/, "");
  const allowed = String(allowedHost).toLowerCase().replace(/\.$/, "");
  return host === allowed || host.endsWith(`.${allowed}`);
}

export function normalizeActionProvider(value) {
  if (typeof value !== "string") return null;
  const key = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return PROVIDER_ALIASES.get(key) ?? null;
}

export function classifyActionKind(value, { provider, label, evidenceNote } = {}) {
  const raw = String(value ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (["directions", "direction", "map", "maps"].includes(raw)) {
    return { kind: "maps", classification: raw === "maps" ? "unchanged" : "normalized_map_alias" };
  }
  if (SUPPORTED_ACTION_KINDS.includes(raw)) return { kind: raw, classification: "unchanged" };
  if (raw !== "order") return { kind: null, classification: "unsupported_action_kind" };

  const canonicalProvider = normalizeActionProvider(provider);
  const words = `${label ?? ""} ${evidenceNote ?? ""}`.toLowerCase();
  if (/\b(pre[ -]?order|advance order)\b/.test(words)) {
    return { kind: "preorder", classification: "order_text_preorder" };
  }
  if (/\b(take[ -]?away|pick[ -]?up|pickup)\b/.test(words)) {
    return { kind: "takeaway", classification: "order_text_takeaway" };
  }
  if (/\bdeliver(?:y|ies|ed)?\b/.test(words)) {
    return { kind: "delivery", classification: "order_text_delivery" };
  }
  if (ORDERING_PROVIDERS.has(canonicalProvider)) {
    return { kind: "delivery", classification: "order_provider_delivery" };
  }
  return { kind: null, classification: "ambiguous_order_kind" };
}

export function providerSupportsAction(provider, kind) {
  if (provider === "tablepilot") return kind === "reserve";
  if (provider === "google_maps") return kind === "maps";
  if (provider === "whatsapp") return kind === "whatsapp";
  if (ORDERING_PROVIDERS.has(provider)) return kind === "delivery" || kind === "takeaway";
  if (BOOKING_PROVIDERS.has(provider)) return kind === "reserve";
  if (provider === "official") {
    return ["reserve", "delivery", "takeaway", "preorder", "website"].includes(kind);
  }
  return false;
}

function providerUrlError(row) {
  const target = parseHttps(row.url);
  if (!target) return "url must be a non-example HTTPS provider URL";
  const provider = normalizeActionProvider(row.provider);
  if (!provider || provider !== row.provider) return "provider is not supported or canonical";
  if (!providerSupportsAction(provider, row.kind)) return "provider does not support this action kind";

  if (provider === "official") {
    const source = parseHttps(row.sourceUrl);
    if (!source || !(hostMatches(target.hostname, source.hostname) || hostMatches(source.hostname, target.hostname))) {
      return "official action URL must share the source host family";
    }
    return null;
  }

  const allowedHosts = PROVIDER_HOSTS[provider] ?? [];
  if (!allowedHosts.some((host) => hostMatches(target.hostname, host))) {
    return "url host is not approved for the canonical provider";
  }
  return null;
}

export async function readCandidate(path) {
  if (!path) throw new Error("Provide a JSON candidate path. This command validates data and never imports it.");
  return JSON.parse(await readFile(path, "utf8"));
}

function normalizeMode(options) {
  const mode = typeof options === "string" ? options : options?.mode;
  if (!mode) return VALIDATION_MODES.IMPORT_DRY_RUN;
  if (!Object.values(VALIDATION_MODES).includes(mode)) throw new Error(`Unsupported validation mode: ${mode}`);
  return mode;
}

function validTimestamp(value) {
  return typeof value === "string" && value.trim() !== "" && Number.isFinite(Date.parse(value));
}

function validationNow(options) {
  const value = typeof options === "object" && options?.now != null ? options.now : Date.now();
  const milliseconds = value instanceof Date ? value.getTime() : typeof value === "number" ? value : Date.parse(value);
  if (!Number.isFinite(milliseconds)) throw new Error("Validation now must be a valid timestamp");
  return milliseconds;
}

function evidenceErrors(row, mode, options) {
  const errors = [];
  if (!validHttps(row.sourceUrl)) errors.push("sourceUrl must be a non-example HTTPS URL");
  if (!String(row.sourceLabel ?? "").trim()) errors.push("sourceLabel is required");
  if (String(row.sourceLabel ?? "").length > 160) errors.push("sourceLabel exceeds 160 characters");
  if (!validTimestamp(row.capturedAt)) errors.push("capturedAt must be an ISO timestamp");
  if (row.verifiedAt != null && !validTimestamp(row.verifiedAt)) errors.push("verifiedAt must be null or an ISO timestamp");
  if (mode === VALIDATION_MODES.PUBLISH && !validTimestamp(row.verifiedAt)) {
    errors.push("verifiedAt is required for publish validation");
  }
  if (validTimestamp(row.verifiedAt)) {
    const verifiedAt = Date.parse(row.verifiedAt);
    if (validTimestamp(row.capturedAt) && verifiedAt < Date.parse(row.capturedAt)) {
      errors.push("verifiedAt cannot be earlier than capturedAt");
    }
    if (verifiedAt > validationNow(options)) errors.push("verifiedAt cannot be in the future");
    if (validTimestamp(row.expiresAt) && verifiedAt >= Date.parse(row.expiresAt)) {
      errors.push("verifiedAt must be earlier than expiresAt");
    }
  }
  return errors;
}

function statusErrors(status, mode, { importStatuses, publishStatuses }) {
  if (mode === VALIDATION_MODES.IMPORT_DRY_RUN && !importStatuses.includes(status)) {
    return ["import candidates must remain draft or review"];
  }
  if (mode === VALIDATION_MODES.PUBLISH && !publishStatuses.includes(status)) {
    return ["publish candidates must be reviewed or already public"];
  }
  return [];
}

function lengthError(value, max, field) {
  return value != null && String(value).length > max ? `${field} exceeds ${max} characters` : null;
}

export function validateMenu(row, index, options) {
  const mode = normalizeMode(options);
  const errors = [
    ...evidenceErrors(row, mode, options),
    ...statusErrors(row.status, mode, {
      importStatuses: ["draft", "review"],
      publishStatuses: ["review", "published"],
    }),
  ];
  if (!String(row.venueSlug ?? "").trim()) errors.push("venueSlug is required");
  if (!String(row.title ?? "").trim()) errors.push("title is required");
  if (String(row.title ?? "").length > 160) errors.push("title exceeds 160 characters");
  if (!Number.isInteger(row.version) || row.version <= 0) errors.push("version must be a positive integer");
  else if (mode === VALIDATION_MODES.IMPORT_DRY_RUN && row.version !== 1) errors.push("initial Data Ops import version must equal 1");
  if (row.expiresAt != null && !validTimestamp(row.expiresAt)) errors.push("expiresAt must be null or an ISO timestamp");
  if (validTimestamp(row.expiresAt) && validTimestamp(row.capturedAt) && Date.parse(row.expiresAt) <= Date.parse(row.capturedAt)) {
    errors.push("expiresAt must be later than capturedAt");
  }
  if (!Array.isArray(row.sections) || row.sections.length === 0) errors.push("at least one section is required");
  if (Array.isArray(row.sections) && !row.sections.some((section) => Array.isArray(section.items) && section.items.length > 0)) {
    errors.push("at least one item is required");
  }
  for (const [sectionIndex, section] of (Array.isArray(row.sections) ? row.sections : []).entries()) {
    if (!String(section.name ?? "").trim()) errors.push(`section ${sectionIndex} name is required`);
    const sectionDescriptionError = lengthError(section.description, 1000, `section ${sectionIndex} description`);
    if (sectionDescriptionError) errors.push(sectionDescriptionError);
    if (!Number.isInteger(section.position) || section.position < 0) errors.push(`section ${sectionIndex} position must be a non-negative integer`);
    if (!Array.isArray(section.items)) errors.push(`section ${sectionIndex} items must be an array`);
    for (const [itemIndex, item] of (Array.isArray(section.items) ? section.items : []).entries()) {
      const prefix = `section ${sectionIndex} item ${itemIndex}`;
      if (!String(item.name ?? "").trim()) errors.push(`${prefix} name is required`);
      if (String(item.name ?? "").length > 200) errors.push(`${prefix} name exceeds 200 characters`);
      if (item.editorialPick === true || item.editorialNote) errors.push("Data Ops/partner candidates cannot set editorial fields");
      if (item.priceMinor != null && (!Number.isSafeInteger(item.priceMinor) || item.priceMinor < 0)) {
        errors.push("priceMinor must be a non-negative safe integer");
      }
      if ((item.priceMinor == null) !== (item.currency == null)) errors.push("priceMinor and currency must both be null or both be set");
      if (item.currency != null && !/^[A-Z]{3}$/.test(item.currency)) errors.push("currency must be a three-letter uppercase code");
      if (item.priceText != null && (typeof item.priceText !== "string" || !item.priceText.trim())) errors.push("priceText must be null or a non-empty string");
      if (typeof item.priceText === "string" && item.priceText.length > 120) errors.push("priceText exceeds 120 characters");
      if (item.sourceDisplayPrice != null && item.priceText !== item.sourceDisplayPrice) errors.push("priceText must preserve sourceDisplayPrice exactly");
      if (!Array.isArray(item.dietaryTags) || !Array.isArray(item.verifiedAllergenTags)) errors.push("item tag fields must be arrays");
      if (!Number.isInteger(item.position) || item.position < 0) errors.push(`${prefix} position must be a non-negative integer`);
      for (const [value, max, field] of [
        [item.description, 2000, `${prefix} description`],
        [item.editorialNote, 1000, `${prefix} editorialNote`],
        [item.availabilityNote, 500, `${prefix} availabilityNote`],
      ]) {
        const error = lengthError(value, max, field);
        if (error) errors.push(error);
      }
    }
  }
  return { kind: "menu", index, venueSlug: row.venueSlug ?? null, mode, errors: [...new Set(errors)] };
}

export function validateCapability(row, index, options) {
  const mode = normalizeMode(options);
  const errors = [
    ...evidenceErrors(row, mode, options),
    ...statusErrors(row.status, mode, {
      importStatuses: ["draft", "review"],
      publishStatuses: ["review", "confirmed"],
    }),
  ];
  if (!String(row.venueSlug ?? "").trim()) errors.push("venueSlug is required");
  if (!SUPPORTED_ACTION_KINDS.includes(row.kind)) errors.push("kind is not supported");
  if (!SUPPORTED_ACTION_PROVIDERS.includes(row.provider)) errors.push("provider is not supported or canonical");
  if (String(row.provider ?? "").length > 80) errors.push("provider exceeds 80 characters");
  if (!Number.isInteger(row.version) || row.version <= 0) errors.push("version must be a positive integer");
  else if (mode === VALIDATION_MODES.IMPORT_DRY_RUN && row.version !== 1) errors.push("initial Data Ops import version must equal 1");
  const urlError = providerUrlError(row);
  if (urlError) errors.push(urlError);
  if (!Number.isInteger(row.priority) || row.priority < 0) errors.push("priority must be a non-negative integer");
  if (typeof row.confirmationRequired !== "boolean") errors.push("confirmationRequired must be boolean");
  if (row.label != null && String(row.label).length > 160) errors.push("label exceeds 160 characters");
  if (row.expiresAt != null && !validTimestamp(row.expiresAt)) errors.push("expiresAt must be null or an ISO timestamp");
  if (validTimestamp(row.expiresAt) && validTimestamp(row.capturedAt) && Date.parse(row.expiresAt) <= Date.parse(row.capturedAt)) {
    errors.push("expiresAt must be later than capturedAt");
  }
  return { kind: "capability", index, venueSlug: row.venueSlug ?? null, mode, errors: [...new Set(errors)] };
}

export function printReport(results, options) {
  const mode = normalizeMode(options);
  const blockers = results.filter((result) => result.errors.length > 0);
  console.log(JSON.stringify({ mode, rows: results.length, valid: results.length - blockers.length, blocked: blockers.length, results }, null, 2));
  return blockers.length === 0 ? 0 : 1;
}

export function parseValidationCliArgs(argv) {
  const args = [...argv];
  let mode = VALIDATION_MODES.IMPORT_DRY_RUN;
  let path = null;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--publish") mode = VALIDATION_MODES.PUBLISH;
    else if (arg === "--mode") mode = args[++index];
    else if (arg.startsWith("--mode=")) mode = arg.slice("--mode=".length);
    else if (!arg.startsWith("-") && !path) path = arg;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  normalizeMode({ mode });
  return { mode, path };
}
