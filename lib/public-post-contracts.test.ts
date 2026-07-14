import assert from "node:assert/strict";
import test from "node:test";
import {
  parseConfirmOnboardingRequest,
  parseGuideLeadRequest,
  parseOnboardDraftRequest,
  parseOnboardJtbdRequest,
  parseRedeemRequest,
  parseSavePlaceRequest,
  parseSharedListRequest,
} from "./api/public-post-contracts";

const TOKEN = "partner_token_12345678901234567890";
const QR_TOKEN = `abc123.${"A".repeat(43)}`;

test("save, list, and redeem schemas are exact and reject caller identity", () => {
  assert.deepEqual(parseSharedListRequest({}), { slugs: null });
  assert.deepEqual(parseSharedListRequest({ slugs: ["sample-cafe", "second-stop"] }), {
    slugs: ["sample-cafe", "second-stop"],
  });
  assert.equal(parseSharedListRequest({ slugs: ["sample-cafe", "../admin"] }), null);
  assert.equal(parseSharedListRequest({ slugs: ["sample-cafe", "sample-cafe"] }), null);
  assert.equal(parseSharedListRequest({ slugs: Array.from({ length: 51 }, (_, i) => `v-${i}`) }), null);
  assert.equal(parseSharedListRequest({ slugs: ["sample-cafe"], guestRef: "g_attackerchosen1" }), null);

  assert.deepEqual(parseSavePlaceRequest({ venueSlug: "sample-cafe", saved: true }), {
    venueSlug: "sample-cafe",
    saved: true,
  });
  assert.deepEqual(parseSavePlaceRequest({ venueSlug: "sample-cafe", saved: false }), {
    venueSlug: "sample-cafe",
    saved: false,
  });
  assert.equal(parseSavePlaceRequest({ venueSlug: "sample-cafe" }), null);
  assert.equal(parseSavePlaceRequest({ venueSlug: "sample-cafe", saved: true, userId: "attacker" }), null);

  assert.deepEqual(parseRedeemRequest({
    venueSlug: "sample-cafe",
    consentGranted: true,
    qrToken: QR_TOKEN,
  }), {
    venueSlug: "sample-cafe",
    consentGranted: true,
    qrToken: QR_TOKEN,
  });
  assert.equal(parseRedeemRequest({
    venueSlug: "sample-cafe",
    consentGranted: "true",
    qrToken: QR_TOKEN,
  }), null);
  assert.equal(parseRedeemRequest({
    venueSlug: "sample-cafe",
    consentGranted: true,
    qrToken: QR_TOKEN,
    guestRef: "g_attackerchosen1",
  }), null);
});

test("onboarding schemas reject overlong values instead of truncating them", () => {
  assert.deepEqual(parseConfirmOnboardingRequest({ token: TOKEN, name: "  Made, manager  ", agreed: true }), {
    token: TOKEN,
    name: "Made, manager",
    agreed: true,
  });
  assert.equal(parseConfirmOnboardingRequest({ token: TOKEN, name: "x".repeat(121), agreed: true }), null);
  assert.equal(parseConfirmOnboardingRequest({
    token: TOKEN,
    name: "Made",
    agreed: true,
    userAgent: "caller-controlled",
  }), null);

  assert.deepEqual(parseOnboardJtbdRequest({ token: TOKEN, ownerNote: "  Family-run since 2018.  " }), {
    token: TOKEN,
    ownerNote: "Family-run since 2018.",
  });
  assert.equal(parseOnboardJtbdRequest({ token: TOKEN, ownerNote: "x".repeat(2_001) }), null);
  assert.equal(parseOnboardJtbdRequest({ token: TOKEN, ownerNote: "ok", venueSlug: "other" }), null);
});

test("guide lead schema allowlists contact, metadata, and honeypot fields", () => {
  const emailLead = parseGuideLeadRequest({
    firstName: "  Maya  ",
    channel: "email",
    email: "MAYA@example.com",
    whatsapp: "",
    travelDate: "2026-08-20",
    interests: ["food", "sunset"],
    language: "en",
    source: "villa_01",
    utm: { utm_source: "newsletter" },
    consent: true,
    website: "",
  });
  assert.deepEqual(emailLead, {
    spam: false,
    value: {
      firstName: "Maya",
      channel: "email",
      email: "maya@example.com",
      whatsapp: null,
      travelDate: "2026-08-20",
      interests: ["food", "sunset"],
      language: "en",
      source: "villa_01",
      utm: { utm_source: "newsletter" },
      consent: true,
    },
  });
  assert.equal(parseGuideLeadRequest({
    firstName: "Maya",
    channel: "whatsapp",
    email: "",
    whatsapp: "+62 8123",
    consent: true,
  }), null);
  assert.equal(parseGuideLeadRequest({
    firstName: "Maya",
    channel: "email",
    email: "maya@example.com",
    consent: true,
    guestRef: "g_attackerchosen1",
  }), null);
  assert.equal(parseGuideLeadRequest({
    firstName: "Maya",
    channel: "email",
    email: "maya@example.com",
    consent: true,
    utm: { email: "private@example.com" },
  }), null);
  assert.deepEqual(parseGuideLeadRequest({ website: "https://spam.test" }), { spam: true });
  assert.equal(parseGuideLeadRequest({ website: "https://spam.test", userId: "attacker" }), null);
});

test("partner draft schema validates full values and provider URL agreement", () => {
  assert.deepEqual(parseOnboardDraftRequest({
    draftType: "menu",
    token: TOKEN,
    title: "Lunch menu",
    sourceUrl: "https://venue.example.org/menu",
    section: "Mains",
    item: "Nasi campur",
    price: "85000",
  }), {
    draftType: "menu",
    token: TOKEN,
    title: "Lunch menu",
    sourceUrl: "https://venue.example.org/menu",
    section: "Mains",
    itemName: "Nasi campur",
    priceMinor: 85_000,
  });
  assert.equal(parseOnboardDraftRequest({
    draftType: "menu",
    token: TOKEN,
    title: "x".repeat(161),
    sourceUrl: "https://venue.example.org/menu",
    section: "Mains",
    item: "Nasi campur",
  }), null);
  assert.equal(parseOnboardDraftRequest({
    draftType: "menu",
    token: TOKEN,
    title: "Lunch menu",
    sourceUrl: "https://localhost/menu",
    section: "Mains",
    item: "Nasi campur",
    price: "10.5",
  }), null);
  assert.deepEqual(parseOnboardDraftRequest({
    draftType: "action",
    token: TOKEN,
    kind: "delivery",
    provider: "GrabFood",
    url: "https://grab.com/id/food/sample",
  }), {
    draftType: "action",
    token: TOKEN,
    kind: "delivery",
    provider: "grabfood",
    url: "https://grab.com/id/food/sample",
  });
  assert.equal(parseOnboardDraftRequest({
    draftType: "action",
    token: TOKEN,
    kind: "delivery",
    provider: "grabfood",
    url: "https://evil.example.org/grab",
  }), null);
  assert.equal(parseOnboardDraftRequest({
    draftType: "action",
    token: TOKEN,
    kind: "website",
    provider: "official",
    url: "https://venue.example.org",
    editorialPick: true,
  }), null);
});
