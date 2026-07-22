import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(`${process.cwd()}/package.json`);
const puppeteer = require("puppeteer-core");

const baseUrl = process.argv[2] || "http://127.0.0.1:3002";
const outFile =
  process.argv[3] ||
  "docs/wave4-homepage-evidence/mobile-release-quality/mobile-geometry.json";
const chromePath =
  process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const breakpoints = [320, 360, 375, 390, 412, 430, 568, 640, 768, 844, 1024];
const sweep = [];
for (let width = 320; width <= 1024; width += 8) sweep.push(width);
for (const point of breakpoints) {
  if (point >= 320 && point <= 1024) {
    sweep.push(point - 1, point, point + 1);
  }
}
const widths = [...new Set(sweep.filter((n) => n >= 320 && n <= 1024))].sort(
  (a, b) => a - b,
);

const namedViewports = [
  [320, 568],
  [360, 800],
  [375, 667],
  [390, 844],
  [412, 915],
  [430, 932],
  [568, 320],
  [844, 390],
  [768, 1024],
  [1024, 768],
  [1280, 800],
  [1440, 900],
];

fs.mkdirSync(outFile.split("/").slice(0, -1).join("/"), { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function measure(width, height, label, options = {}) {
  const isMobile = options.isMobile ?? false;
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile, hasTouch: isMobile });
  const response = await page.goto(`${baseUrl}/`, { waitUntil: "networkidle2", timeout: 30000 });
  await page.evaluate(() => document.fonts?.ready);
  const result = await page.evaluate((label) => {
    const root = document.documentElement;
    const body = document.body;
    const main = document.querySelector("main");
    const header = document.querySelector(".ob-site-header");
    const bottomNav = document.querySelector(".ob-mobile-nav");
    const sections = [...document.querySelectorAll("main > section")].map((section, index) => {
      const r = section.getBoundingClientRect();
      return {
        index,
        width: r.width,
        left: r.left,
        right: r.right,
        passMobileWidth:
          window.innerWidth > 430 ||
          (r.width >= window.innerWidth - 48 && r.left >= -1 && r.right <= window.innerWidth + 1),
      };
    });
    const cards = [...document.querySelectorAll("main a, main button")]
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80), width: r.width, height: r.height };
      })
      .filter((item) => item.width > 0 && item.height > 0);
    const mainRect = main?.getBoundingClientRect();
    const h1 = document.querySelector("h1")?.getBoundingClientRect();
    const ctas = [...document.querySelectorAll('main a[href="#moments"], main a[href="/plan"]')].map((el) => {
      const r = el.getBoundingClientRect();
      return { text: el.textContent.trim(), top: r.top, bottom: r.bottom, width: r.width, height: r.height };
    });
    return {
      label,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      visualViewportWidth: window.visualViewport?.width ?? null,
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      bodyScrollWidth: body.scrollWidth,
      main: mainRect ? { left: mainRect.left, right: mainRect.right, width: mainRect.width } : null,
      header: header ? { ...Object.fromEntries(["top", "bottom", "height"].map((k) => [k, header.getBoundingClientRect()[k]])) } : null,
      bottomNav: bottomNav ? { ...Object.fromEntries(["top", "bottom", "height"].map((k) => [k, bottomNav.getBoundingClientRect()[k]])) } : null,
      h1: h1 ? { top: h1.top, bottom: h1.bottom, width: h1.width, height: h1.height } : null,
      ctas,
      footerTop: document.querySelector("footer")?.getBoundingClientRect().top ?? null,
      noOverflow: root.scrollWidth <= root.clientWidth + 1,
      mainNotCollapsed: !!mainRect && mainRect.width >= Math.min(window.innerWidth - 2, 318),
      fullWidthCardsOk:
        window.innerWidth !== 320 ||
        cards.filter((c) => c.width >= 250).some((c) => c.width >= 272),
      sectionsMobileWidthOk: sections.every((section) => section.passMobileWidth),
      sections,
    };
  }, label);
  const screenshot = outFile.replace(/\.json$/, `-${label}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  await page.close();
  return { status: response?.status(), screenshot, ...result };
}

const results = [];
for (const width of widths) {
  results.push(await measure(width, 900, `sweep-${width}`));
}
for (const [width, height] of namedViewports) {
  results.push(await measure(width, height, `${width}x${height}`));
  if (width <= 844) {
    results.push(await measure(width, height, `${width}x${height}-mobile-emulation`, { isMobile: true }));
  }
}

await browser.close();

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  summary: {
    checked: results.length,
    failures: results.filter(
      (r) => !r.noOverflow || !r.mainNotCollapsed || !r.fullWidthCardsOk || !r.sectionsMobileWidthOk,
    ).length,
  },
  failures: results.filter(
    (r) => !r.noOverflow || !r.mainNotCollapsed || !r.fullWidthCardsOk || !r.sectionsMobileWidthOk,
  ),
  results,
};

fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report.summary, null, 2));
