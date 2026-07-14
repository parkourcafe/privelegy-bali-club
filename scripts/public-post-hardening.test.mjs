import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

const routes = [
  ["app/api/list/route.ts", "MAX_LIST_BODY_BYTES", "parseSharedListRequest"],
  ["app/api/redeem/route.ts", "MAX_REDEEM_BODY_BYTES", "parseRedeemRequest"],
  ["app/api/save/route.ts", "MAX_SAVE_BODY_BYTES", "parseSavePlaceRequest"],
  ["app/api/onboard/confirm/route.ts", "MAX_CONFIRM_BODY_BYTES", "parseConfirmOnboardingRequest"],
  ["app/api/guide-lead/route.ts", "MAX_GUIDE_LEAD_BODY_BYTES", "parseGuideLeadRequest"],
  ["app/api/onboard/jtbd/route.ts", "MAX_JTBD_BODY_BYTES", "parseOnboardJtbdRequest"],
  ["app/api/onboard/draft/route.ts", "MAX_DRAFT_BODY_BYTES", "parseOnboardDraftRequest"],
];

test("remaining public JSON POST routes are byte-bounded and schema-gated", () => {
  for (const [path, limit, parser] of routes) {
    const source = read(path);
    assert.match(source, new RegExp(`readBoundedJson\\((?:req|request), ${limit}\\)`), path);
    assert.match(source, new RegExp(`${parser}\\(body\\.value\\)`), path);
    assert.match(source, /payload_too_large[\s\S]*413/, path);
    assert.match(source, /invalid_content_type[\s\S]*415/, path);
    assert.doesNotMatch(source, /(?:req|request)\.json\(\)/, path);
  }
});

test("public POST routes do not silently trim invalid arrays or overlong fields", () => {
  for (const [path] of routes) {
    const source = read(path);
    assert.doesNotMatch(source, /\.slice\(/, path);
    assert.doesNotMatch(source, /\.filter\(/, path);
    assert.doesNotMatch(source, /Boolean\((?:body|parsed)\./, path);
  }
});

test("share-all fallback cannot exceed the database list bound", () => {
  const source = read("app/api/list/route.ts");
  assert.match(source, /MAX_SHARED_LIST_VENUES = 50/);
  assert.match(source, /slugs\.length > MAX_SHARED_LIST_VENUES/);
  assert.match(source, /list_too_large/);
});

test("partner token mutations require the exact 0040 probe before writes", () => {
  const draft = read("app/api/onboard/draft/route.ts");
  const data = read("lib/data.ts");
  const draftProbe = draft.indexOf('rpc("release_readiness_v1")');
  assert.ok(draftProbe >= 0);
  assert.ok(draftProbe < draft.indexOf('rpc("create_partner_menu_draft"'));
  assert.ok(draftProbe < draft.indexOf('rpc("create_partner_action_draft"'));

  for (const mutation of ["confirm_onboarding", "set_venue_jtbd"]) {
    const mutationAt = data.indexOf(`rpc("${mutation}"`);
    assert.ok(mutationAt >= 0, `${mutation} must exist`);
    const probeAt = data.lastIndexOf('rpc("release_readiness_v1")', mutationAt);
    assert.ok(probeAt >= 0 && probeAt < mutationAt, `${mutation} must follow the exact 0040 probe`);
  }
  assert.match(data, /exactReleaseSchemaProbe\(schema\.data, 1, "0040"\)/);
});
