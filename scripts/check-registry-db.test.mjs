import test from "node:test";
import assert from "node:assert/strict";
import {
  parsePublishedSlugs,
  publishedRegistrySlugs,
  findMissing,
} from "./check-registry-db.mjs";

test("parsePublishedSlugs pairs each published marker with its slug", () => {
  // Mirrors the real registry layout: slug on its own line, publication later
  // in the same object.
  const src = [
    "  {",
    "    slug: \"alpha\",",
    "    category: \"bar\",",
    "    publication: \"published\",",
    "  },",
    "  {",
    "    slug: \"bravo\",",
    "    publication: \"review\",", // excluded
    "  },",
    "  {",
    "    slug: \"charlie\",",
    "    publication: \"published\",",
    "  },",
  ].join("\n");
  assert.deepEqual(parsePublishedSlugs(src).sort(), ["alpha", "charlie"]);
});

test("parsePublishedSlugs ignores the type-definition line (no preceding slug)", () => {
  const src = [
    "  publication: \"published\" | \"review\";", // the interface field, no slug before it
    "  {",
    "    slug: \"real\",",
    "    publication: \"published\",",
    "  },",
  ].join("\n");
  assert.deepEqual(parsePublishedSlugs(src), ["real"]);
});

test("the real registry has a non-trivial published set", () => {
  const slugs = publishedRegistrySlugs();
  assert.ok(slugs.length >= 20, `expected many published venues, got ${slugs.length}`);
  assert.ok(slugs.includes("single-fin"), "known published venue present");
  assert.equal(slugs.length, new Set(slugs).size, "no duplicate slugs");
});

test("findMissing flags registry-published venues absent from the DB", () => {
  // This is the drift that must fail the build (the /uluwatu silent-404 cause).
  const missing = findMissing(["a", "b", "c"], new Set(["a", "c"]));
  assert.deepEqual(missing, ["b"]);
});

test("findMissing passes when every published venue is active+published", () => {
  assert.deepEqual(findMissing(["a", "b"], new Set(["a", "b", "extra"])), []);
});
