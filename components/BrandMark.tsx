// The Other Bali brand mark — the "O" as a brass ring framing a golden-hour
// sun over the ocean (same geometry as the favicon, minus the espresso tile so
// it sits cleanly on any background). Decorative; the wordmark carries the name.
export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="bm-ring" x1="0.12" y1="0.08" x2="0.9" y2="0.96">
          <stop offset="0" stopColor="#f3d59b" />
          <stop offset="0.46" stopColor="#d3a55f" />
          <stop offset="1" stopColor="#a5793b" />
        </linearGradient>
        <linearGradient id="bm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38210f" />
          <stop offset="0.6" stopColor="#8a542a" />
          <stop offset="1" stopColor="#ecc588" />
        </linearGradient>
        <radialGradient id="bm-sun" cx="50%" cy="44%" r="62%">
          <stop offset="0" stopColor="#fdefc9" />
          <stop offset="0.55" stopColor="#f4d193" />
          <stop offset="1" stopColor="#e2ba79" />
        </radialGradient>
        <clipPath id="bm-disc">
          <circle cx="256" cy="256" r="119" />
        </clipPath>
      </defs>
      <g clipPath="url(#bm-disc)">
        <rect x="118" y="118" width="276" height="276" fill="url(#bm-sky)" />
        <circle cx="256" cy="286" r="62" fill="url(#bm-sun)" />
        <rect x="118" y="300" width="276" height="94" fill="#b9863f" opacity="0.5" />
      </g>
      <circle cx="256" cy="256" r="146" fill="none" stroke="url(#bm-ring)" strokeWidth="58" />
    </svg>
  );
}
