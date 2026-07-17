import SceneImage from "./SceneImage";
import HeroLoop from "./HeroLoop";

// Cinematic masthead for the district pillar pages — the same self-contained
// dark block the /places catalogue uses, generalised so every pillar gets a
// consistent video hero. The district mood still (public/scenes/district-*.webp,
// fetched at build) is the poster; an optional loop fades in on desktop only,
// behind the identical performance/motion gates as the landing hero (never on
// phones, reduced-motion or Save-Data; loads after window.load; poster is the
// permanent fallback). Atmosphere of the AREA, decorative — never a specific
// venue photo (content guardrail).
export default function PillarMasthead({
  posterScene,
  variant,
  videoSrc,
  kicker,
  title,
  copy,
  meta,
  actions,
}: {
  posterScene: string;
  variant: "sunset" | "ridge" | "surf" | "night";
  videoSrc?: string;
  kicker: string;
  title: string;
  copy: string;
  meta?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="pillar-masthead ob-grain relative -mx-4 mb-9 overflow-hidden sm:mx-0 sm:rounded-3xl sm:border sm:border-[rgba(22,16,12,0.35)]">
      <div className="relative min-h-[19rem] md:min-h-[23rem]">
        <SceneImage scene={posterScene} variant={variant} imgClassName="ob-grade" />
        {videoSrc ? <HeroLoop src={videoSrc} /> : null}
        {/* Legibility scrims: left→right wash for the copy column plus a strong
            bottom-up gradient, matching the landing and /places heroes. */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#16100c]/90 via-[#16100c]/55 to-[#16100c]/25" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#16100c] via-[#16100c]/78 to-transparent" />

        <div className="relative flex min-h-[19rem] flex-col justify-end p-6 sm:p-9 md:min-h-[23rem]">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#E7B7AE]">
              {kicker}
            </p>
            <h1 className="hero-title mt-3 text-[#FAF6EF] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              {title}
            </h1>
            <p className="hero-copy mt-3 max-w-xl text-[#FAF6EF] drop-shadow-[0_2px_14px_rgba(0,0,0,0.92)]">
              {copy}
            </p>
            {meta ? (
              <p className="mt-3 text-xs text-[rgba(250,246,239,0.72)]">{meta}</p>
            ) : null}
            {actions ? <div className="mt-5 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </div>
      </div>
    </header>
  );
}
