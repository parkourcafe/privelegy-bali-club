# Bali Massage & Spa — Harvest Report

Generated 2026-08-25T04:45:31+00:00 · Other Bali · source: Firecrawl multi-pattern discovery + own-site crawl

## Coverage

| | |
|---|---|
| Raw discovery hits | 525 + weak-area second pass |
| Unique venue domains after filtering | 208 |
| **Venues in the database** | **324** |
| VERIFIED | 161 |
| PARTIAL | 129 |
| REVIEW (needs a human) | 34 |
| Excluded with a recorded reason | 299 |
| Duplicates merged | 5 |

## Services

| | |
|---|---|
| **Total services extracted** | **5133** |
| Venues with structured services | 290 (90%) |
| Services with a price | 3129 (61%) |
| Services with a duration | 3357 (65%) |
| Venues with prices | 177 (55%) |

## Booking

| Provider | Venues |
|---|---|
| unknown | 140 |
| website_form | 115 |
| whatsapp | 41 |
| fresha | 14 |
| custom | 7 |
| zenoti | 5 |
| email | 1 |
| wetravel | 1 |

### Digital maturity

| Level | Venues | Share |
|---|---|---|
| direct booking | 218 | 67% |
| no online booking | 49 | 15% |
| WhatsApp only | 38 | 12% |
| full booking engine | 19 | 6% |

## Data quality

| Field | Coverage |
|---|---|
| Website | 100% |
| Phone | 52% |
| WhatsApp | 48% |
| Address | 61% |
| Opening hours | 51% |
| Booking URL | 73% |
| Structured services | 90% |
| Prices | 55% |
| ≥2 evidence sources | 93% |

## Geography

| Area | Venues |
|---|---|
| Ubud | 29 |
| Canggu | 17 |
| Uluwatu | 16 |
| Legian | 16 |
| Nusa Dua | 14 |
| Sanur | 13 |
| Pererenan | 11 |
| Seminyak | 10 |
| Jimbaran | 10 |
| Candidasa | 10 |
| Petitenget | 10 |
| Berawa | 9 |
| Lovina | 9 |
| Munduk | 9 |
| Sidemen | 9 |
| Gianyar | 8 |
| Kerobokan | 8 |
| Ungasan | 8 |
| Amed | 8 |
| Balangan | 7 |
| Benoa | 6 |
| Pecatu | 6 |
| Seseh | 6 |
| Tabanan | 6 |
| Kuta | 5 |
| Padangbai | 5 |
| Denpasar | 5 |
| Bedugul | 5 |
| Tegallalang | 4 |
| Umalas | 4 |
| Bingin | 4 |

## MVP readiness

| Flag | Venues |
|---|---|
| publish_ready | 324 |
| service_data_ready | 290 |
| price_data_ready | 177 |
| booking_ready | 159 |
| **merchant_opportunity** | **42** |

## What is NOT in this database, and why

- **No ratings or review counts.** Republishing review-derived data from Google,
  TripAdvisor or a booking platform breaches the project's hard guardrail and the
  platforms' terms. Venue pages link out to Google Maps instead, where the
  traveller reads the reviews at their source.
- **No coordinates.** Not published on most venue pages; inventing them is
  forbidden (§25), so the columns stay empty pending a licensed geocoding pass.
- Every excluded candidate is listed in `bali_spa_excluded.csv` with its reason,
  so a rerun does not repeat the same dead ends.
