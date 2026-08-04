import Image from "next/image";
import Link from "next/link";
import HeroLoop from "@/components/landing/HeroLoop";
import SceneImage from "@/components/landing/SceneImage";

type SceneVariant = "sunset" | "ridge" | "surf" | "night";

const GUIDE_SCENES: Array<{ scene: string; variant: SceneVariant }> = [
  { scene: "hero-sunset", variant: "sunset" },
  { scene: "moment-morning", variant: "ridge" },
  { scene: "moment-goldenhour", variant: "sunset" },
  { scene: "moment-warung", variant: "surf" },
  { scene: "moment-dinner", variant: "night" },
];

function sceneFor(seed: string, offset = 0) {
  const chars = Array.from(seed);
  const hash = chars.reduce((total, char) => total + char.charCodeAt(0), offset);
  return GUIDE_SCENES[Math.abs(hash) % GUIDE_SCENES.length] ?? GUIDE_SCENES[0];
}

function videoFor(seed: string) {
  const normalized = seed.toLowerCase();
  if (normalized.includes("ubud") || normalized.includes("temple") || normalized.includes("wellness")) {
    return "/scenes/ubud-dawn-loop.mp4";
  }
  if (normalized.includes("beach") || normalized.includes("sunset") || normalized.includes("coast")) {
    return "/scenes/places-coast-loop.mp4";
  }
  return "/scenes/hero-loop.mp4";
}

export function GuideHeroMedia({ seed }: { seed: string }) {
  const scene = sceneFor(seed);
  return (
    <figure className="guide-media guide-media-hero">
      <SceneImage scene={scene.scene} variant={scene.variant} imgClassName="ob-grade ob-kenburns" />
      <HeroLoop src={videoFor(seed)} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
    </figure>
  );
}

export function GuideSectionMedia({
  seed,
  index,
  src,
  heading,
  support,
  actionHref,
  actionLabel,
}: {
  seed: string;
  index: number;
  src?: string;
  heading?: string;
  support?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  const scene = sceneFor(seed, index * 17);
  if (src && heading) {
    return (
      <figure className="guide-media guide-media-decision">
        <Image
          src={src}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1280px) calc(100vw - 4rem), 1120px"
          className="object-cover ob-grade"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5" />
        <div className="guide-media-decision-copy">
          <h2>{heading}</h2>
          {support ? <p>{support}</p> : null}
          {actionHref && actionLabel ? <Link href={actionHref}>{actionLabel}</Link> : null}
        </div>
      </figure>
    );
  }
  return (
    <figure className="guide-media guide-media-inline">
      <SceneImage scene={scene.scene} variant={scene.variant} imgClassName="transition duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
    </figure>
  );
}
