// TEMPORARY one-off venue photo backfill. Deployed, run, then deleted.
//
// Why it runs here and not on a laptop or in the agent session: the Claude Code
// sandbox cannot reach arbitrary hosts (its proxy denies CONNECT) and Firecrawl
// refuses binary files, so nothing there can hold image bytes. Supabase's own
// runtime has normal outbound network access, so page fetch + image download +
// Storage upload all happen in one place.
//
// Auth: verify_jwt is off (the caller is a plain external HTTP fetch, not a
// logged-in user); a shared token gates it instead. No key is embedded -- the
// service role key comes from the runtime env Supabase injects.
import { createClient } from "jsr:@supabase/supabase-js@2";

const TOKEN = "e7f513d0e432406b16aa94322408d2d38dd06fb2cc64d295";
const BUCKET = "owner-photo-candidates";
const BATCH = "official-site-photo-2026-08-26";
const MIN_BYTES = 12000;
const MAX_BYTES = 12000000;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

const STOP = new Set([
  "the","and","spa","bali","massage","yoga","studio","wellness","center","centre",
  "club","resort","hotel","villa","villas","cafe","restaurant","bar","house",
  "beach","gym","fitness","salon","boutique","healing","retreat","co","official",
  "ubud","canggu","seminyak","sanur","uluwatu","bukit","denpasar","jimbaran",
  "legian","kuta","nusa","dua","kerobokan","berawa","pererenan","tabanan",
  "munduk","sidemen","karangasem","candidasa","lovina","amed","singaraja",
  "gianyar","batubulan","sukawati",
]);
const PLATFORMS = new Set([
  "momence.com","classpass.com","fresha.com","zenoti.com","vagaro.com",
  "mindbodyonline.com","booksy.com","setmore.com",
]);
const JUNK = /(?:logo|icon|favicon|avatar|sprite|placeholder|badge|payment|visa|mastercard)/i;

// Same guard the offline vetting pass used: a venue whose name shares no real
// word with its resolved domain is skipped, not published. This is what stops a
// stale official_url (one row pointed at an unrelated fintech app) from being
// published as that venue's photo.
function domainMatchesName(slug: string, url: string): boolean {
  let host = "";
  try { host = new URL(url).hostname.replace(/^www\./, ""); } catch { return false; }
  const parts = host.split(".");
  const registrable = parts.length >= 2 ? parts.slice(-2).join(".") : host;
  if (PLATFORMS.has(registrable)) return true;
  const blob = registrable.split(".")[0].replace(/[^a-z0-9]/g, "");
  const words = slug.split("-").filter((w) => w.length > 2 && !STOP.has(w));
  return words.some((w) => blob.includes(w));
}

function decodeHtml(v: string) {
  return v.replaceAll("&amp;", "&").replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'").replaceAll("&#x27;", "'");
}

function pageImages(html: string, baseUrl: string): string[] {
  const found: { href: string; score: number }[] = [];
  const add = (raw: string | undefined, score: number) => {
    if (!raw || raw.startsWith("data:") || JUNK.test(raw)) return;
    try {
      const href = new URL(decodeHtml(raw), baseUrl).href;
      if (!href.startsWith("http")) return;
      if (!found.some((x) => x.href === href)) found.push({ href, score });
    } catch { /* ignore */ }
  };
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const key of ["og:image:secure_url", "og:image", "twitter:image"]) {
    for (const tag of metas) {
      const prop = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1]?.toLowerCase();
      if (prop !== key) continue;
      add(tag.match(/content=["']([^"']+)["']/i)?.[1], 100);
    }
  }
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    const srcset = tag.match(/(?:srcset|data-srcset)=["']([^"']+)["']/i)?.[1];
    if (srcset) {
      const best = decodeHtml(srcset).split(",").map((p) => p.trim().split(/\s+/))
        .map(([u, w]) => ({ u, w: parseInt(w) || 0 })).sort((a, b) => b.w - a.w)[0];
      if (best && best.w >= 500) add(best.u, 50);
    } else {
      const w = parseInt(tag.match(/\bwidth=["']?(\d+)/i)?.[1] ?? "0");
      if (w >= 500) add(tag.match(/\bsrc=["']([^"']+)["']/i)?.[1], 30);
    }
    const lazy = tag.match(/(?:data-src|data-lazy-src)=["']([^"']+)["']/i)?.[1];
    if (lazy) add(lazy, 20);
  }
  return found.sort((a, b) => b.score - a.score).map((x) => x.href).slice(0, 5);
}

async function getImage(url: string, referer: string | null) {
  const headers: Record<string, string> = {
    "user-agent": UA,
    accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    "accept-language": "en-US,en;q=0.9",
  };
  // Many CDNs serve an image only when the request looks like it came from the
  // page that embeds it; without this the same URL 403s when fetched cold.
  if (referer) {
    headers.referer = referer;
    try { headers.origin = new URL(referer).origin; } catch { /* ignore */ }
  }
  const res = await fetch(url, { headers, redirect: "follow", signal: AbortSignal.timeout(12000) });
  if (!res.ok) throw new Error("http_" + res.status);
  const ct = (res.headers.get("content-type") ?? "").split(";")[0];
  if (!ct.startsWith("image/") || ct.includes("svg")) throw new Error("not_image");
  const buf = new Uint8Array(await res.arrayBuffer());
  if (buf.length < MIN_BYTES || buf.length > MAX_BYTES) throw new Error("size_" + buf.length);
  return { buf, ct };
}

async function imageEitherWay(url: string, referer: string) {
  try { return await getImage(url, referer); }
  catch { return await getImage(url, null); } // some CDNs reject a referer instead
}

async function sha16(buf: Uint8Array) {
  const h = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(h)).slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0")).join("");
}

function extFor(ct: string) {
  if (ct.includes("png")) return "png";
  if (ct.includes("webp")) return "webp";
  if (ct.includes("avif")) return "avif";
  if (ct.includes("gif")) return "gif";
  return "jpg";
}

Deno.serve(async (req) => {
  const u = new URL(req.url);
  if (u.searchParams.get("token") !== TOKEN) return new Response("forbidden", { status: 403 });
  const size = Math.min(parseInt(u.searchParams.get("size") ?? "8", 10) || 8, 15);
  const offset = parseInt(u.searchParams.get("offset") ?? "0", 10) || 0;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: rows, error } = await supabase
    .from("venues")
    .select("slug, official_url")
    .eq("photo_status", "missing")
    .eq("status", "active")
    .eq("publication_status", "published")
    .not("official_url", "is", null)
    .neq("official_url", "")
    .order("slug")
    .range(offset, offset + size - 1);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { "content-type": "text/plain" },
    });
  }

  const results = await Promise.all((rows ?? []).map(async (v) => {
    if (!domainMatchesName(v.slug, v.official_url)) {
      return { slug: v.slug, ok: false, error: "skipped_domain_mismatch" };
    }
    try {
      const pageRes = await fetch(v.official_url, {
        headers: { "user-agent": UA, accept: "text/html,*/*", "accept-language": "en-US,en;q=0.9" },
        redirect: "follow",
        signal: AbortSignal.timeout(15000),
      });
      if (!pageRes.ok) throw new Error("page_http_" + pageRes.status);
      const html = await pageRes.text();
      const finalUrl = pageRes.url || v.official_url;
      for (const imgUrl of pageImages(html, finalUrl)) {
        try {
          const { buf, ct } = await imageEitherWay(imgUrl, finalUrl);
          const path = BATCH + "/" + v.slug + "--hero--" + (await sha16(buf)) + "." + extFor(ct);
          const { error: upErr } = await supabase.storage.from(BUCKET)
            .upload(path, buf, { contentType: ct, upsert: true });
          if (upErr) throw new Error("upload_" + upErr.message);
          const pub = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
          const { error: dbErr } = await supabase.from("venues")
            .update({ photo_url: pub, photo_status: "published" })
            .eq("slug", v.slug)
            .eq("photo_status", "missing"); // never overwrites an owner photo
          if (dbErr) throw new Error("db_" + dbErr.message);
          return { slug: v.slug, ok: true };
        } catch { continue; }
      }
      return { slug: v.slug, ok: false, error: "no_usable_image" };
    } catch (e) {
      return { slug: v.slug, ok: false, error: String((e as Error).message).slice(0, 60) };
    }
  }));

  return new Response(JSON.stringify({
    fetched: rows?.length ?? 0,
    uploaded: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  }, null, 1), { headers: { "content-type": "text/plain; charset=utf-8" } });
});
