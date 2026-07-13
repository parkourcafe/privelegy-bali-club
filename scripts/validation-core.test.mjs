import assert from "node:assert/strict";
import test from "node:test";
import {
  VALIDATION_MODES,
  classifyActionKind,
  normalizeActionProvider,
  parseValidationCliArgs,
  validateCapability,
  validateMenu,
} from "./validation-core.mjs";

const evidence = {
  sourceUrl: "https://venue.test/source",
  sourceLabel: "Official",
  capturedAt: "2026-07-01T00:00:00Z",
  verifiedAt: null,
};

function menu(overrides = {}) {
  return {
    ...evidence,
    venueSlug: "venue",
    title: "Menu",
    version: 1,
    status: "draft",
    expiresAt: null,
    sections: [{
      name: "Food",
      description: null,
      position: 0,
      items: [{
        name: "Dish",
        description: null,
        priceMinor: 1000,
        currency: "IDR",
        sourceDisplayPrice: "Rp 1.000",
        priceText: "Rp 1.000",
        dietaryTags: [],
        verifiedAllergenTags: [],
        partnerRecommended: false,
        editorialPick: false,
        editorialNote: null,
        availabilityNote: null,
        position: 0,
      }],
    }],
    ...overrides,
  };
}

function capability(overrides = {}) {
  return {
    ...evidence,
    venueSlug: "venue",
    kind: "website",
    provider: "official",
    version: 1,
    url: "https://venue.test/order",
    label: "Official website",
    status: "draft",
    priority: 10,
    confirmationRequired: false,
    expiresAt: null,
    ...overrides,
  };
}

test("import dry-run accepts sourced, unverified draft candidates", () => {
  assert.deepEqual(validateMenu(menu(), 0).errors, []);
  assert.deepEqual(validateCapability(capability(), 0).errors, []);
});

test("publish validation requires real verification and a reviewed/public status", () => {
  const blocked = validateMenu(menu(), 0, { mode: VALIDATION_MODES.PUBLISH });
  assert.ok(blocked.errors.includes("verifiedAt is required for publish validation"));
  assert.ok(blocked.errors.includes("publish candidates must be reviewed or already public"));

  const ready = validateMenu(menu({
    status: "review",
    verifiedAt: "2026-07-02T00:00:00Z",
  }), 0, { mode: VALIDATION_MODES.PUBLISH, now: "2026-07-14T00:00:00Z" });
  assert.deepEqual(ready.errors, []);
});

test("rejects future and illogical verification timestamps", () => {
  const future = validateMenu(menu({
    status: "review",
    verifiedAt: "2026-07-15T00:00:00Z",
  }), 0, { mode: VALIDATION_MODES.PUBLISH, now: "2026-07-14T00:00:00Z" });
  assert.ok(future.errors.includes("verifiedAt cannot be in the future"));

  const beforeCapture = validateCapability(capability({
    status: "review",
    verifiedAt: "2026-06-30T23:59:59Z",
  }), 0, { mode: VALIDATION_MODES.PUBLISH, now: "2026-07-14T00:00:00Z" });
  assert.ok(beforeCapture.errors.includes("verifiedAt cannot be earlier than capturedAt"));

  const afterExpiry = validateMenu(menu({
    status: "review",
    verifiedAt: "2026-07-03T00:00:00Z",
    expiresAt: "2026-07-03T00:00:00Z",
  }), 0, { mode: VALIDATION_MODES.PUBLISH, now: "2026-07-14T00:00:00Z" });
  assert.ok(afterExpiry.errors.includes("verifiedAt must be earlier than expiresAt"));
});

test("initial Data Ops import accepts only version 1", () => {
  assert.ok(validateMenu(menu({ version: 2 }), 0).errors.includes("initial Data Ops import version must equal 1"));
  assert.ok(validateCapability(capability({ version: 2 }), 0).errors.includes("initial Data Ops import version must equal 1"));
  assert.deepEqual(validateMenu(menu({ version: 2, status: "review", verifiedAt: "2026-07-02T00:00:00Z" }), 0, {
    mode: VALIDATION_MODES.PUBLISH,
    now: "2026-07-14T00:00:00Z",
  }).errors, []);
});

test("blocks editorial injection, public status and broken price/currency pairs", () => {
  const row = menu({
    status: "published",
    sections: [{
      name: "Food",
      position: 0,
      items: [{
        name: "Dish",
        priceMinor: 1000,
        currency: null,
        dietaryTags: [],
        verifiedAllergenTags: [],
        position: 0,
        editorialPick: true,
      }],
    }],
  });
  const result = validateMenu(row, 0);
  assert.ok(result.errors.some((error) => error.includes("draft or review")));
  assert.ok(result.errors.some((error) => error.includes("editorial")));
  assert.ok(result.errors.some((error) => error.includes("priceMinor and currency")));
});

test("preserves source price text even when a structured amount is unavailable", () => {
  const textOnly = menu({
    sections: [{
      name: "Market",
      position: 0,
      items: [{
        name: "Market fish",
        priceMinor: null,
        currency: null,
        sourceDisplayPrice: "market price",
        priceText: "market price",
        dietaryTags: [],
        verifiedAllergenTags: [],
        position: 0,
      }],
    }],
  });
  assert.deepEqual(validateMenu(textOnly, 0).errors, []);
  textOnly.sections[0].items[0].priceText = "invented";
  assert.ok(validateMenu(textOnly, 0).errors.includes("priceText must preserve sourceDisplayPrice exactly"));
});

test("normalizes provider and maps aliases and classifies only unambiguous order actions", () => {
  assert.equal(normalizeActionProvider("official_website"), "official");
  assert.equal(normalizeActionProvider("grab"), "grabfood");
  assert.equal(normalizeActionProvider("instagram"), null);
  assert.deepEqual(classifyActionKind("directions"), { kind: "maps", classification: "normalized_map_alias" });
  assert.deepEqual(classifyActionKind("order", { provider: "gofood" }), {
    kind: "delivery",
    classification: "order_provider_delivery",
  });
  assert.deepEqual(classifyActionKind("order", { provider: "whatsapp", label: "Order / call" }), {
    kind: null,
    classification: "ambiguous_order_kind",
  });
});

test("blocks HTTP, unsupported providers, provider mismatches and unapproved hosts", () => {
  assert.ok(validateCapability(capability({ url: "http://venue.test" }), 0).errors.some((error) => error.includes("HTTPS")));
  assert.ok(validateCapability(capability({ provider: "instagram" }), 0).errors.some((error) => error.includes("not supported")));
  assert.ok(validateCapability(capability({ kind: "reserve", provider: "gofood", url: "https://gofood.link/a/test" }), 0).errors.some((error) => error.includes("does not support")));
  assert.ok(validateCapability(capability({ kind: "delivery", provider: "gofood", url: "https://evil.test/order" }), 0).errors.some((error) => error.includes("host is not approved")));
});

test("validation CLI mode is explicit and defaults to import dry-run", () => {
  assert.deepEqual(parseValidationCliArgs(["candidate.json"]), {
    mode: VALIDATION_MODES.IMPORT_DRY_RUN,
    path: "candidate.json",
  });
  assert.deepEqual(parseValidationCliArgs(["--mode=publish", "candidate.json"]), {
    mode: VALIDATION_MODES.PUBLISH,
    path: "candidate.json",
  });
});
