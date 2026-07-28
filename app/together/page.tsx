import type { Metadata } from "next";
import Link from "next/link";
import { GuideFooter } from "@/components/GuideBlocks";
import SceneImage from "@/components/landing/SceneImage";
import TogetherShareButton from "./TogetherShareButton";

export const metadata: Metadata = {
  title: "Together — share a better Bali plan",
  description: "Find one place, send it to someone, and make a Bali plan worth sharing.",
  alternates: { canonical: "/together" },
  openGraph: {
    title: "Other Bali Together",
    description: "A short, considered way to choose and share a Bali plan.",
    url: "https://www.otherbali.com/together",
    type: "website",
  },
};

const steps = [
  ["01", "Find", "Start with a real Bali decision: where to eat, reset, watch sunset or spend the day.", "together-step-find", "sunset"],
  ["02", "Send", "Share one considered option with the person you are travelling with — not another endless list.", "together-step-send", "ridge"],
  ["03", "Decide", "Compare the fit, the trade-offs and the practical details before you commit.", "together-step-decide", "surf"],
  ["04", "Plan", "Turn the choice into a simple next step for today, tomorrow or the trip ahead.", "together-step-plan", "night"],
] as const;

export default function TogetherPage() {
  return (
    <main className="together-page">
      <section className="together-hero site-shell">
        <div className="together-hero-copy">
          <p className="topline">Other Bali · Together</p>
          <h1 className="hero-title">One good place is better than a hundred tabs.</h1>
          <p className="guide-standfirst">Find a Bali place that fits the moment, send it to someone, and make a plan you will actually want to follow.</p>
          <div className="together-actions">
            <Link className="primary-cta" href="/places">Find a place to share</Link>
            <TogetherShareButton />
          </div>
        </div>
        <div className="together-hero-media" aria-label="A table with one open seat">
          <SceneImage scene="together-hero-dinner" variant="sunset" alt="A warm dinner table with one open seat" imgClassName="together-scene" />
          <div className="together-hero-caption">Leave one seat open for the right next step.</div>
        </div>
      </section>

      <section className="together-intro site-shell" id="how">
        <p className="topline">A calmer way to choose</p>
        <h2>Good plans are shared decisions.</h2>
        <p>Other Bali keeps the useful part of the conversation: where you are, who you are with, what you want, and what to check before going.</p>
      </section>

      <section className="together-steps site-shell" aria-label="How Together works">
        {steps.map(([number, title, copy, scene, variant]) => (
          <article className="together-step" key={number}>
            <div className="together-step-media"><SceneImage scene={scene} variant={variant} alt="" imgClassName="together-scene" /></div>
            <div className="together-step-copy"><span className="topline">{number}</span><h3>{title}</h3><p>{copy}</p></div>
          </article>
        ))}
      </section>

      <section className="together-trust site-shell" id="trust">
        <div><p className="topline">Selected, not sponsored</p><h2>Useful context beats loud recommendations.</h2></div>
        <p>We show why a place fits, what it may not suit, and which details deserve a check. No copied reviews. No paid ranking. Just a practical next step you can share.</p>
      </section>

      <section className="together-final site-shell">
        <p className="topline">Start with one place worth sharing.</p>
        <h2>Make the next Bali decision together.</h2>
        <div className="together-actions"><Link className="primary-cta" href="/my-day">Plan today</Link><Link className="secondary-cta" href="/plan">Plan the trip</Link></div>
      </section>
      <GuideFooter />
    </main>
  );
}
