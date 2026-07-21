import assert from "node:assert/strict";
import test from "node:test";
import { buildVenueMetadata } from "./venue-metadata";

const venue = {
  slug: "big-dragon-villas-ubud",
  name: "Big Dragon Villas Ubud",
  category: "villa",
  district: "Ubud",
  area: "Pejeng, near Ubud",
  description: "A private villa near Ubud.",
};

test("builds indexable venue metadata with a self-canonical URL", () => {
  const metadata = buildVenueMetadata({ ...venue, indexable: true });

  assert.equal(metadata.alternates?.canonical, "/places/big-dragon-villas-ubud");
  assert.deepEqual(metadata.robots, { index: true, follow: true });
  assert.equal(
    metadata.title,
    "Big Dragon Villas Ubud — Villa in Pejeng, near Ubud, Ubud",
  );
  assert.equal(String(metadata.title).includes("undefined"), false);
  assert.equal(
    metadata.openGraph?.url,
    "https://www.otherbali.com/places/big-dragon-villas-ubud",
  );
  assert.equal(metadata.openGraph?.title, "Big Dragon Villas Ubud · Other Bali");
  assert.equal(metadata.openGraph?.description, venue.description);
  assert.equal((metadata.openGraph as { type?: string } | undefined)?.type, "article");
  assert.deepEqual(metadata.twitter, {
    card: "summary_large_image",
    title: "Big Dragon Villas Ubud · Other Bali",
    description: venue.description,
  });
});

test("keeps non-indexable venues self-canonical while setting noindex and nofollow", () => {
  const metadata = buildVenueMetadata({ ...venue, indexable: false });

  assert.equal(metadata.alternates?.canonical, "/places/big-dragon-villas-ubud");
  assert.deepEqual(metadata.robots, { index: false, follow: false });
  assert.equal(
    metadata.openGraph?.url,
    "https://www.otherbali.com/places/big-dragon-villas-ubud",
  );
});

test("omits the area separator when a venue has no micro-area", () => {
  const metadata = buildVenueMetadata({
    slug: "example-restaurant",
    name: "Example Restaurant",
    category: "restaurant",
    district: "Ubud",
    description: "A verified restaurant.",
    indexable: true,
  });

  assert.equal(metadata.title, "Example Restaurant — Restaurant in Ubud");
  assert.equal(String(metadata.title).includes("undefined"), false);
});
