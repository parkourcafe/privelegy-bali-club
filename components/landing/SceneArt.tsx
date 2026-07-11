// Generated cinematic scene art — layered SVG, no photography, no people, no
// stock. This is deliberately atmospheric/editorial (golden-hour Bali) and must
// never be presented as a real photo of a specific venue (editorial guardrail).
// Variants share one warm palette so the whole site reads as one film.

export default function SceneArt({
  variant = "sunset",
  className = "",
}: {
  variant?: "sunset" | "ridge" | "surf" | "night";
  className?: string;
}) {
  const skies: Record<string, [string, string, string]> = {
    sunset: ["#3a2415", "#8a4a22", "#e2ba79"],
    ridge: ["#1c2a2b", "#2f5a52", "#c69a5c"],
    surf: ["#123038", "#0e7490", "#7fd6df"],
    night: ["#0c0f1a", "#1a2138", "#3a4a72"],
  };
  const [top, mid, glow] = skies[variant];
  const uid = variant;

  return (
    <svg
      className={className}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      role="presentation"
    >
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="60%" stopColor={mid} />
          <stop offset="100%" stopColor={glow} />
        </linearGradient>
        <radialGradient id={`sun-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe6ab" stopOpacity="0.95" />
          <stop offset="42%" stopColor={glow} stopOpacity="0.85" />
          <stop offset="100%" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`fade-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16100c" stopOpacity="0" />
          <stop offset="100%" stopColor="#16100c" stopOpacity="0.92" />
        </linearGradient>
      </defs>

      <rect width="1200" height="800" fill={`url(#sky-${uid})`} />
      <circle cx="760" cy="360" r="200" fill={`url(#sun-${uid})`} />
      <circle cx="760" cy="360" r="70" fill="#ffdf9b" opacity="0.85" />

      {/* far ridgeline */}
      <path
        d="M0 560 C 220 500, 380 560, 560 520 S 900 470, 1200 540 L1200 800 L0 800 Z"
        fill="#16100c"
        opacity="0.35"
      />
      {/* near ridgeline */}
      <path
        d="M0 640 C 260 600, 460 680, 720 630 S 1050 590, 1200 650 L1200 800 L0 800 Z"
        fill="#16100c"
        opacity="0.6"
      />

      {/* palm silhouettes */}
      <g fill="#16100c" opacity="0.9">
        <rect x="150" y="470" width="7" height="200" rx="3" transform="rotate(-4 153 570)" />
        <g transform="translate(153 470)" stroke="#16100c" strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M0 0 C -50 -30, -95 -20, -120 10" />
          <path d="M0 0 C 40 -40, 90 -35, 128 -8" />
          <path d="M0 0 C -30 -55, -20 -95, 8 -120" />
          <path d="M0 0 C 30 -50, 70 -70, 108 -70" />
        </g>
        <rect x="1040" y="440" width="8" height="230" rx="3" transform="rotate(5 1044 560)" />
        <g transform="translate(1044 440)" stroke="#16100c" strokeWidth="8" strokeLinecap="round" fill="none">
          <path d="M0 0 C 55 -30, 100 -18, 128 14" />
          <path d="M0 0 C -44 -42, -96 -34, -132 -6" />
          <path d="M0 0 C 26 -58, 16 -98, -12 -124" />
        </g>
      </g>

      <rect width="1200" height="800" fill={`url(#fade-${uid})`} />
    </svg>
  );
}
