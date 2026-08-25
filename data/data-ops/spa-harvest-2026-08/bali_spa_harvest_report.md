# Bali Massage & Spa — Harvest Report

Generated 2026-08-25T01:39:11+00:00 · Other Bali · source: Firecrawl multi-pattern discovery + own-site crawl

## Coverage

| | |
|---|---|
| Raw discovery hits | 525 + weak-area second pass |
| Unique venue domains after filtering | 208 |
| **Venues in the database** | **250** |
| VERIFIED | 124 |
| PARTIAL | 99 |
| REVIEW (needs a human) | 27 |
| Excluded with a recorded reason | 171 |
| Duplicates merged | 5 |

## Services

| | |
|---|---|
| **Total services extracted** | **4032** |
| Venues with structured services | 223 (89%) |
| Services with a price | 2391 (59%) |
| Services with a duration | 2619 (65%) |
| Venues with prices | 136 (54%) |

## Booking

| Provider | Venues |
|---|---|
| unknown | 109 |
| website_form | 87 |
| whatsapp | 33 |
| fresha | 12 |
| zenoti | 4 |
| custom | 3 |
| email | 1 |
| wetravel | 1 |

### Digital maturity

| Level | Venues | Share |
|---|---|---|
| direct booking | 171 | 68% |
| no online booking | 37 | 15% |
| WhatsApp only | 26 | 10% |
| full booking engine | 16 | 6% |

## Data quality

| Field | Coverage |
|---|---|
| Website | 100% |
| Phone | 52% |
| WhatsApp | 49% |
| Address | 60% |
| Opening hours | 53% |
| Booking URL | 75% |
| Structured services | 89% |
| Prices | 54% |
| ≥2 evidence sources | 92% |

## Geography

| Area | Venues |
|---|---|
| priority5 | 54 |
| Nusa Dua | 14 |
| Legian | 13 |
| Ubud | 12 |
| Uluwatu | 11 |
| Canggu | 10 |
| Jimbaran | 10 |
| Candidasa | 10 |
| Pererenan | 9 |
| Seminyak | 9 |
| Lovina | 9 |
| Munduk | 9 |
| Sidemen | 9 |
| Gianyar | 8 |
| Amed | 8 |
| Berawa | 7 |
| Sanur | 7 |
| Kerobokan | 6 |
| Benoa | 6 |
| Seseh | 6 |
| Kuta | 5 |
| Padangbai | 5 |
| Denpasar | 5 |
| Bedugul | 5 |
| Pecatu | 4 |
| Ungasan | 4 |
| Petitenget | 4 |
| Tabanan | 4 |
| Tegallalang | 3 |

## MVP readiness

| Flag | Venues |
|---|---|
| publish_ready | 250 |
| service_data_ready | 223 |
| price_data_ready | 136 |
| booking_ready | 124 |
| **merchant_opportunity** | **27** |

## What is NOT in this database, and why

- **No ratings or review counts.** Republishing review-derived data from Google,
  TripAdvisor or a booking platform breaches the project's hard guardrail and the
  platforms' terms. Venue pages link out to Google Maps instead, where the
  traveller reads the reviews at their source.
- **No coordinates.** Not published on most venue pages; inventing them is
  forbidden (§25), so the columns stay empty pending a licensed geocoding pass.
- Every excluded candidate is listed in `bali_spa_excluded.csv` with its reason,
  so a rerun does not repeat the same dead ends.
