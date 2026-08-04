"use client";

import { useState } from "react";
import Image from "next/image";
import SceneArt from "./SceneArt";

// Cinematic scene layer: generated photographic scene (public/scenes/*.webp,
// fetched at build by scripts/fetch-scenes.mjs) rendered above the SVG scene
// art. If the file is missing or fails to load, the SVG stays — the section
// never goes empty. Atmosphere only; never presented as a real venue photo.
export default function SceneImage({
  scene,
  variant,
  alt = "",
  className = "",
  imgClassName = "",
  sizes = "100vw",
}: {
  scene: string;
  variant: "sunset" | "ridge" | "surf" | "night";
  alt?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`absolute inset-0 ${className}`}>
      <SceneArt variant={variant} className="absolute inset-0 h-full w-full" />
      {!failed && (
        <Image
          src={`/scenes/${scene}.webp`}
          alt={alt}
          fill
          sizes={sizes}
          priority={scene === "hero-sunset"}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  );
}
