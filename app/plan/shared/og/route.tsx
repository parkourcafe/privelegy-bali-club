import { ImageResponse } from "next/og";
import {
  MOODS,
  DISTRICTS,
  allowedMood,
  allowedDistrict,
  allowedDays,
  daysLabel,
  first,
} from "../params";

// Dynamic share card for /plan/shared. The file-convention opengraph-image
// can't read query params, so the page's generateMetadata points og:image
// here with the same m/district/days params. Style follows the root
// app/opengraph-image.tsx (paper/ink/lagoon palette, O-ring wordmark, no
// remote fonts/assets). Only whitelisted strings are ever drawn — params.ts
// coerces anything else to defaults, so the card can't render injected text.

export const runtime = "nodejs";

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#F3ECDF",
        borderRadius: 24,
        padding: "20px 28px",
      }}
    >
      <div
        style={{
          fontSize: 20,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#8a7a68",
          fontFamily: "sans-serif",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#2B1A13",
          fontFamily: "sans-serif",
          marginTop: 6,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mood = allowedMood(first(searchParams.get("m")));
  const district = allowedDistrict(first(searchParams.get("district")));
  const days = allowedDays(first(searchParams.get("days")) ?? undefined);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#FAF6EF",
          color: "#2B1A13",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                border: "6px solid #2B1A13",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 12,
                  background: "#C4623F",
                }}
              />
            </div>
            <div
              style={{
                fontSize: 50,
                lineHeight: 0.8,
                letterSpacing: "0.01em",
                marginLeft: 4,
              }}
            >
              THER BALI
            </div>
          </div>
          <div
            style={{
              fontSize: 24,
              color: "#005962",
              fontFamily: "sans-serif",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            A day shared with you
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, lineHeight: 1.02, fontWeight: 700 }}>
            {MOODS[mood]}
          </div>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.02,
              fontWeight: 700,
              color: "#005962",
            }}
          >
            {`in ${DISTRICTS[district]}`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <Chip label="Length" value={daysLabel(days)} />
            <Chip label="Guide" value="Live places & bookings" />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 28,
              color: "#005962",
              fontFamily: "sans-serif",
              fontWeight: 700,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 14,
                background: "#005962",
              }}
            />
            otherbali.com · free for travellers
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
