// Build the Other Bali app-icon set from one master mark. Two saved variants:
//
//   golden     — the "O" of Other Bali as a brass ring framing a golden-hour
//                sun over the ocean. THE LIVE FAVICON (default).
//   frangipani — the plumeria worn behind every Balinese ear, cream-gold on
//                espresso. Kept ready in case we switch later.
//
// One SVG source → favicon.ico (16/32/48), the SVG icon, PWA 192/512, a
// safe-zone maskable 512 and the Apple touch icon. No external deps: sharp
// rasterizes, and a tiny packer writes the .ico.
//
//   node scripts/build-icons.mjs             # golden (current, live)
//   node scripts/build-icons.mjs frangipani  # switch to the flower, then commit
import { writeFileSync } from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const p = (...a) => path.join(ROOT, ...a);

// ── Variant: golden — the "O" + sunset (LIVE) ─────────────────────
const GOLDEN = {
  defs: `
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241a12"/><stop offset="1" stop-color="#15100b"/></linearGradient>
    <linearGradient id="ring" x1="0.12" y1="0.08" x2="0.9" y2="0.96"><stop offset="0" stop-color="#f3d59b"/><stop offset="0.46" stop-color="#d3a55f"/><stop offset="1" stop-color="#a5793b"/></linearGradient>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38210f"/><stop offset="0.60" stop-color="#8a542a"/><stop offset="1" stop-color="#ecc588"/></linearGradient>
    <radialGradient id="sun" cx="50%" cy="44%" r="62%"><stop offset="0" stop-color="#fdefc9"/><stop offset="55%" stop-color="#f4d193"/><stop offset="100%" stop-color="#e2ba79"/></radialGradient>
    <clipPath id="disc"><circle cx="256" cy="256" r="119"/></clipPath>`,
  mark: `
    <g clip-path="url(#disc)">
      <rect x="118" y="118" width="276" height="276" fill="url(#sky)"/>
      <circle cx="256" cy="286" r="62" fill="url(#sun)"/>
      <rect x="118" y="300" width="276" height="94" fill="#b9863f" opacity="0.5"/>
      <g fill="#fbe6b6">
        <rect x="210" y="316" width="92" height="9" rx="4" opacity="0.85"/>
        <rect x="194" y="337" width="124" height="8" rx="4" opacity="0.52"/>
        <rect x="182" y="357" width="148" height="7" rx="3.5" opacity="0.3"/>
      </g>
    </g>
    <circle cx="256" cy="256" r="146" fill="none" stroke="url(#ring)" stroke-width="58"/>
    <path d="M172 136 A146 146 0 0 1 340 136" fill="none" stroke="#ffe9bd" stroke-width="9" stroke-linecap="round" opacity="0.45"/>`,
};

// ── Variant: frangipani — the plumeria (SAVED, not live) ──────────
const PETAL =
  "M256 256 C 226 232 210 188 224 146 C 234 116 262 108 286 126 C 306 142 304 196 286 230 C 278 244 268 252 256 256 Z";
const FRANGIPANI = {
  defs: `
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241a12"/><stop offset="1" stop-color="#15100b"/></linearGradient>
    <radialGradient id="fglow" cx="50%" cy="46%" r="60%"><stop offset="0" stop-color="#e2ba79" stop-opacity="0.42"/><stop offset="100%" stop-color="#c69a5c" stop-opacity="0"/></radialGradient>
    <radialGradient id="fpetal" cx="50%" cy="46%" r="64%"><stop offset="0" stop-color="#fbeecb"/><stop offset="50%" stop-color="#f3e3cb"/><stop offset="100%" stop-color="#e6d2ad"/></radialGradient>
    <radialGradient id="fthroat" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#f8d98d"/><stop offset="100%" stop-color="#dcac60"/></radialGradient>`,
  mark: `
    <rect width="512" height="512" fill="url(#fglow)"/>
    <g fill="url(#fpetal)">
      <path d="${PETAL}"/>
      <path d="${PETAL}" transform="rotate(72 256 256)"/>
      <path d="${PETAL}" transform="rotate(144 256 256)"/>
      <path d="${PETAL}" transform="rotate(216 256 256)"/>
      <path d="${PETAL}" transform="rotate(288 256 256)"/>
    </g>
    <circle cx="256" cy="256" r="42" fill="url(#fthroat)"/>
    <circle cx="256" cy="256" r="19" fill="#c58f45"/>`,
};


// ── Variant: final — approved light system (O-ring + clay dot on paper) ──
const FINAL = {
  defs: `
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFBF3"/><stop offset="1" stop-color="#FAF6EF"/></linearGradient>`,
  mark: `
    <circle cx="256" cy="256" r="132" fill="none" stroke="#2B1A13" stroke-width="42"/>
    <circle cx="256" cy="256" r="44" fill="#C4623F"/>`,
};

const VARIANTS = { golden: GOLDEN, frangipani: FRANGIPANI, final: FINAL };
const NAME = process.argv[2] || process.env.ICON_VARIANT || "golden";
const V = VARIANTS[NAME];
if (!V) {
  console.error(`Unknown icon variant "${NAME}". Use: ${Object.keys(VARIANTS).join(" | ")}`);
  process.exit(1);
}

const svg = (inner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><defs>${V.defs}</defs>${inner}</svg>`;

const TILE = svg(`<rect width="512" height="512" rx="116" fill="url(#tile)"/>${V.mark}`);
const MASK = svg(
  `<rect width="512" height="512" fill="#15100b"/>` +
    `<g transform="translate(256 256) scale(0.8) translate(-256 -256)">${V.mark}</g>`
);

// Tiny ICO packer — embeds PNG frames (Vista+ PNG-in-ICO).
function pngToIco(frames) {
  const count = frames.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  const dir = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  frames.forEach((f, i) => {
    const b = i * 16;
    dir.writeUInt8(f.size >= 256 ? 0 : f.size, b + 0);
    dir.writeUInt8(f.size >= 256 ? 0 : f.size, b + 1);
    dir.writeUInt8(0, b + 2);
    dir.writeUInt8(0, b + 3);
    dir.writeUInt16LE(1, b + 4);
    dir.writeUInt16LE(32, b + 6);
    dir.writeUInt32LE(f.data.length, b + 8);
    dir.writeUInt32LE(offset, b + 12);
    offset += f.data.length;
  });
  return Buffer.concat([header, dir, ...frames.map((f) => f.data)]);
}

async function png(source, size) {
  return sharp(Buffer.from(source), { density: 512 })
    .resize(size, size, { fit: "cover" })
    .png()
    .toBuffer();
}

writeFileSync(p("app", "icon.svg"), TILE);
writeFileSync(p("public", "icon-maskable.svg"), MASK);
writeFileSync(p("public", "icon-192.png"), await png(TILE, 192));
writeFileSync(p("public", "icon-512.png"), await png(TILE, 512));
writeFileSync(p("public", "icon-maskable-512.png"), await png(MASK, 512));
writeFileSync(p("public", "apple-touch-icon.png"), await png(TILE, 180));

const frames = [];
for (const size of [16, 32, 48]) frames.push({ size, data: await png(TILE, size) });
writeFileSync(p("app", "favicon.ico"), pngToIco(frames));

console.log(`icons: built the "${NAME}" set (favicon.ico, icon.svg, PWA 192/512, maskable, apple-touch)`);
