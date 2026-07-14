# Canggu batch 04a — operator review

Status: ready for operator review; not ready for import dry-run; forbidden to publish.

This checkpoint covers four branch-matched venues: `nude-berawa`,
`riviera-bistro-berawa`, `riviera-cafe-cemagi`, and
`riviera-trattoria-pererenan`.

- Nüde's official website links a Berawa-specific Google Drive menu folder, but
  the asset did not expose reliable item text in this run. It is classified
  `official_menu_found`, not parsed and not padded from image previews.
- Riviera Bistro has a current, branch-specific July 2026 menu. Eight lunch
  items were transcribed; its stated `000 IDR` scale permits safe IDR
  normalization. The rest of lunch and dinner remain unparsed.
- Riviera Cafe and Riviera Trattoria each link current official PDFs, but those
  PDF fetches failed. Only exact dish names/descriptions visible on their
  venue-controlled branch pages were retained, without inferred prices.
- The three Riviera records use separate branch pages and actions: Berawa
  Bistro, Cemagi Cafe, and Pererenan Trattoria. No cross-branch menu or booking
  destination was reused.

All records remain draft-only with `verifiedAt: null`, no media, and
`publicationAllowed: false`. Operator review should retry the blocked PDF/menu
assets and compare every action destination before any future import dry-run.
