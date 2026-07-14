import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const route = await readFile(
  new URL("../app/api/onboard/photo/route.ts", import.meta.url),
  "utf8",
);
const reconciliation = await readFile(
  new URL("../lib/photo-submission-reconciliation.ts", import.meta.url),
  "utf8",
);

function conditionalBody(source, condition) {
  const start = source.indexOf(condition);
  assert.notEqual(start, -1, `missing conditional: ${condition}`);
  const open = source.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }
  assert.fail(`unterminated conditional: ${condition}`);
}

test("ambiguous upload errors defer physical Storage cleanup", () => {
  const body = conditionalBody(route, "if (uploadError)");
  assert.match(body, /requestUnconsentedPhotoCleanup\s*\(/);
  assert.match(body, /return processingResponse\(\)/);
  assert.doesNotMatch(body, /cleanUnconsentedPhoto\s*\(/);
  assert.doesNotMatch(body, /\.storage|\.remove\s*\(/);
});

test("inline cleanup cannot accept the ambiguous upload-failed reason", () => {
  assert.match(
    reconciliation,
    /type ExplicitPhotoCleanupReason = Exclude<PhotoCleanupReason, "upload_failed">/,
  );
  assert.match(
    reconciliation,
    /export async function requestUnconsentedPhotoCleanup[\s\S]*?request_venue_photo_cleanup/,
  );
});
