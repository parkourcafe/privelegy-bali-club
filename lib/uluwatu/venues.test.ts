import assert from "node:assert/strict";
import test from "node:test";
import {
  freshVerifiedUluwatuActionUrl,
  getUluwatuContent,
} from "./venues";

const now = new Date("2026-07-14T00:00:00.000Z");

test("static action URLs require matching fresh VERIFIED evidence", () => {
  const mana = getUluwatuContent("mana-uluwatu");
  const whiteRock = getUluwatuContent("white-rock-beach-club");
  const singleFin = getUluwatuContent("single-fin");

  assert.equal(
    freshVerifiedUluwatuActionUrl(mana, "booking_url", mana?.bookingUrl, now),
    null,
  );
  assert.equal(
    freshVerifiedUluwatuActionUrl(whiteRock, "instagram_url", whiteRock?.instagramUrl, now),
    null,
  );
  assert.equal(
    freshVerifiedUluwatuActionUrl(singleFin, "booking_url", singleFin?.bookingUrl, now),
    "https://www.sevenrooms.com/reservations/singlefinuluwatu",
  );
});

test("verified static actions expire after the evidence TTL", () => {
  const singleFin = getUluwatuContent("single-fin");
  assert.equal(
    freshVerifiedUluwatuActionUrl(
      singleFin,
      "booking_url",
      singleFin?.bookingUrl,
      new Date("2026-08-12T00:00:01.000Z"),
    ),
    null,
  );
});

test("old evidence cannot authorize a changed destination", () => {
  const singleFin = getUluwatuContent("single-fin");
  assert.equal(
    freshVerifiedUluwatuActionUrl(
      singleFin,
      "booking_url",
      "https://evil.test/reservations/singlefinuluwatu",
      now,
    ),
    null,
  );
});
