import type { Metadata } from "next";
import HotelRestaurantsHub, { hotelRestaurantsHubIndexable } from "@/components/resort/HotelRestaurantsHub";

const indexable = hotelRestaurantsHubIndexable("nusa-dua");

export const metadata: Metadata = {
  title: "Best Hotel Restaurants in Nusa Dua",
  description:
    "Nusa Dua & Tanjung Benoa hotel restaurants, from beachfront dining to cultural dinners, with non-guest access and prices verified from official sources.",
  alternates: { canonical: "/nusa-dua/hotel-restaurants" },
  robots: indexable ? undefined : { index: false, follow: true },
};

export default function Page() {
  return (
    <HotelRestaurantsHub
      district="nusa-dua"
      districtLabel="Nusa Dua"
      title="Best hotel restaurants in Nusa Dua"
      intro="Nusa Dua and Tanjung Benoa are resort country. The best dining sits inside the five-star hotels, and much of it is open to non-guests. Below you'll find what's worth booking, who each suits and what it costs."
    />
  );
}
