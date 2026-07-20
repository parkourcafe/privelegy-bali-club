import type { Metadata } from "next";
import HotelRestaurantsHub, { hotelRestaurantsHubIndexable } from "@/components/resort/HotelRestaurantsHub";

const indexable = hotelRestaurantsHubIndexable(null);

export const metadata: Metadata = {
  title: "Hotel & Resort Restaurants in Bali",
  description:
    "Bali's hotel and resort restaurants — which take non-guests, what they cost, and what to expect, verified from official sources.",
  alternates: { canonical: "/hotel-restaurants" },
  // §13.2 gate: noindex until the global hub has enough decision-ready entries
  // across enough districts. Operator publishes via the resort whitelist.
  robots: indexable ? undefined : { index: false, follow: true },
};

export default function Page() {
  return (
    <HotelRestaurantsHub
      district={null}
      title="Hotel & resort restaurants in Bali"
      intro="Resort dining that's open to everyone, not just guests — beachfront seafood, signature fine dining and cultural dinners, with honest notes on access and price. We start in Nusa Dua and add areas as each venue is verified."
    />
  );
}
