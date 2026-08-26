# Venues whose `official_url` is not their own site (found 2026-08-26)

Surfaced as a side effect of the photo backfill: the "is this page actually this
venue" guard refused to publish a photo for these rows, because the page the
`official_url` points at does not name the venue at all.

**This is not a photo problem.** `official_url` is what the "Website" button on a
public venue page opens. Every row below currently sends a tourist to a news
portal, a booking aggregator, a travel blog, or an unrelated business.

Verified by fetching each URL and reading its `<title>` / `og:site_name` — not
inferred from the domain name.

| Venue (slug) | `official_url` | What that site actually is |
|---|---|---|
| `pengosekan-spa-hotels-ubud` | `survivorsofsuicide.com` | unrelated organisation |
| `the-sanctoo-spa-wellness-ubud` | `detik.com` | Indonesian news portal |
| `2-aces-massage-and-spa-seminyak` | `corner.inc` | unrelated app/company |
| `bali-relaxing-resort-spa-nusa-dua` | `trivago.ae` | hotel price aggregator |
| `anantara-ubud-bali-resort-ubud` | `balidaylight.com` | travel blog |
| `fresh-spa-ubud` | `mitziemee.com` | personal travel blog |
| `alaya-ubud-ubud` | `dalaspa.com` | a different business |
| `aaron-spa-denpasar` | `balispaguide.com` | third-party directory |
| `bamboo-spa-at-munduk-moding-plantation-nature-re-munduk` | `gowabi.com` | Thai booking platform |
| `the-shisha-house-seminyak` | `sites.google.com` | bare Google Sites host |
| `the-wellness-spa-uluwatu-bukit` | `secure-booker.com` | booking widget host |
| `bali-tao-center-ubud` | `smartscheduling.com` | scheduling SaaS |
| `earthbound-lovina` | `weekendnotes.com` | listings blog |
| `parina-spa-ubud-ubud` | `activities.marriott.com` | generic activities portal |
| `luxury-spa-nusa-dua` | `kempinski.com` | chain root, not this property |
| `mim-spa-nusa-dua` | `melia.com` | chain root, not this property |
| `ortus-wellness-seminyak` | `hyatt.com` | chain root, not this property |
| `four-seasons-spa-ubud` | `fourseasons.com` | chain root, not this property |
| `shankha-spa-and-fitness-at-hyatt-regency-bali` | `https://www.hyatt.com/` | chain root, not this property |
| `shankha-spa-hyatt-regency-bali-yoga` | `https://www.hyatt.com/` | chain root, not this property |
| `banyan-tree-spa-macau-ubud` | `banyantree.com` | chain root; the row's own name says Macau |
| `melons-nusa-dua` | `lifestyleretreats.com` | operator group, not the venue |
| `manori-spa-canggu` | `imanivillas.com` | different property |
| `luhur-spa-uluwatu-bukit` | `bluepointresortandspa.com` | host resort, not the spa |
| `jaya-spa-karangasem` | `puribaguscandidasa.com` | host resort, not the spa |
| `the-laneway-restaurant-seminyak` | `peppersseminyak.com` | host hotel, not the restaurant |
| `spa-bali-seminyak` | `spabali.co.id` | did not identify as this venue |
| `trac-rental-jimbaran` | `trac.astra.co.id` | national corporate site, not this branch |
| `royal-kirana-spa-ubud` | `royalkirana.reserveonline.id` | booking widget subdomain |

Two distinct severities here, and they want different fixes:

**Plainly wrong — clear the field.** The news portal, the unrelated app, the
aggregator, the blogs, the SaaS hosts. An empty `official_url` is honest; a link
to `detik.com` on a spa page is not. Clearing is safe and reversible.

**Too broad rather than wrong — replace with the deep link.** The hotel-chain
roots (`hyatt.com`, `fourseasons.com`, `melia.com`, `kempinski.com`) and the
host-property cases. The venue is real and the company is right, but the URL
does not land on it. These need the specific property/facility page.

Not acted on yet — clearing or rewriting `official_url` changes what a public
page does, which is a content decision rather than a backfill side effect.
