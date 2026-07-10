"use client";

import { useEffect, useState } from "react";

// Phone-first sticky CTA: slides in once the hero is scrolled past, hides
// again while the guide itself is on screen (no point pointing at it).
export default function MobileStickyCTA() {
  const [pastHero, setPastHero] = useState(false);
  const [guideInView, setGuideInView] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const guide = document.getElementById("guide");
    if (!hero) return;

    const heroIO = new IntersectionObserver(
      ([e]) => setPastHero(!e.isIntersecting),
      { threshold: 0.05 }
    );
    heroIO.observe(hero);

    let guideIO: IntersectionObserver | undefined;
    if (guide) {
      guideIO = new IntersectionObserver(([e]) => setGuideInView(e.isIntersecting));
      guideIO.observe(guide);
    }
    return () => {
      heroIO.disconnect();
      guideIO?.disconnect();
    };
  }, []);

  return (
    <div
      className={`sticky-cta ${pastHero && !guideInView ? "is-shown" : ""}`}
      aria-hidden={!(pastHero && !guideInView)}
    >
      <a href="#guide" className="button-primary">
        Plan my day
      </a>
      <a href="#routes" className="button-ghost-dark">
        Routes
      </a>
    </div>
  );
}
