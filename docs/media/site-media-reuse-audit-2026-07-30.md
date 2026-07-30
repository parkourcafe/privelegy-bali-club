# Other Bali media reuse audit — 2026-07-30

## Findings

- Three pairs of Higgfield scene files were byte-identical: first-day,
  rainy-day and sunset route aliases of homepage scenes.
- The Canggu “Now” grid reused the same four images as the following Top Picks
  sections, making different decisions look visually identical.
- Canggu related-guide media reused the first-day scene for two different links;
  the day-builder CTA also reused the Canggu food scene.

## First remediation wave

- Route cards now use separate reviewed Higgfield stills for first-day,
  Canggu-rain and sunset-run instead of homepage aliases.
- Canggu Now cards use distinct scene assignments. The remote-work card is
  deliberately text-led rather than showing an unrelated generic photograph.
- The Canggu first-day related card uses its own scene assignment.
- These scenes remain atmospheric/illustrative and are not venue proof, live
  conditions or availability claims.

## Final reconciliation

- The remaining Canggu guide assignments now use distinct approved Higgfield
  scenes where an image adds meaning (restaurant, café and sunset comparisons).
- The Canggu day-builder and first-day related links are text-led where the
  existing image would repeat a scene already visible on the page.
- The coffee guide is also text-led rather than reusing the work-café scene.
- A final source scan found no repeated still-image reference within a page,
  no still-image reference shared by two page source files, and no two
  referenced scene files with identical bytes. Shared video fallbacks in the
  media component are intentional player defaults, not duplicate page cards.

No new Higgfield generation was required for this audit wave; all replacements
use approved assets already present in `public/scenes`.
