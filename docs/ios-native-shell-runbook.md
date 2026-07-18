# iOS native shell — runbook (App Store 4.2 blocker)

Goal: turn the current Capacitor **remote-WebView wrapper** into an app Apple
will accept under **Guideline 4.2 (Minimum Functionality)** — i.e. one that does
meaningfully more than "the website in a shell." This is the biggest remaining
launch blocker (audit 2026-07 scored native value 22/100).

This is a multi-week effort that needs Xcode + a physical device + an Apple
Developer account — it can't be built or verified in a headless session. This
doc is the plan a founder or an Xcode-equipped coding session executes. Each
workstream is PR-sized with explicit **acceptance criteria**.

---

## 0. The core architectural decision (read first)

The web app is **Next 16 App Router + SSR + Supabase**. That matters because:

- You **cannot** `next export` it to a fully static bundle and ship that offline
  — the tourist surfaces are `force-dynamic`, read Supabase server-side, and
  render per request. A "bundle the whole site locally" plan will not work.
- So the realistic strategy is **hybrid**, not a full native rewrite:

> **Keep Capacitor.** Keep loading rich *content* pages from the server. But add
> genuine **native capability + local persistence** that a website cannot do,
> and make the app usable when the network is bad. That combination — native
> map, offline-saved routes, share sheet, deep links, real error/offline states
> — is what clears 4.2, even though article content still streams from the web.

Three options considered:

| Option | Verdict |
|---|---|
| A. Full native (SwiftUI) rewrite | ❌ Months; throws away the web app; not warranted |
| B. Static-export the site into the bundle | ❌ Breaks SSR/Supabase; tourist pages are dynamic |
| **C. Hybrid: WebView content + native shell/features** | ✅ **Recommended** — realistic, keeps one codebase, clears 4.2 |

Everything below implements **Option C**.

Reviewer framing to hold onto: the app is a **Bali trip companion that saves your
routes for offline and navigates them on a native map** — not "a browser for
otherbali.com." Every workstream should push toward that sentence being true.

---

## W0 — Toolchain + project hygiene (prerequisite)

Fixes the audit's stale-project findings and unblocks submission. Small, do first.

- [ ] Open in **Xcode 26** (App Store Connect requires builds from Xcode 26 /
      iOS 26 SDK as of 2026-04-28). Apply "recommended project settings."
- [ ] `ios/App/App/Info.plist`: remove obsolete **`armv7`** from
      `UIRequiredDeviceCapabilities`; re-evaluate **`UIDesignRequiresCompatibility`**
      (drop unless a specific reason remains).
- [ ] Decide **iPad**: either commit to it (do a real iPad QA pass, W7) or set the
      target to iPhone-only. Don't ship a stretched-phone iPad build (quality
      rejection risk). Current plist declares iPad orientations — reconcile.
- [ ] Set a sane **deployment target** (iOS 15+ is fine) and bump
      `CFBundleShortVersionString` / build number for TestFlight.
- [ ] **App icon**: verify the 1024² renders cleanly at 60² (no thin detail, no
      transparency, no text-turns-to-mush); add dark/tinted variants.
- [ ] **Launch screen**: minimal native launch that visually continues into the
      first app screen (no 5-second logo ceremony).
- [ ] Confirm `capacitor.config.ts` `loggingBehavior: "none"` (already done) and
      that Release has no debug logging.

**Acceptance:** clean archive validates in Xcode 26; no obsolete-arch warnings;
icon passes the icon preview in all system contexts.

---

## W1 — Local app shell (stop being a pure remote WebView)

The single most important 4.2 change: the app must **boot into locally-bundled
UI**, not a blank WebView pointed at a URL.

- [ ] **Remove `server.url` from the Release config.** Keep it for dev only:
      ```ts
      // capacitor.config.ts
      server: process.env.CAP_DEV ? { url: "https://www.otherbali.com" } : undefined,
      ```
      Release loads the local `webDir` bundle instead of the live site.
- [ ] Replace the `ios-web/` stub with a **real bundled shell**: a local
      `index.html` app that renders native-feeling **tab navigation** (Home /
      Plan / Saved / Map), **loading skeletons**, and **error + offline states** —
      all from the bundle, so first paint never depends on the network.
- [ ] Content strategy: the shell owns navigation + the offline-capable surfaces
      (Saved, Map, last-viewed). Rich editorial/venue pages load **into** the
      shell from the server (in-app), with a proper offline fallback when they
      can't. This is the hybrid boundary.
- [ ] Keep the httpOnly `bp_guest` model working in-WebView (no localStorage —
      guardrail #10). Native persistence (W2) is a separate local cache.

**Acceptance:** airplane mode → cold launch → you still get the branded shell,
tab nav, and any saved content; you never see a blank WebView or a raw browser
error. Reviewer can operate the app with no network for the saved/plan surfaces.

---

## W2 — Saved places & routes, offline

Native persistence is a capability a bookmarked website doesn't have — core to 4.2.

- [ ] Add **`@capacitor/preferences`** (small key-value) or SQLite for larger
      sets. Mirror the web's `saved_places` / route data into a **local cache**
      keyed by the same slugs.
- [ ] "Save" on a venue/route writes locally **and** (when online) syncs to the
      existing `saved_places` RPC via the WebView session. Offline saves queue
      and flush on reconnect.
- [ ] A **Saved** tab renders from the local cache — works fully offline, shows a
      "last updated" timestamp.

**Acceptance:** save a route online → airplane mode → reopen app → the saved
route + its stops are fully readable offline.

---

## W3 — Native map for routes (MapKit)

A real map with the route line is the clearest "more than a website" signal.

- [ ] Add a map: **MapKit** via a thin custom Capacitor plugin, or a maintained
      community map plugin. MapKit needs no API key and is the native choice.
- [ ] Render each route's **stops as pins + a polyline**, show **travel time**
      between stops (MapKit directions), the **start point**, and total duration.
- [ ] Actions per stop: **Open in Maps** (native handoff), **replace/reorder
      stop**, **save** (W2).
- [ ] Feed the map from the route model already in the web app
      (`getRoute` → stops with `gmapsUrl`, category, name). Expose that data to
      native either via a small JSON endpoint the shell fetches once and caches,
      or via the bundled route data.

**Acceptance:** open a saved route → native map shows the ordered stops + line +
per-leg travel time; tapping a stop opens Apple Maps; the map renders offline for
a previously-loaded route (cached region acceptable).

---

## W4 — Platform integration (share + deep links)

- [ ] **`@capacitor/share`** — native share sheet for a place/route (replaces any
      web share hack).
- [ ] **Universal Links**: add the **Associated Domains** entitlement
      (`applinks:www.otherbali.com`) and host
      `/.well-known/apple-app-site-association` (served by the Next app, correct
      JSON, `application/json`, no redirect). Opening an `otherbali.com/route/…`
      link launches the app to that route.
- [ ] **`@capacitor/app`** — handle the incoming universal-link URL and route the
      shell to the right screen.

**Acceptance:** tap an `https://www.otherbali.com/route/<slug>` link on-device →
the app opens to that route (not Safari); share sheet posts a working link.

---

## W5 — Booking works without WhatsApp

Apple requires the core flow to work without a second app installed.

- [ ] Before handoff, collect **date / time / party size** in a native-feeling
      form (already partly in the web flow — surface it in-shell).
- [ ] Use **`@capacitor/app` `canOpenUrl`** (AppLauncher) to detect WhatsApp; if
      absent, fall back to a **web reservation / official link** the reviewer can
      complete. Never make WhatsApp the only path.
- [ ] Use Capacitor Browser/AppLauncher for external opens — not a bare
      `window.open(_blank)`.
- [ ] Don't render "Book" / "Available" as if confirmed; after return, ask "Did
      you get a table?" and treat the answer as *user status only* (Other Bali
      does not confirm venues — say so in review notes).

**Acceptance:** on a device **without** WhatsApp, the reviewer can still complete
a reservation handoff via the web fallback.

---

## W6 — Release hygiene

- [ ] Release build loads **only** the bundle + production `www.otherbali.com`
      content — **no dependency on a Vercel preview deploy**. Pin the content
      origin.
- [ ] Debug logging off in Release (done: `loggingBehavior: "none"`).
- [ ] Crash-free on the device matrix (W7).
- [ ] Verify the `PrivacyInfo.xcprivacy` + App Store privacy labels against
      **`docs/data-inventory-2026-07.md`** (that's what it's for). With GA off,
      `NSPrivacyTracking=false` is correct; declare Identifiers / Usage Data /
      Contact-Info(lead form) per that doc — confirm with legal.

---

## W7 — Submission package

- [ ] **TestFlight** first (Apple says betas belong on TestFlight, not the Store).
- [ ] **Device matrix**: iPhone SE-class, standard iPhone, Pro Max, + iPad *iff*
      you kept iPad (W0). Accessibility pass: **VoiceOver, Dynamic Type, 200%
      zoom, reduced-motion, Switch Control** (audit flagged these unverified).
- [ ] **Screenshots** must show the app *in use*: (1) build-a-day, (2) the "why
      this place" rationale, (3) the native route map, (4) a venue detail, (5) a
      saved/offline route. **Not** a splash/logo or a mockup of features that
      don't exist (2.3 metadata risk).
- [ ] **Review notes**: no login required; how to build a route; how to open the
      map; how to view a saved route **offline**; that **WhatsApp is optional**;
      that Other Bali does not confirm venues; where the **privacy controls** are
      (`/privacy/choices`). Point Apple at the live review page
      **`https://www.otherbali.com/review`** (not the `review.` subdomain). If you
      want it private, set `REVIEW_ACCESS_TOKEN` and include the password.
- [ ] App Store Connect: name, subtitle, description (match the real core
      experience), keywords, category, age rating, **privacy labels + URL**,
      support/marketing URL (`https://www.otherbali.com/...`), copyright,
      **export compliance**, **DSA trader status**, reviewer contact.

**Acceptance:** clean archive from Xcode 26 → TestFlight build with no blocker
defects → all of the above filled → submit.

---

## Sequencing & dependencies

```
W0 (hygiene) ─┬─> W1 (local shell) ─┬─> W2 (offline saves) ─┬─> W7 (submit)
              │                     ├─> W3 (MapKit route)  ─┤
              │                     ├─> W4 (share + links)  ─┤
              │                     └─> W5 (WhatsApp-opt)   ─┤
              └─> W6 (release hygiene) ─────────────────────┘
```

W1 is the keystone — everything native hangs off the local shell existing. The
4.2-minimum set is **W0 + W1 + W2 + W3** (local shell + offline saved routes +
native map). W4/W5 harden the case; W6/W7 ship it.

## Plugins to add (all first-party Capacitor unless noted)

`@capacitor/preferences` (or SQLite), `@capacitor/share`, `@capacitor/app`
(links + AppLauncher), a **MapKit** bridge (thin custom plugin or a maintained
community map plugin), optionally `@capacitor/geolocation` (only if you add
"near me" — request permission **on user action**, per the Permissions-Policy
posture).

## References

- `docs/audit-2026-07.md` — the audit + everything already fixed (items 1–12).
- `docs/data-inventory-2026-07.md` — fills the privacy labels + manifest (W6).
- `capacitor.config.ts`, `ios/App/App/Info.plist` — current wrapper + project.
- Guardrails still apply in-app: no internal booking engine (#3), no monetization
  outside the active deep district (#4), no tourist payments (#5).
