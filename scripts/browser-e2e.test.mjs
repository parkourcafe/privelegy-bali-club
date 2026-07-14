import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./browser-e2e.mjs", import.meta.url), "utf8");
const packageManifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const workflow = readFileSync(new URL("../.github/workflows/browser-e2e.yml", import.meta.url), "utf8");

test("browser E2E is a real production-browser and accessibility gate", () => {
  assert.match(source, /from "puppeteer-core"/);
  assert.match(source, /from "axe-core"/);
  assert.match(source, /BASE_URL is required/);
  assert.match(source, /Accessibility\.getFullAXTree/);
  assert.match(source, /axeRuntime\.run\(document/);
  assert.match(source, /resultTypes: \["violations", "incomplete"\]/);
  assert.match(source, /missing skip link/);
  assert.match(source, /skip link is first keyboard stop/);
  assert.match(source, /aria-pressed/);
  assert.match(source, /aria-live/);
  assert.match(source, /touch targets below 44px/);
  assert.match(source, /horizontal overflow/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /automatic event\/source requests/);
  assert.match(source, /outside the allowed-consent phase/);
  assert.match(source, /consentedAnalyticsRequests/);
  assert.match(source, /externalAnalyticsRequests/);
  assert.match(source, /googletagmanager\.com/);
  assert.match(source, /bp_guest/);
  assert.match(source, /bp_guest_proof/);
  assert.match(source, /__Host-bp_guest/);
  assert.match(source, /__Host-ob_consent/);
  assert.match(source, /function cookieEvidence/);
  assert.doesNotMatch(
    source,
    /JSON\.stringify\((?:beforeCookies|rejectedCookies|allowedCookies|withdrawnCookies|deletedCookies)\)/,
  );
  assert.match(source, /configured analytics grant persists a consented event/);
  assert.match(source, /server rejects analytics events after withdrawal/);
  assert.match(source, /endExplicitAnalyticsProbe/);
  assert.match(source, /deletion is idempotently confirmed/);
  assert.match(source, /E2E_REQUIRE_DATA/);
  assert.match(source, /published venue exposes a directions handoff/);
  assert.match(source, /published route links to a venue detail/);
  assert.match(source, /bounded six-reason incorrect-info report/);
  assert.match(source, /route share reaches a visible device, clipboard or manual fallback/);
  assert.match(source, /Back restores the selected filter state/);
  assert.match(source, /Forward restores the cleared filter state/);
  assert.match(source, /expectedAbortedPrefetches/);
  assert.match(source, /unexpectedHttpErrorResponses/);
  assert.match(source, /browser has no unexpected HTTP error responses/);
  assert.match(source, /browser has no console errors/);
  assert.match(source, /expectedConsoleErrors/);
  assert.match(source, /response\.status === Number\(statusMatch\[1\]\) && response\.path === pathName/);
  assert.match(source, /notClaimed/);
  assert.match(source, /browser-e2e-report\.json/);
  assert.equal(packageManifest.scripts["test:e2e"], "node scripts/browser-e2e.mjs");
  assert.match(packageManifest.devDependencies["axe-core"], /^\d+\.\d+\.\d+$/);
  assert.match(workflow, /npm run test:e2e/);
  assert.match(workflow, /environment: otherbali-browser-staging/);
  assert.match(workflow, /github\.ref_protected/);
  assert.match(workflow, /ci-validate-browser-staging\.mjs/);
  assert.match(workflow, /Install locked dependencies without staging secrets/);
});
