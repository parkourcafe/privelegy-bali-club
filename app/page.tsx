import Link from "next/link";
import { getCangguPlan, getRoutes } from "@/lib/data";
import PlanView from "./PlanView";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import MobileStickyCTA from "@/components/MobileStickyCTA";

export const dynamic = "force-dynamic";

const SCENES = ["scene-a", "scene-b", "scene-c"];

export default async function Home() {
  const [plan, routes] = await Promise.all([getCangguPlan(), getRoutes()]);
  const heroRoute = routes[0];

  return (
    <>
      <SiteHeader />

      {/* ============ HERO ============ */}
      <section id="hero" className="hero-cinema on-dark">
        <div className="site-shell hero-inner">
          <div>
            <p className="hero-eyebrow">Other Bali · Canggu</p>
            <h1 className="hero-h1 display-1">
              The right place for the moment you&apos;re in.
            </h1>
            <p className="hero-sub">
              A free, human-curated guide to Canggu. Every place visited by us
              — tagged by vibe, priced honestly, mapped from first coffee to
              last table. With venue offers you redeem right at the counter.
            </p>
            <div className="hero-cta-row">
              <a href="#guide" className="button-primary button-large">
                Plan my day
              </a>
              <a href="#routes" className="button-ghost-dark button-large">
                Ready-made routes
              </a>
            </div>
            <p className="hero-trust">
              Free for travellers. No signup, no card. Venues pay us only when
              a table reserved through us is actually seated — never for
              placement, never from you.
            </p>
          </div>

          {heroRoute && (
            <Link href={`/route/${heroRoute.slug}`} className="hero-card">
              <p className="hero-card-label">Start here</p>
              <p className="hero-card-title">{heroRoute.title}</p>
              <p className="hero-card-meta">
                {heroRoute.subtitle ? `${heroRoute.subtitle} · ` : ""}
                {heroRoute.stopCount} stops, morning to night
              </p>
              <span className="hero-card-cta">Follow the route →</span>
            </Link>
          )}
        </div>
        <p className="hero-scroll-hint" aria-hidden="true">
          Scroll
        </p>
      </section>

      <main>
        {/* ============ CHAOS → ORDER ============ */}
        <section className="section" id="why">
          <div className="site-shell">
            <Reveal className="section-head">
              <p className="topline">The old way</p>
              <h2 className="section-title display-2">
                Forty open tabs is not a plan.
              </h2>
              <p className="section-lede">
                Star ratings averaged over five years. Listicles written from
                other listicles. A group chat that says &ldquo;trust me.&rdquo;
                You&apos;re on a scooter with twenty minutes of patience — you
                don&apos;t need more options, you need one good answer.
              </p>
            </Reveal>
            <div className="chaos-grid">
              <Reveal>
                <div className="chaos-stack" aria-label="Illustration: the noise of researching places the usual way">
                  <div className="chaos-chip">
                    <strong>★ 4.6 (2,140)</strong> — half the reviews are from
                    two years ago
                  </div>
                  <div className="chaos-chip">
                    <strong>&ldquo;Top 25 cafés in Canggu&rdquo;</strong> — all
                    25, apparently
                  </div>
                  <div className="chaos-chip">
                    <strong>Group chat:</strong> &ldquo;the place near the
                    thing, you know it&rdquo;
                  </div>
                  <div className="chaos-chip">
                    <strong>Saved posts:</strong> 73. Visited: 0.
                  </div>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <div className="order-card">
                  <p className="order-card-time">Instead — one answer per moment</p>
                  <p className="order-card-title">
                    It&apos;s 7 pm. You want quiet, woodfire, walk-in.
                  </p>
                  <p className="order-card-line">
                    One place, picked by someone who ate there this season.
                  </p>
                  <p className="order-card-line">
                    What to order, what it costs, how to get there.
                  </p>
                  <p className="order-card-line">
                    Bad options aren&apos;t warned about — they simply
                    aren&apos;t here.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ MECHANISM / HOW IT WORKS ============ */}
        <section className="section section-dark on-dark" id="how">
          <div className="site-shell">
            <Reveal className="section-head">
              <p className="topline">How it works</p>
              <h2 className="section-title display-2">
                From &ldquo;where do we go?&rdquo; to a table that&apos;s
                expecting you.
              </h2>
            </Reveal>
            <div className="loop-grid">
              <Reveal className="loop-visual">
                <div className="loop-card" aria-label="Demo reservation card">
                  <div className="loop-card-header">
                    <p className="loop-card-venue">Dinner · woodfire</p>
                    <span className="loop-card-badge">Demo</span>
                  </div>
                  <dl className="loop-card-rows">
                    <div className="loop-card-row">
                      <dt>Vibe</dt>
                      <dd>quiet · romantic</dd>
                    </div>
                    <div className="loop-card-row">
                      <dt>Price anchor</dt>
                      <dd>mains 90–140k</dd>
                    </div>
                    <div className="loop-card-row">
                      <dt>Table</dt>
                      <dd>reserved, venue confirms</dd>
                    </div>
                    <div className="loop-card-row">
                      <dt>Your offer</dt>
                      <dd>redeem at the counter</dd>
                    </div>
                  </dl>
                  <p className="loop-card-foot">
                    Reservations open in the venue&apos;s booking page; the
                    venue confirms directly. Demo card — real venues appear in
                    the guide below.
                  </p>
                </div>
              </Reveal>
              <div className="loop-steps">
                <Reveal className="loop-step">
                  <h3>Pick the moment</h3>
                  <p>
                    Morning coffee, surf, sunset, dinner. The guide is arranged
                    by time of day, not by category soup — because that&apos;s
                    how a day actually happens.
                  </p>
                </Reveal>
                <Reveal className="loop-step">
                  <h3>Choose with real information</h3>
                  <p>
                    Vibe tags are set on-site — noise, wifi, sockets, crowd —
                    never by eye from photos. Price anchors tell you what a
                    coffee or a main actually costs before you sit down.
                  </p>
                </Reveal>
                <Reveal className="loop-step">
                  <h3>Reserve, or just walk in</h3>
                  <p>
                    Bookable places hand you to the venue&apos;s reservation
                    page — the venue confirms your table directly. Cafés and
                    warungs don&apos;t need booking; go when the moment says
                    so.
                  </p>
                </Reveal>
                <Reveal className="loop-step">
                  <h3>Show the offer at the counter</h3>
                  <p>
                    Confirmed venue offers — a free dessert, a welcome drink —
                    are redeemed on your phone at the venue, one tap, no
                    account. That&apos;s the whole transaction.
                  </p>
                </Reveal>
                <Reveal>
                  <div className="hero-cta-row">
                    <a href="#guide" className="button-primary button-large">
                      Open the guide
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SCENARIOS / ROUTES ============ */}
        {routes.length > 0 && (
          <section className="section" id="routes">
            <div className="site-shell">
              <Reveal className="section-head">
                <p className="topline">Ready-made routes</p>
                <h2 className="section-title display-2">
                  Days that already work.
                </h2>
                <p className="section-lede">
                  Each route is an ordered line through Canggu — first coffee
                  to last table — for the kind of day you&apos;re having.
                </p>
              </Reveal>
              <div className="scenario-strip">
                {routes.map((r, i) => (
                  <Link
                    key={r.slug}
                    href={`/route/${r.slug}`}
                    className={`scenario-card ${SCENES[i % SCENES.length]}`}
                  >
                    <p className="scenario-card-kicker">Route {String(i + 1).padStart(2, "0")}</p>
                    <p className="scenario-card-title">{r.title}</p>
                    {r.subtitle && (
                      <p className="scenario-card-meta">{r.subtitle}</p>
                    )}
                    <p className="scenario-card-go">{r.stopCount} stops →</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============ THE GUIDE ============ */}
        <section className="section" id="guide" style={{ paddingTop: 0 }}>
          <div className="site-shell">
            <Reveal className="section-head">
              <p className="topline">The guide · Canggu</p>
              <h2 className="section-title display-2">Today, by the hour.</h2>
              <p className="section-lede">
                Filter by the vibe you&apos;re after. Everything below was
                visited in person; offers appear only where the venue confirmed
                them.
              </p>
            </Reveal>
            <PlanView plan={plan} />
          </div>
        </section>

        {/* ============ TRUST ============ */}
        <section className="section section-dark on-dark" id="trust">
          <div className="site-shell">
            <Reveal className="section-head">
              <p className="topline">Why trust this</p>
              <h2 className="section-title display-2">
                Built so we can&apos;t lie to you.
              </h2>
            </Reveal>
            <div className="trust-grid">
              <Reveal className="trust-card">
                <h3>You never pay</h3>
                <p>
                  No subscription, no card, no &ldquo;premium tier.&rdquo;
                  Venues pay us a fixed fee when a table reserved through us is
                  actually seated — that is the entire business model.
                </p>
              </Reveal>
              <Reveal className="trust-card" delay={80}>
                <h3>Money can&apos;t buy ranking</h3>
                <p>
                  Recommendations are editorial. The rare sponsored placement
                  is always labeled &ldquo;Sponsored&rdquo; and never changes
                  the order of anything.
                </p>
              </Reveal>
              <Reveal className="trust-card" delay={160}>
                <h3>We were there</h3>
                <p>
                  Vibe tags — quiet, work-friendly, romantic — are set during a
                  visit, with noise, wifi and sockets checked. No scraped
                  reviews, no armchair curation.
                </p>
              </Reveal>
              <Reveal className="trust-card">
                <h3>No account, no tracking of you</h3>
                <p>
                  The guide works without signup. Redeeming an offer stores an
                  anonymous device token only — no name, email or location.
                  Venues see visit counts, not identities.
                </p>
              </Reveal>
              <Reveal className="trust-card" delay={80}>
                <h3>Offers are venue-confirmed</h3>
                <p>
                  Every perk shown was agreed with the venue and is redeemed at
                  the counter with staff present. If it&apos;s not confirmed,
                  it&apos;s not shown.
                </p>
              </Reveal>
              <Reveal className="trust-card" delay={160}>
                <h3>Deep where it counts</h3>
                <p>
                  We go district by district. Right now that means Canggu —
                  covered properly — rather than all of Bali covered thinly.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ COMPARISON ============ */}
        <section className="section" id="compare">
          <div className="site-shell">
            <Reveal className="section-head">
              <p className="topline">Against the alternatives</p>
              <h2 className="section-title display-2">
                What a maps app can&apos;t tell you.
              </h2>
            </Reveal>
            <Reveal>
              <div className="compare-wrap">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th scope="col">What you get</th>
                      <th scope="col" className="col-us">
                        Other Bali
                      </th>
                      <th scope="col">Maps &amp; review apps</th>
                      <th scope="col">Listicles &amp; blogs</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Who chose the places</th>
                      <td className="col-us">A person who went, this season</td>
                      <td>Everyone and no one</td>
                      <td>Often written from other lists</td>
                    </tr>
                    <tr>
                      <th scope="row">Vibe you can rely on</th>
                      <td className="col-us">Checked on-site: noise, wifi, crowd</td>
                      <td>Guess from photos</td>
                      <td>Adjectives</td>
                    </tr>
                    <tr>
                      <th scope="row">What it costs before you sit</th>
                      <td className="col-us">Price anchors on the card</td>
                      <td>&ldquo;$$&rdquo;</td>
                      <td>Rarely, and outdated</td>
                    </tr>
                    <tr>
                      <th scope="row">A day, not a list</th>
                      <td className="col-us">Routes by moment, morning to night</td>
                      <td>You assemble it</td>
                      <td>You assemble it</td>
                    </tr>
                    <tr>
                      <th scope="row">Something extra at the table</th>
                      <td className="col-us">Venue-confirmed offers, redeemed at the counter</td>
                      <td>—</td>
                      <td>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Reveal>
            <Reveal>
              <div className="hero-cta-row" style={{ marginTop: 34 }}>
                <a href="#guide" className="button-primary button-large">
                  Plan my day
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="section" id="faq" style={{ paddingTop: 0 }}>
          <div className="site-shell">
            <Reveal className="section-head">
              <p className="topline">Fair questions</p>
              <h2 className="section-title display-2">
                The catch, examined.
              </h2>
            </Reveal>
            <Reveal>
              <div className="faq-list">
                <details className="faq-item">
                  <summary>Is it really free? What&apos;s the catch?</summary>
                  <p>
                    Really free. Venues pay us a fixed fee when a table
                    reserved through us becomes a real seated visit. You are
                    never charged, and there is nothing to subscribe to. That
                    fee doesn&apos;t buy a venue better placement — curation
                    stays editorial.
                  </p>
                </details>
                <details className="faq-item">
                  <summary>Do I need an account or the app store?</summary>
                  <p>
                    No account, ever. The guide is a website you can add to
                    your home screen if you like. Offers you redeem are
                    remembered on your device via an anonymous token — no
                    email, no password.
                  </p>
                </details>
                <details className="faq-item">
                  <summary>How do the offers actually work?</summary>
                  <p>
                    At the venue, open the offer and tap redeem — you&apos;ll
                    get a code to show staff. It works only on-site, which is
                    the point: the venue sees real visits, you get the perk. One
                    per guest, terms shown on each card.
                  </p>
                </details>
                <details className="faq-item">
                  <summary>What happens when I reserve a table?</summary>
                  <p>
                    We hand you to the venue&apos;s own reservation page and
                    the venue confirms your table directly — we don&apos;t sit
                    in the middle of your booking. If a place doesn&apos;t take
                    reservations, we say so and you just walk in.
                  </p>
                </details>
                <details className="faq-item">
                  <summary>Why don&apos;t you warn about bad places?</summary>
                  <p>
                    Because a guide that lists everything and grades it is just
                    another review app. Places that didn&apos;t convince us
                    aren&apos;t warned about — they&apos;re simply not here.
                    Absence is the review.
                  </p>
                </details>
                <details className="faq-item">
                  <summary>Why only Canggu?</summary>
                  <p>
                    Depth beats coverage. Verified vibes, honest prices and
                    confirmed offers require actually being there — so we open
                    one district at a time and do it properly. More of Bali
                    follows.
                  </p>
                </details>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
        <section className="cta-final on-dark">
          <div className="site-shell cta-final-inner">
            <Reveal>
              <p className="topline" style={{ color: "var(--brass)" }}>
                Other Bali · Canggu
              </p>
              <h2 className="display-2" style={{ marginTop: 14, maxWidth: 620 }}>
                Your day is already planned. Go have it.
              </h2>
              <div className="hero-cta-row">
                <a href="#guide" className="button-primary button-large">
                  Plan my day
                </a>
                <a href="#routes" className="button-ghost-dark button-large">
                  Ready-made routes
                </a>
              </div>
              <p className="cta-final-trust">
                Free for travellers. No signup. Show the screen at the venue —
                that&apos;s it.
              </p>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
      <MobileStickyCTA />
    </>
  );
}
