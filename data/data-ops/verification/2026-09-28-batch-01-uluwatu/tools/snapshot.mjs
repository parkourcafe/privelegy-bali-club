#!/usr/bin/env node
// Fetches one official source page and stores a snapshot the acceptance
// pipeline can verify quotes against.
//
//   node snapshot.mjs <slug> <url> [--force]
//
// Writes <batch>/snapshots/<slug>/<sha1-of-url>.{html|pdf|bin} plus
// <sha1>.txt (visible text) and appends a line to snapshots/<slug>/index.jsonl:
//   {url, finalUrl, status, contentType, sha256, textSha256, bytes, fetchedAt, file, textFile, method}
// Prints the index line and the first 6000 characters of the extracted text.
//
// Sources that block scripted fetches (401/403/429, TLS failure through the
// audit proxy) are recorded with method "blocked" so the claim can be held,
// never guessed. No JavaScript is executed; nothing is posted.

import { createHash } from "node:crypto";
import { mkdir, writeFile, appendFile, readFile } from "node:fs/promises";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const BATCH = resolve(HERE, "..");
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 OtherBaliVerification/2026-09-28";
const TIMEOUT_MS = 30_000;
const sha = (algo, d) => createHash(algo).update(d).digest("hex");

export function htmlToText(html) {
  let s = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>|<!--[\s\S]*?-->/gi, " ");
  s = s.replace(/<(br|\/p|\/div|\/li|\/h[1-6]|\/tr|\/section|\/article|\/dd|\/dt|\/td|\/th)\b[^>]*>/gi, "\n");
  s = s.replace(/<[^>]+>/g, " ");
  s = s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
  return s.replace(/[ \t\r\f\v]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();
}

// pdftotext is not installed in the audit container; pdfminer.six is installed
// into a scratch directory (PYTHONPATH) and used through python3.
function pdfToText(file) {
  const r = spawnSync("pdftotext", ["-layout", file, "-"], { encoding: "utf8" });
  if (r.status === 0) return r.stdout;
  const py = spawnSync("python3", ["-c", "import sys; from pdfminer.high_level import extract_text; sys.stdout.write(extract_text(sys.argv[1]))", file], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (py.status === 0) return py.stdout;
  return null;
}

async function fetchChain(url) {
  const chain = [];
  let current = url;
  for (let hop = 0; hop <= 6; hop += 1) {
    const res = await fetch(current, { redirect: "manual", headers: { "user-agent": UA, accept: "text/html,application/pdf,*/*;q=0.8", "accept-language": "en" }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    const loc = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && loc) {
      await res.arrayBuffer().catch(() => null);
      chain.push({ url: current, status: res.status });
      current = new URL(loc, current).toString();
      continue;
    }
    return { res, finalUrl: current, chain };
  }
  throw new Error("too_many_redirects");
}

async function main() {
  const [slug, url, ...rest] = process.argv.slice(2);
  if (!slug || !url) {
    console.error("usage: snapshot.mjs <slug> <url> [--force] [--root <snapshots-dir-name>]");
    process.exit(2);
  }
  // Acceptors re-fetch into their own root so their evidence never mixes with the collector's.
  const rootIdx = rest.indexOf("--root");
  const root = rootIdx >= 0 ? rest[rootIdx + 1] : "snapshots";
  const dir = join(BATCH, root, slug);
  await mkdir(dir, { recursive: true });
  const key = sha("sha1", url).slice(0, 16);
  const indexPath = join(dir, "index.jsonl");
  if (!rest.includes("--force")) {
    try {
      const existing = (await readFile(indexPath, "utf8")).split("\n").filter(Boolean).map((l) => JSON.parse(l)).find((e) => e.url === url && e.textFile);
      if (existing) {
        console.log(JSON.stringify({ ...existing, cached: true }));
        console.log("-----");
        console.log((await readFile(join(dir, existing.textFile), "utf8")).slice(0, 6000));
        return;
      }
    } catch {
      /* no index yet */
    }
  }
  let entry;
  try {
    const { res, finalUrl, chain } = await fetchChain(url);
    const body = Buffer.from(await res.arrayBuffer());
    const ct = res.headers.get("content-type") ?? "";
    const isPdf = /pdf/i.test(ct) || body.subarray(0, 5).toString() === "%PDF-";
    const isImage = /^image\//i.test(ct);
    const ext = isPdf ? "pdf" : isImage ? (ct.split("/")[1] ?? "bin").split(";")[0] : /html|xml|text/i.test(ct) ? "html" : "bin";
    const file = `${key}.${ext}`;
    await writeFile(join(dir, file), body);
    let text = null;
    if (ext === "html") text = htmlToText(body.toString("utf8"));
    else if (ext === "pdf") text = pdfToText(join(dir, file));
    let textFile = null;
    if (text !== null) {
      textFile = `${key}.txt`;
      await writeFile(join(dir, textFile), text);
    }
    const blocked = [401, 403, 407, 429, 451].includes(res.status);
    entry = { slug, url, finalUrl, chain, status: res.status, contentType: ct, bytes: body.length, sha256: sha("sha256", body), textSha256: text !== null ? sha("sha256", text) : null, fetchedAt: new Date().toISOString(), file, textFile, method: blocked ? "blocked" : "curl-like fetch", note: isImage ? "image: transcribe only what is visually legible; keep the file as the source" : ext === "pdf" && text === null ? "pdf text extraction unavailable" : null };
  } catch (error) {
    entry = { slug, url, status: 0, error: String(error?.cause?.code ?? error?.message ?? error), fetchedAt: new Date().toISOString(), method: "blocked" };
  }
  await appendFile(indexPath, JSON.stringify(entry) + "\n");
  console.log(JSON.stringify(entry));
  console.log("-----");
  if (entry.textFile) console.log((await readFile(join(dir, entry.textFile), "utf8")).slice(0, 6000));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
