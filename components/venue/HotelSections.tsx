import type { PublicMenuSummary } from "@/lib/data/menu-summary-repository";
import StructuredMenu from "@/components/menu/StructuredMenu";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";

// Hotel profile sections for /places/[slug] when the venue is a hotel/resort.
// Reuses the approved Menu entity (via StructuredMenu) for rooms / dining / spa
// / day-pass, and outbound "official" links for book-direct + day-pass — no new
// entity, no booking engine, outbound only (guardrails #4/#13). A block renders
// only when its menu is present, so a real hotel with just a dining menu shows
// just that; the full layout is exercised by the dev fixture.

type Props = {
  venueSlug: string;
  rooms: PublicMenuSummary | null;
  dining: PublicMenuSummary | null;
  spa: PublicMenuSummary | null;
  dayPass: PublicMenuSummary | null;
  bookHref?: string | null;
  dayPassHref?: string | null;
};

export default function HotelSections({
  venueSlug,
  rooms,
  dining,
  spa,
  dayPass,
  bookHref,
  dayPassHref,
}: Props) {
  return (
    <>
      {rooms && (
        <section className="guide-section" aria-labelledby="hotel-rooms">
          <h2 id="hotel-rooms">Rooms</h2>
          <p className="guide-lede">Room types and nightly rates, straight from the hotel.</p>
          <div className="mt-4">
            <StructuredMenu menu={rooms} venueSlug={venueSlug} eyebrow="Rooms &amp; rates" hideAllergenNote />
          </div>
          {bookHref && (
            <p className="mt-4">
              <TrackedOutboundLink
                href={bookHref}
                event="booking_click"
                venueSlug={venueSlug}
                label="hotel_book_direct"
                className="button-primary"
              >
                Book your stay direct ↗
              </TrackedOutboundLink>
            </p>
          )}
        </section>
      )}

      {dining && (
        <section className="guide-section" aria-labelledby="hotel-dining">
          <h2 id="hotel-dining">Restaurant</h2>
          <p className="guide-lede">Open to non-guests — the hotel&apos;s own kitchen.</p>
          <div className="mt-4">
            <StructuredMenu menu={dining} venueSlug={venueSlug} />
          </div>
        </section>
      )}

      {spa && (
        <section className="guide-section" aria-labelledby="hotel-spa">
          <h2 id="hotel-spa">Spa</h2>
          <p className="guide-lede">Treatments and prices — open to visitors.</p>
          <div className="mt-4">
            <StructuredMenu menu={spa} venueSlug={venueSlug} eyebrow="Spa menu" hideAllergenNote />
          </div>
        </section>
      )}

      {dayPass && (
        <section className="guide-section" aria-labelledby="hotel-daypass">
          <h2 id="hotel-daypass">Open to visitors — day pass &amp; pool</h2>
          <p className="guide-lede">
            You don&apos;t have to stay here — the pool and facilities are open on a day pass.
          </p>
          <div className="mt-4">
            <StructuredMenu menu={dayPass} venueSlug={venueSlug} eyebrow="Day passes" hideAllergenNote />
          </div>
          {dayPassHref && (
            <p className="mt-4">
              <TrackedOutboundLink
                href={dayPassHref}
                event="official_website_click"
                venueSlug={venueSlug}
                label="hotel_day_pass"
                className="button-secondary"
              >
                Reserve a day pass ↗
              </TrackedOutboundLink>
            </p>
          )}
        </section>
      )}
    </>
  );
}
