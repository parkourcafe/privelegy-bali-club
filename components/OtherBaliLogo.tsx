// Other Bali wordmark — approved Final system (2026-07-16).
// Rule: a stylized, real-text O + THER BALI, set in Gloock (the wordmark's
// exclusive face). Keep the complete brand name in the rendered text tree:
// crawlers previously read the decorative O-ring plus "THER BALI" as the
// non-existent brand "THER BALI" even though the accessibility label was right.
// Cap-height of the text equals the ring's outer diameter; the clay dot is
// the ONLY place clay appears in the UI. On dark photography pass
// color="#E7B7AE" (rose) per the spec.
// Ported from the design system's other-bali-logo.js: Gloock cap ≈ 0.75em,
// so font-size = size / 0.75.
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
      aria-label="OTHER BALI"
      style={{ display: "inline-flex", alignItems: "center", lineHeight: 1 }}
    >
      <span className="sr-only">Other Bali</span>
      <span
        aria-hidden="true"
        style={{
          position: "relative",
          width: size,
          height: size,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          font: `400 ${font.toFixed(1)}px/0.8 var(--font-gloock), Georgia, serif`,
          color,
          transform: `translateY(${size * 0.02}px)`,
        }}
      >
        O
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: "50% auto auto 50%",
            transform: "translate(-50%, -50%)",
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: "50%",
            background: dot,
          }}
        />
      </span>
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
