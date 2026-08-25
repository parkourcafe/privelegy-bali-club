# Analytics Event Map - Other Bali SEO - 2026-08-25

## Measurement Goal

Connect SEO, Local SEO, and AI-search work to observable behavior without collecting personal data in client events.

## Primary Conversion Paths

| Path | Primary action | Event family | Notes |
|---|---|---|---|
| Traveller place discovery | Venue action click, save, add to trip | Existing bounded venue/action events | Keep slugs bounded; no raw PII. |
| Day planning | `/my-day` form interaction and downstream venue clicks | Planning/page events | Segment by page and option IDs only. |
| Partner acquisition | `/for-venues`, `/villas`, `/hotels`, `/list-your-property` leads | Guide lead / venue submission events | Track source page and partner type. |
| AI/search attribution | Referral, source capture, self-reported source where available | SourceCapture / server logs / CRM | Crawl activity is diagnostic, not outcome proof. |

## UTM Contract

Use stable UTM values for GBP, partner profiles, and editorial outreach:

| Parameter | Example | Rule |
|---|---|---|
| `utm_source` | `google_business_profile`, `partner_site`, `ai_search` | Lowercase source, no personal data. |
| `utm_medium` | `organic_local`, `referral`, `ai` | Channel class, not campaign claim. |
| `utm_campaign` | `bali_discovery_2026_q3` | Stable campaign name. |
| `utm_content` | `profile_website`, `villa_partner_page` | Link placement. |

## SEO/AI Scorecard

| Layer | Metric | Source | Current status |
|---|---|---|---|
| Technical | Indexable pages, canonical, robots, JSON-LD | SEO OS / local QA | Passing. |
| Local | GBP website clicks, calls, directions, bookings | GBP / GA4 connector | `UNKNOWN`, no account access. |
| Organic | GSC clicks/impressions by page/query | GSC | `UNKNOWN`, no current export in session. |
| AI visibility | Presence, citation rate, cited pages, message match | Controlled prompt panel | Baseline required. |
| Business | Qualified partner leads, venue actions, bookings handoff | GA4/CRM/server | Requires dashboard review. |

## AI Prompt Baseline Fields

| Field | Required value |
|---|---|
| Date and market | Bali, Indonesia; language recorded per run. |
| Platform | ChatGPT Search, Gemini/Google AI Mode, Perplexity, Claude/Copilot if available. |
| Prompt ID | Stable ID from prompt library. |
| Presence | Brand mentioned: yes/no. |
| Citation | Other Bali page cited: yes/no and URL. |
| Accuracy | Critical facts correct: yes/no/partial. |
| Message match | Connected to curated Bali guide/planning positioning: yes/no/partial. |
| Action | Fix fact, improve page, outreach to cited source, or no action. |

## Privacy Guardrails

- Do not send customer names, phone numbers, emails, payment data, or health data to prompt tools.
- Analytics events should use controlled IDs, not free-form user text.
- GBP/phone tracking must respect regional consent requirements.
