import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homePath = new URL("../app/page.tsx", import.meta.url);
const builderPath = new URL("../components/landing/DayIntentBuilder.tsx", import.meta.url);

const [homeSource, builderSource] = await Promise.all([
  readFile(homePath, "utf8"),
  readFile(builderPath, "utf8"),
]);

test("homepage preserves the product promise and presents traveller entrances first", () => {
  assert.match(homeSource, /The right place for the moment you&[a-z]+;re in\./);
  assert.match(homeSource, /<Hero \/>\s*<PrimaryEntrances \/>\s*<CategoryGateway/);
  assert.match(homeSource, /href="\/plan"[\s\S]*Before the trip/);
  assert.match(homeSource, /href="\/places"[\s\S]*In Bali now/);
  assert.match(homeSource, /Run a venue\?[\s\S]*href="\/for-venues"/);

  const primaryEntrances = homeSource.indexOf("function PrimaryEntrances");
  const partnerLink = homeSource.indexOf('href="/for-venues"', primaryEntrances);
  const primaryGridEnd = homeSource.indexOf("</div>", homeSource.indexOf("md:grid-cols-2", primaryEntrances));
  assert.ok(partnerLink > primaryGridEnd, "venue entry must follow the two primary traveller entries");
});

test("hero exposes the six required scenario routes without creating duplicates", () => {
  const required = [
    ["First day in Bali", "/first-time-in-bali"],
    ["Sunset", "/where-to-watch-sunset-in-bali"],
    ["With kids", "/bali-with-kids"],
    ["Rainy day", "/bali-rainy-day"],
    ["Romantic", "/romantic-bali"],
    ["Plan 3 / 5 / 7 days", "/how-many-days-in-bali"],
  ];

  for (const [label, href] of required) {
    assert.match(builderSource, new RegExp(`label: "${label.replaceAll("/", "\\/")}"[\\s\\S]{0,160}href: "${href.replaceAll("/", "\\/")}"`));
    assert.equal(builderSource.split(`href: "${href}"`).length - 1, 1, `${href} should appear once in quick starts`);
  }
});

test("homepage does not advertise the frozen paid-arrival model", () => {
  const forbiddenClaims = [
    "Venues pay only",
    "Venues pay for arrivals",
    "venue pays a fixed fee",
    "what the venue pays for",
    "only pays for a guest",
    "That seated visit",
  ];

  for (const claim of forbiddenClaims) {
    assert.ok(!homeSource.toLowerCase().includes(claim.toLowerCase()), `remove frozen claim: ${claim}`);
  }

  assert.match(homeSource, /Partner monetization is reserved during the pilot/);
  assert.match(homeSource, /nothing is charged automatically/i);
  assert.match(homeSource, /Organic order is editorial and never depends on payment/);
});
