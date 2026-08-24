import assert from "node:assert/strict";
import test from "node:test";
import { GUIDES, GUIDE_GROUPS } from "./guides";

// /guides renders only what GUIDE_GROUPS lists, and app/guides/page.tsx
// drops unknown slugs silently via .filter(Boolean). Both failure modes are
// invisible on the page, so this suite is the only thing that notices:
// a guide missing from every group is an orphan (published, in the sitemap,
// linked from nowhere), and a group slug with no registry entry is a card
// that silently vanishes.

test("every guide belongs to at least one /guides group", () => {
  const grouped = new Set(GUIDE_GROUPS.flatMap((group) => group.slugs));
  const orphans = GUIDES.map((guide) => guide.slug).filter((slug) => !grouped.has(slug));
  assert.deepEqual(orphans, []);
});

test("every group slug resolves to a registered guide", () => {
  const known = new Set(GUIDES.map((guide) => guide.slug));
  const ghosts = GUIDE_GROUPS.flatMap((group) => group.slugs).filter((slug) => !known.has(slug));
  assert.deepEqual(ghosts, []);
});
