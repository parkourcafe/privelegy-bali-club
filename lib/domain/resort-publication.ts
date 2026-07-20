// Operator publish whitelist for the resort vertical (IA spec v1 §10.3:
// "публиковать только вручную whitelisted category × district combinations";
// Phase 3: "import verified Nusa Dua data только после operator review").
//
// An imported property/venue/offer becomes PUBLIC (indexable, in the sitemap,
// linked from the menu) only when its slug is listed here AND it passes the
// §13 publication gate. This set is the single manual gate the founder/operator
// controls — nothing the deterministic importer produces is ever auto-public.
//
// It is intentionally EMPTY: the Nusa Dua research rows carry Russian editorial
// notes and many have no confirmed English decision copy yet, so none may go
// public until an operator writes/approves English content and confirms the
// facts. Add slugs here (offer slug, hotel-restaurant venue slug) as each is
// reviewed. Owner-preview (audienceMode=owner_prelaunch, noindex) shows the
// review rows to the founder in the meantime.
export const RESORT_PUBLISH_WHITELIST = new Set<string>([
  // e.g. "the-mulia-bali--soleil-sunday-brunch",  ← after operator review
]);
