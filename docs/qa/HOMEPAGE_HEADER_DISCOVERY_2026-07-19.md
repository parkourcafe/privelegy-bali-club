# Homepage double-header discovery — 2026-07-19

## Reproduction

Deployment inspected:
`https://privelegy-bali-club-78nd16ey5-yulaboober.vercel.app/`

The defect is present after load, not only in the supplied screenshot.

- Desktop viewport: two visible `header` elements and two `OTHER BALI` logos.
- Mobile viewport (390 × 844): two visible `header` elements and two logos; the
  desktop links and mobile menu overlap.
- The first header is the root-layout `GlobalHeader`.
- The second header is the homepage `LandingNav`.
- Browser console: no reported error.

## Cause

`GlobalHeader` is rendered in the root layout and decides whether to hide from
the client-only `usePathname()` value. The homepage is statically rendered and
the application also has a Next.js Proxy. Next.js 16 documents that this
combination can make pathname-dependent initial markup differ from the browser
route. The server-visible fallback therefore includes the global inner-page
header while the homepage independently includes its own navigation.

## Fix boundary

The homepage root will expose a stable `data-page-shell="landing"` marker.
Global CSS will hide the root-layout header whenever that direct homepage shell
is present. This rule is available before first paint, does not wait for
hydration, and leaves the global header unchanged on inner pages.

The existing pathname check remains as a client-navigation optimization. A
boundary test will require both the page marker and the pre-hydration CSS rule.
