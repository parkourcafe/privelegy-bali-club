// Fetch the generated cinematic scene set (Higgsfield, 2026-07-11 premium
// pass) and optimize into public/scenes/*.webp. Runs as prebuild — on
// networks where the CDN is unreachable (e.g. the CI sandbox) it exits
// quietly and the landing falls back to its SVG scene art, so this never
// breaks a build.
//
// These are generated atmospheric scenes (no people, no text). Editorial rule:
// they are mood imagery and must never be presented as photos of a specific
// real venue. One shared warm film grade across the set — the site should
// read as if shot as one film.
import { existsSync, mkdirSync, statSync, writeFileSync } from "fs";
import path from "path";

const BASE = "https://d8j0ntlcm91z4.cloudfront.net/user_3EKntK4EDjG8nay4H1dy1TK30mB";
const OUT = path.join(process.cwd(), "public", "scenes");

// name -> [sourceFile, targetWidth]
const SCENES = {
  "hero-sunset": ["hf_20260711_160523_1f62f446-1177-49a6-895f-dcaf7c941bc1.png", 1920],
  "moment-morning": ["hf_20260711_160526_f6618075-f97c-4d12-b834-76636946d57b.png", 1200],
  "moment-warung": ["hf_20260711_160528_5a8f9459-f167-4793-817c-714c25107f3a.png", 1200],
  "moment-goldenhour": ["hf_20260711_160531_33959ad1-f6ca-48e3-be60-9b09df36ed7e.png", 1200],
  "moment-dinner": ["hf_20260711_160538_4118293a-66fa-4ff6-a81f-9947ddfd07dc.png", 1200],
  "human-dusk": ["hf_20260711_160539_124f0320-4eb3-49a9-8afb-b1e118c86255.png", 1920],
};

// One short muted hero loop (silent). Hard 3MB gate: if the file is bigger
// than the mobile performance budget, it is NOT shipped and the hero keeps
// its Ken Burns poster — that fallback is by design, not an error.
// NOTE (2026-07-14): public/scenes/hero-loop.mp4 (and ubud-dawn-loop.mp4)
// are now committed, ffmpeg-compressed assets (~0.9MB) from the golden-hour
// ocean generation d9e5803a — this entry is only the CDN fallback if the
// committed file is ever deleted (the raw source below is over budget and
// will be rejected by the gate; recompress before shipping).
const VIDEOS = {
  "hero-loop": ["hf_20260714_150931_d9e5803a-59d4-44e1-9ced-7a79716ae585.mp4", 3_000_000],
};

mkdirSync(OUT, { recursive: true });

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("scenes: sharp is not installed; SVG fallback will render");
  process.exit(0);
}

let ok = 0;
let skipped = 0;
for (const [name, [file, width]] of Object.entries(SCENES)) {
  const target = path.join(OUT, `${name}.webp`);
  if (existsSync(target)) {
    skipped++;
    continue;
  }
  try {
    const res = await fetch(`${BASE}/${file}`, { signal: AbortSignal.timeout(30_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf).resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(target);
    ok++;
    console.log(`scenes: fetched ${name}.webp`);
  } catch (e) {
    console.warn(`scenes: skipped ${name} (${e.message ?? e}) — SVG fallback will render`);
  }
}

for (const [name, [file, maxBytes]] of Object.entries(VIDEOS)) {
  const target = path.join(OUT, `${name}.mp4`);
  if (existsSync(target)) {
    if (statSync(target).size <= maxBytes) {
      skipped++;
      continue;
    }
    // never leave an over-budget file lying around from an earlier run
  }
  try {
    const res = await fetch(`${BASE}/${file}`, { signal: AbortSignal.timeout(45_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > maxBytes) {
      console.warn(
        `scenes: ${name}.mp4 is ${(buf.byteLength / 1e6).toFixed(1)}MB > ${(maxBytes / 1e6).toFixed(0)}MB budget — not shipped, Ken Burns poster stays`
      );
      continue;
    }
    writeFileSync(target, buf);
    ok++;
    console.log(`scenes: fetched ${name}.mp4 (${(buf.byteLength / 1e6).toFixed(1)}MB)`);
  } catch (e) {
    console.warn(`scenes: skipped ${name} (${e.message ?? e}) — Ken Burns poster stays`);
  }
}
console.log(`scenes: ${ok} fetched, ${skipped} already present`);
