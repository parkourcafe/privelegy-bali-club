import type { Metadata } from "next";
import HotelRestaurantsHub, { hotelRestaurantsHubIndexable } from "@/components/resort/HotelRestaurantsHub";

const indexable = hotelRestaurantsHubIndexable("nusa-dua");

export const metadata: Metadata = {
  title: "Best Hotel Restaurants in Nusa Dua",
  description:
    "The best hotel and resort restaurants in Nusa Dua & Tanjung Benoa — beachfront dining, signature venues and cultural dinners, with non-guest access and prices verified from official sources.",
  alternates: { canonical: "/nusa-dua/hotel-restaurants" },
  robots: indexable ? undefined : { index: false, follow: true },
};

export default function Page() {
  return (
    <HotelRestaurantsHub
      district="nusa-dua"
      districtLabel="Nusa Dua"
      title="Best hotel restaurants in Nusa Dua"
      intro="Nusa Dua and Tanjung Benoa are resort country — the best dining sits inside the five-star hotels, much of it open to non-guests. Here's what's worth booking, who each suits, and what it costs."
    />
  );
}
