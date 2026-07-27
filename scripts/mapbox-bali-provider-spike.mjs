#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const token = process.env.MAPBOX_ACCESS_TOKEN?.trim();
if (!token?.startsWith("pk.")) {
  throw new Error("MAPBOX_ACCESS_TOKEN must be a Mapbox public token");
}

const output = process.argv[2] ?? "artifacts/mapbox-bali-provider-spike.json";
const endpoint = "https://api.mapbox.com/directions/v5/mapbox";

const journeys = [
  {
    id: "south-bali-driving",
    profile: "driving-traffic",
    from: [115.1686, -8.6905],
    to: [115.0849, -8.8291],
    expected: { minKm: 15, maxKm: 40 },
  },
  {
    id: "canggu-ubud-driving",
    profile: "driving",
    from: [115.1385, -8.6478],
    to: [115.2625, -8.5069],
    expected: { minKm: 20, maxKm: 55 },
  },
  {
    id: "sanur-ubud-driving",
    profile: "driving",
    from: [115.2626, -8.7078],
    to: [115.2625, -8.5069],
    expected: { minKm: 18, maxKm: 45 },
  },
  {
    id: "ubud-lovina-driving",
    profile: "driving",
    from: [115.2625, -8.5069],
    to: [115.0254, -8.1614],
    expected: { minKm: 45, maxKm: 100 },
  },
  {
    id: "amed-local-driving",
    profile: "driving",
    from: [115.6801, -8.3423],
    to: [115.6124, -8.4067],
    expected: { minKm: 8, maxKm: 35 },
  },
  {
    id: "nusa-penida-driving",
    profile: "driving",
    from: [115.5442, -8.6744],
    to: [115.4563, -8.7155],
    expected: { minKm: 10, maxKm: 45 },
  },
  {
    id: "ubud-walking",
    profile: "walking",
    from: [115.2625, -8.5069],
    to: [115.2564, -8.5186],
    expected: { minKm: 1, maxKm: 6 },
  },
  {
    id: "sanur-cycling",
    profile: "cycling",
    from: [115.2626, -8.7078],
    to: [115.2656, -8.6754],
    expected: { minKm: 3, maxKm: 12 },
  },
];

function boundedNumber(value, minimum, maximum) {
  return typeof value === "number"
    && Number.isFinite(value)
    && value >= minimum
    && value <= maximum;
}

async function checkJourney(journey) {
  const coordinates = `${journey.from.join(",")};${journey.to.join(",")}`;
  const url = new URL(`${endpoint}/${journey.profile}/${coordinates}`);
  url.searchParams.set("access_token", token);
  url.searchParams.set("alternatives", "false");
  url.searchParams.set("overview", "simplified");
  url.searchParams.set("geometries", "geojson");
  url.searchParams.set("steps", "true");
  url.searchParams.set("language", "en");

  const started = performance.now();
  const response = await fetch(url, {
    headers: { "User-Agent": "Other-Bali-Provider-Spike/1.0" },
    signal: AbortSignal.timeout(15_000),
  });
  const elapsedMs = Math.round(performance.now() - started);
  const payload = await response.json();
  const route = Array.isArray(payload.routes) ? payload.routes[0] : null;
  const distanceKm = route?.distance / 1000;
  const durationMinutes = route?.duration / 60;
  const geometryPoints = route?.geometry?.coordinates?.length ?? 0;
  const stepCount = route?.legs?.reduce(
    (total, leg) => total + (Array.isArray(leg.steps) ? leg.steps.length : 0),
    0,
  ) ?? 0;
  const passed = response.ok
    && payload.code === "Ok"
    && boundedNumber(distanceKm, journey.expected.minKm, journey.expected.maxKm)
    && boundedNumber(durationMinutes, 1, 720)
    && geometryPoints >= 2
    && stepCount >= 1;

  return {
    id: journey.id,
    profile: journey.profile,
    httpStatus: response.status,
    providerCode: typeof payload.code === "string" ? payload.code : "unknown",
    elapsedMs,
    distanceKm: Number.isFinite(distanceKm) ? Number(distanceKm.toFixed(2)) : null,
    durationMinutes: Number.isFinite(durationMinutes) ? Number(durationMinutes.toFixed(1)) : null,
    geometryPoints,
    stepCount,
    expectedDistanceKm: journey.expected,
    passed,
  };
}

const results = [];
for (const journey of journeys) {
  try {
    results.push(await checkJourney(journey));
  } catch (error) {
    results.push({
      id: journey.id,
      profile: journey.profile,
      httpStatus: null,
      providerCode: "request_failed",
      elapsedMs: null,
      distanceKm: null,
      durationMinutes: null,
      geometryPoints: 0,
      stepCount: 0,
      expectedDistanceKm: journey.expected,
      passed: false,
      error: error instanceof Error ? error.name : "unknown_error",
    });
  }
}

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  provider: "mapbox",
  endpoint: "Directions API v5",
  tokenIncluded: false,
  scope: {
    routeProfiles: [...new Set(journeys.map((journey) => journey.profile))],
    areas: ["South Bali", "Canggu", "Ubud", "Sanur", "Lovina", "Amed", "Nusa Penida"],
    limitation: "Mapbox has no scooter profile; scooter journeys require Bali field review and are never labelled as motorcycle-specific.",
  },
  summary: {
    total: results.length,
    passed: results.filter((result) => result.passed).length,
    failed: results.filter((result) => !result.passed).length,
    acceptancePassed: results.every((result) => result.passed),
  },
  results,
};

await mkdir(path.dirname(path.resolve(output)), { recursive: true });
await writeFile(output, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
console.log(`Mapbox Bali provider spike: ${report.summary.passed}/${report.summary.total} passed`);
console.log(`Redacted report: ${output}`);
if (!report.summary.acceptancePassed) process.exitCode = 1;
