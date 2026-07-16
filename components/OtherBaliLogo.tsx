// Other Bali wordmark — approved Final system (2026-07-16).
// Rule: [O-ring] + THER BALI, set in Gloock (the wordmark's exclusive face).
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
      <span
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
      <span
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
