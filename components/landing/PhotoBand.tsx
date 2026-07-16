import SceneImage from "./SceneImage";
import ParallaxScene from "./ParallaxScene";
import Reveal from "./Reveal";

// Full-bleed cinematic interstitial: a big photograph on slow scroll parallax
// that breaks up the text-heavy sections of the light landing. Atmosphere only
// (our Higgsfield scene set), never a specific venue. A short Young Serif line
// rides a bottom scrim; a light editorial grade keeps it on-brand.
export default function PhotoBand({
  scene,
  variant,
  kicker,
  line,
  align = "left",
}: {
  scene: string;
  variant: "sunset" | "ridge" | "surf" | "night";
  kicker?: string;
  line: string;
  align?: "left" | "center";
}) {
  return (
    <section className="ob-photo-band" aria-hidden={!line}>
      <ParallaxScene className="absolute inset-0" amplitude={28}>
        <SceneImage scene={scene} variant={variant} imgClassName="ob-grade ob-band-img" />
      </ParallaxScene>
      <div className="ob-photo-band-scrim" />
      <div
        className={`ob-photo-band-inner ${align === "center" ? "text-center" : ""}`}
      >
        <Reveal>
          {kicker ? <p className="ob-band-kicker">{kicker}</p> : null}
          <p className="ob-band-line">{line}</p>
        </Reveal>
      </div>
    </section>
  );
}
