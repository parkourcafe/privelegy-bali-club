"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Slow scroll parallax for scene imagery: one rAF-throttled scroll listener
// sets --ob-py (px) from the element's position in the viewport. Amplitude is
// deliberately small — light drifting across a photo, not an effect. Disabled
// under prefers-reduced-motion (CSS also hard-disables the transform).
export default function ParallaxScene({
  children,
  amplitude = 16,
  className = "",
}: {
  children: ReactNode;
  amplitude?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      if (rect.bottom < -80 || rect.top > vh + 80) return;
      // -1 (element below viewport) → +1 (above); center = 0
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      el.style.setProperty("--ob-py", (progress * -amplitude).toFixed(1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [amplitude]);

  return (
    <div ref={ref} className={`ob-parallax ${className}`}>
      {children}
    </div>
  );
}
