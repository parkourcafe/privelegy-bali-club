"use client";

import { useEffect, useRef, useState } from "react";

// One short, muted, looping hero clip — layered above the Ken Burns poster
// and faded in only once it can actually play. Performance gates:
// never with reduced motion or Save-Data, and
// loading starts only after the window load event, so it can't touch LCP.
// If the file is missing (fetch-scenes gate) or errors, the poster simply
// stays — the hero never goes empty.
export default function HeroLoop({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;

    const start = () => setEnabled(true);
    if (document.readyState === "complete") {
      const id = window.setTimeout(start, 400);
      return () => window.clearTimeout(id);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const video = ref.current;
    if (!video) return;
    const onReady = () => {
      video.play().then(() => setReady(true)).catch(() => {});
    };
    video.addEventListener("canplaythrough", onReady, { once: true });
    video.src = src;
    video.load();
    return () => video.removeEventListener("canplaythrough", onReady);
  }, [enabled, src]);

  if (!enabled) return null;

  return (
    <video
      ref={ref}
      className="ob-hero-video"
      data-ready={ready ? "true" : "false"}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onError={() => setReady(false)}
    />
  );
}
