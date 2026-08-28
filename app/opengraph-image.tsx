import { ImageResponse } from "next/og";

// Social share card (og:image + twitter:image via the file convention). Kept
// self-contained: no remote fonts/assets; palette hardcoded from the approved
// Final light system (paper #FAF6EF · ink #2B1A13 · lagoon #005962 · clay dot)
// so it renders at the edge. Wordmark rule: complete OTHER BALI, serif.
export const alt = "Other Bali — Discover Bali together";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#FAF6EF",
          color: "#2B1A13",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <div
            style={{
              fontSize: 58,
              lineHeight: 0.8,
              letterSpacing: "0.01em",
            }}
          >
            OTHER BALI
          </div>
          <div
            style={{
              position: "absolute",
              width: 11,
              height: 11,
              left: 20,
              top: 17,
              borderRadius: 11,
              background: "#C4623F",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 82,
              lineHeight: 1.05,
              fontWeight: 700,
              maxWidth: 940,
            }}
          >
            The right place for the moment you&apos;re in.
          </div>
          <div
            style={{
              fontSize: 34,
              color: "#5c4a3c",
              maxWidth: 820,
              fontFamily: "sans-serif",
            }}
          >
            Resident-curated places, routes and plans for every Bali moment.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 30,
            color: "#005962",
            fontFamily: "sans-serif",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 16,
              background: "#005962",
            }}
          />
          Discover Bali together · otherbali.com
        </div>
      </div>
    ),
    { ...size }
  );
}
