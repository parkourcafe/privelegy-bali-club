import assert from "node:assert/strict";
import test from "node:test";
import { clipMetaDescription, META_DESCRIPTION_MAX } from "./meta-description";

test("returns short descriptions unchanged", () => {
  assert.equal(clipMetaDescription("A quiet warung near the beach."), "A quiet warung near the beach.");
});

test("collapses whitespace before measuring", () => {
  assert.equal(clipMetaDescription("  A  quiet\nwarung  "), "A quiet warung");
});

test("keeps a description of exactly the limit intact", () => {
  const exact = "a".repeat(META_DESCRIPTION_MAX);
  assert.equal(clipMetaDescription(exact), exact);
});

test("cuts long descriptions at a word boundary, never mid-word", () => {
  const words = "Nasi campur and grilled fish served on a shaded terrace above the rice fields";
  const long = `${words}, ${words}, ${words}.`;
  const out = clipMetaDescription(long);

  assert.ok(out.length <= META_DESCRIPTION_MAX, `length ${out.length}`);
  assert.ok(out.endsWith("…"));
  const body = out.slice(0, -1);
  // Every word kept must be a whole word of the source text.
  assert.ok(long.startsWith(body), "clipped text is a prefix of the source");
  assert.equal(long[body.length], " ", "the cut lands on a space, not inside a word");
});

test("does not leave dangling punctuation before the ellipsis", () => {
  const long = `${"word ".repeat(30)}fish, — and more words to push past the limit easily here`;
  const out = clipMetaDescription(long, 160);
  assert.doesNotMatch(out, /[,—\s]…$/u);
});

test("hard-cuts a single oversized word instead of returning nothing", () => {
  const out = clipMetaDescription("x".repeat(300));
  assert.equal(out.length, META_DESCRIPTION_MAX);
  assert.ok(out.endsWith("…"));
});
