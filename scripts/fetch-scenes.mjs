// Fetch the generated cinematic scene set (Higgsfield, 2026-07-10) and
// optimize into public/scenes/*.webp. Runs as prebuild — on networks where the
// CDN is unreachable (e.g. the CI sandbox) it exits quietly and the landing
// falls back to its SVG scene art, so this never breaks a build.
//
// These are generated atmospheric scenes (no people, no text). Editorial rule:
// they are mood imagery and must never be presented as photos of a specific
// real venue.
import { existsSync, mkdirSync } from "fs";
import path from "path";
import sharp from "sharp";

const BASE = "https://d8j0ntlcm91z4.cloudfront.net/user_3EKntK4EDjG8nay4H1dy1TK30mB";
const OUT = path.join(process.cwd(), "public", "scenes");

// name -> [sourceFile, targetWidth]
const SCENES = {
  "hero-sunset": ["hf_20260710_164730_9d5d403c-7b23-41a5-929a-6058b6849506.png", 1920],
  "moment-morning": ["hf_20260710_164733_ee2e2e80-985a-4f7e-9eaf-13cc39b54938.png", 1200],
  "moment-warung": ["hf_20260710_164736_6a870a1f-a7b4-4cba-8809-f4faf2f4d290.png", 1200],
  "moment-goldenhour": ["hf_20260710_164738_9709f80a-0bfd-4e71-8c15-75437f078907.png", 1200],
  "moment-dinner": ["hf_20260710_164741_ef8eb1d4-2077-453a-9c42-0227bdf760b7.png", 1200],
  "human-dusk": ["hf_20260710_164743_d0044569-1d0c-4d50-a3e6-c231617bdf38.png", 1920],
};

mkdirSync(OUT, { recursive: true });

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
console.log(`scenes: ${ok} fetched, ${skipped} already present`);
