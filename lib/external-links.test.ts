import assert from "node:assert/strict";
import test from "node:test";
import {
  controlledExternalOpen,
  classifyGoogleMapsHandoff,
  googleMapsHandoffLabel,
  normalizeInstagramProfileUrl,
  parseSafeHttpsUrl,
  resolveSafeExternalLink,
  validateAppleMapsUrl,
  validateGoogleMapsUrl,
  validateInstagramUrl,
  validateOfficialWebsiteUrl,
  validateWhatsAppPhone,
  whatsAppPhoneFromUrl,
} from "./external-links";

test("rejects unsafe schemes, credentials, private hosts, and nonstandard ports", () => {
  for (const value of [
    "javascript:alert(1)",
    "data:text/html,pwned",
    "http://venue.example.org",
    "https://user:secret@venue.example.org",
    "https://localhost/path",
    "https://127.0.0.1/path",
    "https://venue.example.org:8443/path",
  ]) {
    assert.equal(validateOfficialWebsiteUrl(value), null, value);
  }
  assert.equal(
    validateOfficialWebsiteUrl("https://venue.example.org/menu"),
    "https://venue.example.org/menu",
  );
});

test("validates Google and Apple Maps without accepting lookalike hosts", () => {
  assert.equal(
    validateGoogleMapsUrl("https://www.google.com/maps/place/Bali"),
    "https://www.google.com/maps/place/Bali",
  );
  assert.equal(validateGoogleMapsUrl("https://www.google.com.evil.test/maps"), null);
  assert.equal(
    validateAppleMapsUrl("https://maps.apple.com/?q=Bali"),
    "https://maps.apple.com/?q=Bali",
  );
  assert.equal(validateAppleMapsUrl("https://maps.apple.com.evil.invalid/?q=Bali"), null);
});

test("labels exact Maps listings separately from ambiguous searches", () => {
  assert.equal(
    classifyGoogleMapsHandoff("https://www.google.com/maps/place/Single+Fin/@-8.8,115.1,15z"),
    "exact",
  );
  assert.equal(
    classifyGoogleMapsHandoff("https://www.google.com/maps/search/?api=1&query=Single+Fin+Bali"),
    "search",
  );
  assert.equal(
    classifyGoogleMapsHandoff("https://www.google.com/maps/search/?api=1&query=Single+Fin&query_place_id=ChIJ123"),
    "exact",
  );
  assert.equal(googleMapsHandoffLabel("https://maps.google.com/?q=Canggu+coffee"), "Search in Google Maps");
  assert.equal(googleMapsHandoffLabel("https://maps.app.goo.gl/v5HGaAzKoXdvQh6i9"), "Open in Google Maps");
  assert.equal(googleMapsHandoffLabel("https://maps.google.com.evil.invalid/maps/place/Test"), null);
});

test("accepts only actual Instagram profile URLs for Instagram handoffs", () => {
  assert.equal(
    validateInstagramUrl("https://www.instagram.com/otherbali/"),
    "https://www.instagram.com/otherbali/",
  );
  assert.equal(validateInstagramUrl("https://instagram.com.evil.invalid/otherbali"), null);
  assert.equal(validateInstagramUrl("https://www.instagram.com/"), null);
});

test("normalizes explicit Instagram handles without creating relative internal links", () => {
  assert.equal(
    normalizeInstagramProfileUrl("@otherbali"),
    "https://www.instagram.com/otherbali/",
  );
  assert.equal(
    normalizeInstagramProfileUrl("https://instagram.com/otherbali"),
    "https://instagram.com/otherbali",
  );
  assert.equal(normalizeInstagramProfileUrl("other bali"), null);
  assert.equal(normalizeInstagramProfileUrl("/places/not-instagram"), null);
});

test("validates WhatsApp numbers and controlled URL forms", () => {
  assert.equal(validateWhatsAppPhone("628123456789"), "628123456789");
  assert.equal(validateWhatsAppPhone("+62 812 345"), null);
  assert.equal(whatsAppPhoneFromUrl("https://wa.me/628123456789"), "628123456789");
  assert.equal(
    whatsAppPhoneFromUrl("https://api.whatsapp.com/send?phone=628123456789"),
    "628123456789",
  );
  assert.equal(whatsAppPhoneFromUrl("https://wa.me.evil.invalid/628123456789"), null);
});

test("returns safe browser attributes only after kind-specific validation", () => {
  assert.deepEqual(
    resolveSafeExternalLink("https://maps.apple.com/?q=Bali", "apple_maps"),
    {
      href: "https://maps.apple.com/?q=Bali",
      kind: "apple_maps",
      external: true,
      rel: "external noopener noreferrer",
      target: "_blank",
    },
  );
  assert.equal(resolveSafeExternalLink("https://venue.example.org", "google_maps"), null);
  assert.equal(parseSafeHttpsUrl("otherbali://places/test"), null);
});

test("controlled external open persists state and enforces a caller host allowlist", () => {
  const events: string[] = [];
  const opened = controlledExternalOpen(
    "https://www.otherbali.com/privacy",
    "official_website",
    {
      allowedHosts: ["www.otherbali.com"],
      beforeOpen: () => events.push("persist"),
      openWindow: (href, target, features) => events.push(`${href}|${target}|${features}`),
    },
  );

  assert.equal(opened, true);
  assert.deepEqual(events, [
    "persist",
    "https://www.otherbali.com/privacy|_blank|noopener,noreferrer",
  ]);

  assert.equal(controlledExternalOpen(
    "https://malicious.example.org/privacy",
    "official_website",
    {
      allowedHosts: ["www.otherbali.com"],
      beforeOpen: () => events.push("must-not-persist"),
      openWindow: () => events.push("must-not-open"),
    },
  ), false);
  assert.equal(events.includes("must-not-persist"), false);
  assert.equal(events.includes("must-not-open"), false);
});
