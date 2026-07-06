import type { Venue } from "./types";

// "Similar places" ranking — the fallback surface (backlog #4). No AI
// (guardrail #2): similarity is verified vibe tags + category only, the same
// signals the filters already use. Same-district only, which keeps the fallback
// inside the active deep district so its reserve CTAs never monetize a
// planning_only district (guardrail #4).
//
// Score: same category is the strong signal (+3); each shared verified vibe tag
// adds +1. A candidate with score 0 (different category, no shared tag) is not
// "similar" and is dropped — better to show nothing than a random venue.
export function rankSimilar<T extends Venue>(target: T, candidates: T[], limit = 3): T[] {
  const targetTags = new Set(target.vibeTags ?? []);
  return candidates
    .filter((c) => c.slug !== target.slug && c.district === target.district)
    .map((c) => {
      let score = c.category === target.category ? 3 : 0;
      for (const tag of c.vibeTags ?? []) if (targetTags.has(tag)) score += 1;
      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.c.name.localeCompare(b.c.name))
    .slice(0, limit)
    .map((x) => x.c);
}
