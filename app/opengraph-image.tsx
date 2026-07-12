import { ImageResponse } from "next/og";

// Social share card (og:image + twitter:image via the file convention). Kept
// self-contained: no remote fonts/assets, brand palette hardcoded from the
// landing (--ob-espresso / --ob-sand / --lagoon) so it renders at the edge.
export const alt = "Other Bali — the right place for the moment you're in";
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
          background:
            "radial-gradient(1200px 600px at 80% -10%, #2b2018 0%, #16100c 60%)",
          color: "#f4ece0",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 34,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#cdbfa9",
            fontWeight: 700,
          }}
        >
          Other Bali
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 82,
              lineHeight: 1.05,
              fontWeight: 800,
              maxWidth: 900,
            }}
          >
            The right place for the moment you&apos;re in.
          </div>
          <div style={{ fontSize: 34, color: "#cdbfa9", maxWidth: 820 }}>
            Tell us the day. Get the places that actually fit — not another list
            to scroll.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 30,
            color: "#f4ece0",
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 16,
              background: "#00737a",
            }}
          />
          otherbali.com · Travellers never pay
        </div>
      </div>
    ),
    { ...size }
  );
}
