# Other Bali Deep Districts: 3-Day Plan

Date: 2026-07-11  
Scope: make the five non-Canggu planning districts editorial-deep without
turning on QR, perks, TablePilot, tourist payments, or paid ranking.

## Definition

For this sprint, `deep` means editorial depth:

- a curated district set, not a raw directory;
- safe public JTBD tags, vibe tags, price band, and signature items where known;
- district-specific gaps and verification queue;
- public copy that helps a guest choose by moment;
- no review quotes, ratings, complaints, red flags, confidence notes, or internal
  QA text on the public site.

Money-deep remains Canggu only.

## Source Files

- `OZO_BaliWali_district_longlist_5districts_v0.2.csv`
- `raw_otherbali_longlist_master_5districts_v0.2.csv`
- `raw_otherbali_verify_queue_v0.2.csv`
- `raw_otherbali_gaps_handoffs_v0.2.csv`

The source has 88 venue rows:

- Jimbaran: 16
- Seminyak: 17
- Uluwatu/Bukit: 22
- Nusa Dua: 13
- Sanur: 20

Migration `0016_deepen_five_district_planning.sql` scans those 88 rows and
applies 74 public-safe enrichment updates. The remaining rows stay published as
bare planning cards until field/editorial data is available.

## District Anchors

Jimbaran:
Cuca Restaurant, Sundara, Balique Restaurant, DAVA Steak & Seafood, Bella Cucina.

Seminyak:
Merah Putih, Mauri Restaurant, Waroeng Bernadette, Warung Nia, Boy'N'Cow.

Uluwatu/Bukit:
Gooseberry French Restaurant, Suka Espresso, Mana Uluwatu, El Kabron, Sundays
Beach Club.

Nusa Dua:
Kayuputi, Koral, Izakaya by OKU, Soleil at Mulia, Tetaring.

Sanur:
Massimo, Soul on the Beach, Warung Little Bird, Genius Cafe, Gong Restaurant.

## Known Gaps

Seminyak:
weak quiet-work layer; sunset is mostly reputation-led rather than broad.

Jimbaran:
weak quiet-work and brunch layer; best framed as dinner near airport, seafood,
special occasions, and resort-adjacent evenings.

Uluwatu/Bukit:
strong sunset, brunch, and date-night layer; weak calm local food and easy
first-night dinner.

Nusa Dua:
weak quiet-work, brunch, standalone bars, and warung layer; strong resort dining,
family, and special occasion layer.

Sanur:
do not force sunset-drinks positioning. It is structurally a sunrise/easy-day
district with a thinner bar layer.

## Three-Day Execution

Day 1: Data QA

- Apply migrations 0015 and 0016 in production Supabase.
- Verify /places shows all 221 venues.
- For the 5 districts, spot-check Google Maps links and category/district
  assignment.
- Prioritize the verify queue from `raw_otherbali_verify_queue_v0.2.csv`.

Day 2: Editorial depth

- Add district mode copy: who this district is for, best moments, and known gaps.
- Create featured district sections using the anchors above.
- Keep each public sentence fit-based, not review-based.
- Prepare first district routes or scenarios: breakfast, quiet work, family day,
  sunset, date night, local food.

Day 3: Public experience

- Turn /places from a flat catalogue into a district-led experience.
- Add district-specific filters or sections for best moment and vibe.
- Verify mobile layout and text fit.
- Run lint/build and redeploy.

## Guardrails

- No perks unless a venue confirms them.
- No QR outside Canggu.
- No TablePilot monetization outside active-deep Canggu.
- No paid ranking.
- No AI/chatbot surface.
- No Google review text or complaint summaries in public UI.
