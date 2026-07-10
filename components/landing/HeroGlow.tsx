"use client";

import { useEffect, useRef } from "react";

// A soft brass light that follows the cursor across the hero — the "expensive"
// micro-interaction (Phase 13 #7). Pointer-only, and fully disabled under
// prefers-reduced-motion or on touch (no cursor to follow).
export default function HeroGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        el.style.setProperty("--mx", `${x}%`);
        el.style.setProperty("--my", `${y}%`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-70 transition-opacity"
      style={{
        background:
          "radial-gradient(360px 360px at var(--mx, 70%) var(--my, 30%), rgba(226,186,121,0.18), transparent 70%)",
      }}
    />
  );
}
