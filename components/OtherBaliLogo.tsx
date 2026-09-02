// Other Bali wordmark — approved Final system (2026-07-16).
// Rule: [O-ring] + THER BALI, set in Gloock (the wordmark's exclusive face).
// Cap-height of the text equals the ring's outer diameter; the clay dot is
// the ONLY place clay appears in the UI. On dark photography pass
// color="#E7B7AE" (rose) per the spec.
// Ported from the design system's other-bali-logo.js: Gloock cap ≈ 0.75em,
// so font-size = size / 0.75.
//
// Text-extraction contract: the element's textContent must read exactly
// "OTHER BALI". The ring draws the leading O, so the visible glyphs are only
// "THER BALI"; a crawler or AI extractor that ignores CSS and aria-hidden reads
// raw text, and this used to sit next to a separate sr-only "Other Bali",
// yielding "Other BaliTHER BALI" — a brand name with a duplicated fragment.
// Supplying just the missing "O" as visually-hidden text makes the two glyph
// runs concatenate correctly while leaving the design untouched. Screen readers
// are unaffected either way: role="img" + aria-label names the element and its
// children are not announced.
export default function OtherBaliLogo({
  size = 24,
  color = "#2B1A13",
  dot = "#C4623F",
}: {
  size?: number;
  color?: string;
  dot?: string;
}) {
  const font = size / 0.75;
  return (
    <span
      role="img"
      aria-label="Other Bali"
      style={{ display: "inline-flex", alignItems: "center", lineHeight: 1 }}
    >
      <span
        aria-hidden="true"
        style={{
          boxSizing: "border-box",
          width: size,
          height: size,
          borderRadius: "50%",
          border: `${(size * 0.15).toFixed(1)}px solid ${color}`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: "50%",
            background: dot,
          }}
        />
      </span>
      {/* The O the ring draws — hidden from sight, present in the text. */}
      <span className="sr-only">O</span>
      <span
        aria-hidden="true"
        style={{
          font: `400 ${font.toFixed(1)}px/0.8 var(--font-gloock), Georgia, serif`,
          color,
          letterSpacing: ".01em",
          marginLeft: size * 0.07,
          transform: `translateY(${size * 0.02}px)`,
        }}
      >
        THER&nbsp;BALI
      </span>
    </span>
  );
}
