import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const [
  inviteModule,
  dataModule,
  serviceModule,
  anonModule,
  freshnessActions,
  photoClient,
  photoRoute,
  releaseReadiness,
  onboardPage,
] = await Promise.all([
  read("lib/admin-invites.ts"),
  read("lib/data.ts"),
  read("lib/supabase/service.ts"),
  read("lib/supabase/server.ts"),
  read("app/admin/freshness/actions.ts"),
  read("app/onboard/[token]/OnboardActions.tsx"),
  read("app/api/onboard/photo/route.ts"),
  read("lib/data/release-readiness.ts"),
  read("app/onboard/[token]/page.tsx"),
]);

function functionBody(source, name) {
  const start = source.indexOf(`export async function ${name}`);
  assert.notEqual(start, -1, `${name} must exist`);
  const next = source.indexOf("\nexport async function ", start + 1);
  return source.slice(start, next === -1 ? source.length : next);
}

test("operator invite credentials stay behind server-only admin and service-role boundaries", () => {
  assert.match(inviteModule, /^import "server-only";/);
  assert.match(serviceModule, /^import "server-only";/);
  assert.match(serviceModule, /VERCEL_ENV/);
  assert.match(serviceModule, /KNOWN_PRODUCTION_PROJECT_REF/);
  assert.match(serviceModule, /OTHER_BALI_PREVIEW_SUPABASE_PROJECT_REF/);
  assert.match(anonModule, /VERCEL_ENV/);
  assert.match(anonModule, /KNOWN_PRODUCTION_PROJECT_REF/);
  assert.match(anonModule, /OTHER_BALI_PREVIEW_SUPABASE_PROJECT_REF/);
  assert.doesNotMatch(inviteModule, /anonClient/);
  for (const name of ["getInviteRoster", "getOrCreateOnboardToken"]) {
    const body = functionBody(inviteModule, name);
    assert.match(body, /await requireAdminRequest\(\)/);
    assert.match(body, /serviceClient\(\)/);
  }
  assert.doesNotMatch(dataModule, /function getInviteRoster/);
  assert.doesNotMatch(dataModule, /function getOrCreateOnboardToken/);
  assert.doesNotMatch(dataModule, /function setVenuePhoto/);
});

test("action confirmation delegates publication to the transactional database gate", () => {
  const body = functionBody(freshnessActions, "confirmAction");
  assert.match(body, /rpc\("publish_action_capability"/);
  assert.match(body, /\.from\("venue_action_capabilities"\)/);
  assert.match(body, /isPublishableActionTarget/);
  assert.doesNotMatch(body, /status:\s*["']confirmed["']/);
});

test("partner photo browser never uploads to storage or receives publication coordinates", () => {
  assert.doesNotMatch(photoClient, /browserClient|\.storage\.|getPublicUrl/);
  assert.match(photoClient, /fetch\("\/api\/onboard\/photo"/);
  assert.match(
    photoRoute,
    /NextResponse\.json\(\s*\{ ok: true, status: "pending_review" \}\s*,/,
  );
  assert.doesNotMatch(photoRoute, /getPublicUrl|createSignedUrl/);
  assert.match(photoRoute, /reserve_venue_photo_submission/);
});

test("partner release forms stay fail-closed until their private schema is ready", () => {
  assert.match(releaseReadiness, /^import "server-only";/);
  assert.match(releaseReadiness, /serviceClient\(\)/);
  assert.match(releaseReadiness, /maintenanceDrafts:\s*false/);
  assert.match(releaseReadiness, /photoSubmissions:\s*false/);
  assert.match(releaseReadiness, /\.from\("menus"\)/);
  assert.match(releaseReadiness, /\.from\("venue_action_capabilities"\)/);
  assert.match(releaseReadiness, /\.from\("venue_photo_submissions"\)/);
  assert.match(onboardPage, /getReleaseReadiness\(\)/);
  assert.match(photoClient, /photoSubmissionEnabled\s*\?/);
  assert.match(photoClient, /maintenanceDraftsEnabled\s*\?/);
});
