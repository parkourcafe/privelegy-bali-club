import { notFound } from "next/navigation";
import type { MenuRecord } from "@/lib/contracts/menu-action";
import type { PublicMenuSummary } from "@/lib/data/menu-summary-repository";
import { hotelFixture } from "@/lib/contracts/hotel-fixture";
import HotelSections from "@/components/venue/HotelSections";

// DEV-ONLY preview of the hotel profile layout (Stage C). The real render lives
// in /places/[slug] behind the hotel/resort category; this harness renders the
// same HotelSections from the fixture WITHOUT a DB lookup, so the layout is
// reviewable/screenshottable locally. 404s in any non-development build.

export const dynamic = "force-static";

function toSummary(menu: MenuRecord): PublicMenuSummary {
  return {
    ...menu,
    sections: menu.sections.map((s) => ({ ...s, itemCount: s.items.length, deferred: false })),
  };
}

export default function HotelPreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  const slug = "fixture-hotel";
  return (
    <main className="site-shell">
      <header className="venue-masthead ob-grain type-cover-hotel">
        <div className="venue-masthead-inner">
          <p className="venue-masthead-kicker">Hotel · Umalas · Canggu · $$</p>
          <h1 className="venue-masthead-title">The Umalas Hotel</h1>
          <p className="venue-masthead-verdict">
            Dev preview of the hotel profile layout — fixture data, not a real listing.
          </p>
        </div>
      </header>

      <div style={{ marginTop: 24 }}>
        <HotelSections
          venueSlug={slug}
          rooms={toSummary(hotelFixture.rooms)}
          dining={toSummary(hotelFixture.dining)}
          spa={toSummary(hotelFixture.spa)}
          dayPass={toSummary(hotelFixture.dayPass)}
          bookHref={hotelFixture.bookHref}
          dayPassHref={hotelFixture.dayPassHref}
        />
      </div>
    </main>
  );
}
