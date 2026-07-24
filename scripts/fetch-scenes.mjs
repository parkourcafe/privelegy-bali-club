// Fetch the generated cinematic scene set (Higgsfield, 2026-07-11 premium
// pass) and optimize into public/scenes/*.webp. Runs as prebuild — on
// networks where the CDN is unreachable (e.g. the CI sandbox) it exits
// quietly and the landing falls back to its SVG scene art, so this never
// breaks a build.
//
// These are generated atmospheric or explicitly illustrative scenario scenes.
// The original mood set contains no people or text; later scenario collages may
// contain faceless graphic silhouettes, but never identifiable people or baked
// text. They must never be presented as photos of a specific real venue.
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
  // Homepage DecisionDemo editorial collages (Higgsfield Nano Banana Pro,
  // 2026-07-24). These are explicitly labelled as illustrative scenarios in
  // the UI and must never be reused as factual venue or district photography.
  "home-first-day": ["hf_20260724_061745_ac5c6e1f-efa4-4d3f-a802-06733591a584.png", 1440],
  "home-sunset": ["hf_20260724_061851_5173ca20-ac62-4e93-809f-7b7afb043bd6.png", 1440],
  "home-with-kids": ["hf_20260724_061853_ef37af54-d33a-4d1b-9843-2ce514989add.png", 1440],
  "home-rainy-day": ["hf_20260724_061855_939211e7-fcba-4b82-bde9-7d25aefc406e.png", 1440],
  "home-romantic": ["hf_20260724_061857_eb9525ef-e7c8-436a-a140-0dd0634b0e23.png", 1440],
  "home-trip-lengths": ["hf_20260724_061858_4a22f700-0b40-46b7-933d-0266c0f40c81.png", 1440],
  // District mood stills (Higgsfield soul_cinematic, 2026-07-15 pass) for the
  // "Around Bali" cards — one distinct atmospheric scene per district, same
  // warm film grade as the rest of the set. Mood imagery of the AREA only;
  // never presented as a photo of a specific venue.
  "district-canggu": ["hf_20260715_012158_ead7e284-6553-4777-9844-786a11d42f51.png", 1200],
  "district-ubud": ["hf_20260715_012200_48552dce-e77d-44ad-84f8-f30263de010e.png", 1200],
  "district-seminyak": ["hf_20260715_012202_3f4ff508-69d2-492a-9d87-fd41f5cceee6.png", 1200],
  "district-kuta-legian": ["hf_20260715_012204_fc4a9776-1d94-4171-8c2c-be0a89c52426.png", 1200],
  "district-jimbaran": ["hf_20260715_012205_f9e2b9ad-b8c1-4a46-9644-a994e489d389.png", 1200],
  "district-uluwatu-bukit": ["hf_20260715_012214_8ac42e15-2407-4d11-b319-e0cd3d3d5149.png", 1200],
  "district-nusa-dua": ["hf_20260715_012215_b2745749-466d-4c05-b0c3-60059ce91438.png", 1200],
  "district-sanur": ["hf_20260715_012217_2b58a942-2c8c-41c8-90bc-e00c61eb6627.png", 1200],
  "district-sidemen": ["hf_20260715_012219_bcbeaeb5-0b6a-4959-ad82-8eb1fee06a60.png", 1200],
  "district-amed": ["hf_20260715_012220_f8fddf2c-e293-4207-bdae-f395b449ef97.png", 1200],
  "district-munduk": ["hf_20260715_012228_3f3158c9-907b-4470-93af-09d422e5884a.png", 1200],
  "district-lovina": ["hf_20260715_012230_8eb60a5a-309d-48a2-9f55-4e316ecdc356.png", 1200],
  "district-nusa-islands": ["hf_20260715_012231_1e69b197-86fd-427f-8776-078b9bc34c63.png", 1200],
  "district-gili-islands": ["hf_20260715_012233_311e6d57-382e-4ff2-8f8d-fab56af2ec1e.png", 1200],
  "district-lombok": ["hf_20260715_012234_ef0c9b5a-cdfe-4bd6-8449-d80231636d37.png", 1200],
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
  // /for-venues narrated story (2026-07-17): three Seedance 2.0 b-roll blocks
  // assembled with a voiceover + burned subtitles via Higgsfield explainer.
  // Click-to-play with preload="metadata", so the budget guards disk/CDN cost,
  // not page weight — bytes stream only when an owner presses play.
  // v2 (2026-07-17): livelier conversational voiceover per founder feedback.
  "venues-story": ["hf_20260717_120511_9f1a17d0-ff54-4b3e-ae18-fdf1c3bd764c.mp4", 30_000_000],
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
    const quality = name.startsWith("home-") ? 72 : 78;
    await sharp(buf)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(target);
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
