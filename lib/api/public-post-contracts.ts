import type { ActionKind } from "../contracts/menu-action";
import {
  normalizeActionProvider,
  validateExternalProviderUrl,
} from "../integrations/external-ordering";
import {
  parseSafeHttpsUrl,
  validatePublicEvidenceUrl,
  whatsAppPhoneFromUrl,
} from "../external-links";

const VENUE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ONBOARD_TOKEN = /^[A-Za-z0-9_-]{20,160}$/;
const REDEMPTION_TOKEN = /^[0-9a-z]{6,12}\.[A-Za-z0-9_-]{43}$/;
const SOURCE_ID = /^[a-z0-9][a-z0-9_-]{0,63}$/;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const WHATSAPP = /^[0-9]{7,16}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const GUIDE_INTERESTS = new Set([
  "surf",
  "food",
  "sunset",
  "beach",
  "family",
  "work",
]);
const GUIDE_LANGUAGES = new Set(["en", "ru"] as const);
const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;
const ACTION_KINDS = new Set<ActionKind>([
  "reserve",
  "delivery",
  "takeaway",
  "preorder",
  "website",
  "whatsapp",
]);
const DRAFT_PROVIDERS = new Set([
  "official",
  "whatsapp",
  "grabfood",
  "gofood",
  "shopeefood",
  "sevenrooms",
  "resdiary",
  "chope",
  "tablecheck",
]);

type JsonRecord = Record<string, unknown>;
type ValueResult<T> = { ok: true; value: T } | { ok: false };

function hasOwn(record: JsonRecord, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function exactRecord(
  value: unknown,
  allowedKeys: readonly string[],
  requiredKeys: readonly string[] = [],
): JsonRecord | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const record = value as JsonRecord;
  const allowed = new Set(allowedKeys);
  if (
    Object.keys(record).some((key) => !allowed.has(key)) ||
    requiredKeys.some((key) => !hasOwn(record, key))
  ) {
    return null;
  }
  return record;
}

function trimmedString(
  value: unknown,
  minLength: number,
  maxLength: number,
): ValueResult<string> {
  if (
    typeof value !== "string" ||
    value.length > maxLength ||
    value.includes("\0")
  ) {
    return { ok: false };
  }
  const trimmed = value.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength
    ? { ok: true, value: trimmed }
    : { ok: false };
}

function optionalTrimmedString(
  value: unknown,
  maxLength: number,
): ValueResult<string | null> {
  if (value === undefined) return { ok: true, value: null };
  const parsed = trimmedString(value, 0, maxLength);
  if (!parsed.ok) return parsed;
  return { ok: true, value: parsed.value || null };
}

function isVenueSlug(value: unknown): value is string {
  return typeof value === "string" && value.length <= 120 && VENUE_SLUG.test(value);
}

function isOnboardToken(value: unknown): value is string {
  return typeof value === "string" && ONBOARD_TOKEN.test(value);
}

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export interface SharedListRequest {
  slugs: string[] | null;
}

export function parseSharedListRequest(value: unknown): SharedListRequest | null {
  const record = exactRecord(value, ["slugs"]);
  if (!record) return null;
  if (!hasOwn(record, "slugs")) return { slugs: null };
  if (!Array.isArray(record.slugs) || record.slugs.length > 50) return null;
  if (!record.slugs.every(isVenueSlug)) return null;
  const slugs = record.slugs as string[];
  if (new Set(slugs).size !== slugs.length) return null;
  return { slugs: [...slugs] };
}

export interface SavePlaceRequest {
  venueSlug: string;
  saved: boolean;
}

export function parseSavePlaceRequest(value: unknown): SavePlaceRequest | null {
  const record = exactRecord(value, ["venueSlug", "saved"], ["venueSlug", "saved"]);
  return record && isVenueSlug(record.venueSlug) && typeof record.saved === "boolean"
    ? { venueSlug: record.venueSlug, saved: record.saved }
    : null;
}

export interface RedeemRequest {
  venueSlug: string;
  consentGranted: boolean;
  qrToken: string;
}

export function parseRedeemRequest(value: unknown): RedeemRequest | null {
  const record = exactRecord(
    value,
    ["venueSlug", "consentGranted", "qrToken"],
    ["venueSlug", "consentGranted", "qrToken"],
  );
  if (
    !record ||
    !isVenueSlug(record.venueSlug) ||
    typeof record.consentGranted !== "boolean" ||
    typeof record.qrToken !== "string" ||
    !REDEMPTION_TOKEN.test(record.qrToken)
  ) {
    return null;
  }
  return {
    venueSlug: record.venueSlug,
    consentGranted: record.consentGranted,
    qrToken: record.qrToken,
  };
}

export interface ConfirmOnboardingRequest {
  token: string;
  name: string;
  agreed: boolean;
}

export function parseConfirmOnboardingRequest(
  value: unknown,
): ConfirmOnboardingRequest | null {
  const record = exactRecord(value, ["token", "name", "agreed"], ["token", "name", "agreed"]);
  const name = record ? trimmedString(record.name, 2, 120) : { ok: false as const };
  if (
    !record ||
    !isOnboardToken(record.token) ||
    !name.ok ||
    typeof record.agreed !== "boolean"
  ) {
    return null;
  }
  return { token: record.token, name: name.value, agreed: record.agreed };
}

export interface OnboardJtbdRequest {
  token: string;
  ownerNote: string;
}

export function parseOnboardJtbdRequest(value: unknown): OnboardJtbdRequest | null {
  const record = exactRecord(value, ["token", "ownerNote"], ["token", "ownerNote"]);
  const ownerNote = record
    ? trimmedString(record.ownerNote, 0, 2_000)
    : { ok: false as const };
  if (!record || !isOnboardToken(record.token) || !ownerNote.ok) return null;
  return { token: record.token, ownerNote: ownerNote.value };
}

type GuideChannel = "email" | "whatsapp";
type GuideLanguage = "en" | "ru";
type UtmKey = (typeof UTM_KEYS)[number];

export interface GuideLeadRequest {
  firstName: string;
  channel: GuideChannel;
  email: string | null;
  whatsapp: string | null;
  travelDate: string | null;
  interests: string[] | null;
  language: GuideLanguage | null;
  source: string | null;
  utm: Partial<Record<UtmKey, string>> | null;
  consent: boolean;
}

export type GuideLeadParseResult =
  | { spam: true }
  | { spam: false; value: GuideLeadRequest };

function parseInterests(value: unknown): ValueResult<string[] | null> {
  if (value === undefined) return { ok: true, value: null };
  if (!Array.isArray(value) || value.length > 8) return { ok: false };
  if (
    !value.every((item) => typeof item === "string" && GUIDE_INTERESTS.has(item)) ||
    new Set(value).size !== value.length
  ) {
    return { ok: false };
  }
  return { ok: true, value: [...value] as string[] };
}

function parseUtm(value: unknown): ValueResult<Partial<Record<UtmKey, string>> | null> {
  if (value === undefined) return { ok: true, value: null };
  const record = exactRecord(value, UTM_KEYS);
  if (!record) return { ok: false };
  const utm: Partial<Record<UtmKey, string>> = {};
  for (const key of UTM_KEYS) {
    if (!hasOwn(record, key)) continue;
    const parsed = trimmedString(record[key], 1, 120);
    if (!parsed.ok) return { ok: false };
    utm[key] = parsed.value;
  }
  return { ok: true, value: utm };
}

export function parseGuideLeadRequest(value: unknown): GuideLeadParseResult | null {
  const record = exactRecord(value, [
    "firstName",
    "channel",
    "email",
    "whatsapp",
    "travelDate",
    "interests",
    "language",
    "source",
    "utm",
    "consent",
    "website",
  ]);
  if (!record) return null;

  const website = optionalTrimmedString(record.website, 200);
  if (!website.ok) return null;
  if (website.value) return { spam: true };

  if (!["firstName", "channel", "consent"].every((key) => hasOwn(record, key))) return null;
  const firstName = trimmedString(record.firstName, 1, 80);
  const email = optionalTrimmedString(record.email, 200);
  const whatsapp = optionalTrimmedString(record.whatsapp, 20);
  const travelDate = optionalTrimmedString(record.travelDate, 10);
  const language = optionalTrimmedString(record.language, 12);
  const source = optionalTrimmedString(record.source, 64);
  const interests = parseInterests(record.interests);
  const utm = parseUtm(record.utm);
  if (
    !firstName.ok ||
    !email.ok ||
    !whatsapp.ok ||
    !travelDate.ok ||
    !language.ok ||
    !source.ok ||
    !interests.ok ||
    !utm.ok ||
    (record.channel !== "email" && record.channel !== "whatsapp") ||
    typeof record.consent !== "boolean"
  ) {
    return null;
  }

  const channel = record.channel as GuideChannel;
  if (
    (channel === "email" && (!email.value || !EMAIL.test(email.value) || whatsapp.value !== null)) ||
    (channel === "whatsapp" && (!whatsapp.value || !WHATSAPP.test(whatsapp.value) || email.value !== null)) ||
    (travelDate.value !== null && !isValidIsoDate(travelDate.value)) ||
    (language.value !== null && !GUIDE_LANGUAGES.has(language.value as GuideLanguage)) ||
    (source.value !== null && !SOURCE_ID.test(source.value))
  ) {
    return null;
  }

  return {
    spam: false,
    value: {
      firstName: firstName.value,
      channel,
      email: channel === "email" ? email.value?.toLowerCase() ?? null : null,
      whatsapp: channel === "whatsapp" ? whatsapp.value : null,
      travelDate: travelDate.value,
      interests: interests.value,
      language: language.value as GuideLanguage | null,
      source: source.value,
      utm: utm.value,
      consent: record.consent,
    },
  };
}

export interface MenuDraftRequest {
  draftType: "menu";
  token: string;
  title: string;
  sourceUrl: string;
  section: string;
  itemName: string;
  priceMinor: number | null;
}

export interface ActionDraftRequest {
  draftType: "action";
  token: string;
  kind: Exclude<ActionKind, "maps">;
  provider: string;
  url: string;
}

export type OnboardDraftRequest = MenuDraftRequest | ActionDraftRequest;

function parsePriceMinor(value: unknown): ValueResult<number | null> {
  if (value === undefined) return { ok: true, value: null };
  const raw = trimmedString(value, 0, 20);
  if (!raw.ok) return raw;
  if (!raw.value) return { ok: true, value: null };
  if (!/^(?:0|[1-9]\d{0,9})$/.test(raw.value)) return { ok: false };
  const amount = Number(raw.value);
  return Number.isSafeInteger(amount) && amount <= 1_000_000_000
    ? { ok: true, value: amount }
    : { ok: false };
}

export function parseOnboardDraftRequest(value: unknown): OnboardDraftRequest | null {
  const envelope = exactRecord(value, [
    "draftType",
    "token",
    "title",
    "sourceUrl",
    "section",
    "item",
    "price",
    "kind",
    "provider",
    "url",
  ]);
  if (!envelope || !isOnboardToken(envelope.token)) return null;

  if (envelope.draftType === "menu") {
    const record = exactRecord(
      value,
      ["draftType", "token", "title", "sourceUrl", "section", "item", "price"],
      ["draftType", "token", "title", "sourceUrl", "section", "item"],
    );
    if (!record) return null;
    const title = trimmedString(record.title, 1, 160);
    const section = trimmedString(record.section, 1, 160);
    const itemName = trimmedString(record.item, 1, 240);
    const priceMinor = parsePriceMinor(record.price);
    const sourceUrl = validatePublicEvidenceUrl(record.sourceUrl);
    if (!title.ok || !section.ok || !itemName.ok || !priceMinor.ok || !sourceUrl) return null;
    return {
      draftType: "menu",
      token: envelope.token,
      title: title.value,
      sourceUrl,
      section: section.value,
      itemName: itemName.value,
      priceMinor: priceMinor.value,
    };
  }

  if (envelope.draftType !== "action") return null;
  const record = exactRecord(
    value,
    ["draftType", "token", "kind", "provider", "url"],
    ["draftType", "token", "kind", "provider", "url"],
  );
  if (!record || typeof record.kind !== "string" || !ACTION_KINDS.has(record.kind as ActionKind)) {
    return null;
  }
  const rawProvider = trimmedString(record.provider, 1, 80);
  const publicUrl = validatePublicEvidenceUrl(record.url);
  if (!rawProvider.ok || !publicUrl) return null;
  const normalizedProvider = normalizeActionProvider(rawProvider.value);
  if (!normalizedProvider || !DRAFT_PROVIDERS.has(normalizedProvider)) return null;

  const kind = record.kind as Exclude<ActionKind, "maps">;
  const provider = kind === "whatsapp" ? "whatsapp" : normalizedProvider;
  const url = provider === "whatsapp"
    ? (whatsAppPhoneFromUrl(publicUrl) ? parseSafeHttpsUrl(publicUrl)?.toString() ?? null : null)
    : validateExternalProviderUrl({
        provider,
        kind,
        url: publicUrl,
        sourceUrl: publicUrl,
        officialUrls: [publicUrl],
      });
  return url
    ? { draftType: "action", token: envelope.token, kind, provider, url }
    : null;
}
