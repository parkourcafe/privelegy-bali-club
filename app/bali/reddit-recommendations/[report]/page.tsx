import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRedditReport, readRedditReport, REDDIT_REPORTS } from "@/lib/reddit-reports";

export function generateStaticParams() {
  return REDDIT_REPORTS.map((report) => ({ report: report.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ report: string }> }): Promise<Metadata> {
  const { report: slug } = await params;
  const report = getRedditReport(slug);
  if (!report) return { title: "Research not found" };
  return { title: `${report.title} — Reddit Research`, description: report.description, alternates: { canonical: `/bali/reddit-recommendations/${report.slug}` } };
}

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\[[^\]]+\]\(https?:\/\/[^)]+\)|\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer" className="quiet-link">{link[1]} ↗</a>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return part;
  });
}

function renderMarkdown(markdown: string) {
  return markdown.split(/\r?\n/).map((line, index) => {
    if (!line.trim()) return <div key={index} className="h-3" />;
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      if (level === 1) return <h1 key={index} className="hero-title mt-8">{inline(heading[2])}</h1>;
      if (level === 2) return <h2 key={index} className="section-title mt-9">{inline(heading[2])}</h2>;
      return <h3 key={index} className="venue-name mt-6">{inline(heading[2])}</h3>;
    }
    if (line.startsWith("|")) return <pre key={index} className="overflow-x-auto whitespace-pre rounded bg-[var(--paper-soft)] px-3 py-1 text-xs text-[var(--muted)]">{line}</pre>;
    if (/^[-*]\s+/.test(line)) return <p key={index} className="ml-5 text-sm leading-7 text-[var(--muted)]">• {inline(line.replace(/^[-*]\s+/, ""))}</p>;
    if (/^\d+\.\s+/.test(line)) return <p key={index} className="ml-5 text-sm leading-7 text-[var(--muted)]">{inline(line)}</p>;
    return <p key={index} className="text-sm leading-7 text-[var(--muted)]">{inline(line)}</p>;
  });
}

export default async function RedditReportPage({ params }: { params: Promise<{ report: string }> }) {
  const { report: slug } = await params;
  const report = getRedditReport(slug);
  if (!report) notFound();
  const markdown = await readRedditReport(report);
  return (
    <div className="page-dark">
      <main className="site-shell max-w-4xl">
        <nav aria-label="Breadcrumb" className="text-xs text-[var(--muted)]"><Link href="/bali/reddit-recommendations" className="quiet-link">← Reddit recommendations</Link></nav>
        <aside className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--paper-soft)] p-4 text-xs leading-6 text-[var(--muted)]">Traveller recommendation research in Russian. Reddit mentions are perception signals; verify current venue details before booking.</aside>
        <article className="pb-16">{renderMarkdown(markdown)}</article>
      </main>
    </div>
  );
}
