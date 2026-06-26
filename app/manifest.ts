import type { MetadataRoute } from "next";

// Web-first, but installable: tourists add it to the home screen on the island.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Canggu Perks Map",
    short_name: "Canggu Perks",
    description: "A curated Canggu day with real perks.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#0e7490",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-maskable.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
