import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./OtherBaliLogo.tsx", import.meta.url), "utf8");

test("OtherBaliLogo names the brand once for assistive tech", () => {
  assert.match(source, /aria-label="Other Bali"/);
  // The old markup paired aria-label with a full sr-only "Other Bali", which
  // sat next to the visible "THER BALI" glyphs.
  assert.doesNotMatch(source, /className="sr-only">Other Bali<\/span>/);
});

test("OtherBaliLogo treats the visual O-ring as decorative", () => {
  assert.match(source, /aria-hidden="true"[\s\S]*borderRadius: "50%"/);
  assert.match(source, /aria-hidden="true"[\s\S]*THER&nbsp;BALI/);
});

// The regression this file exists for: a crawler or AI extractor that ignores
// CSS and aria-hidden reads raw text nodes in order. The ring draws the leading
// O, so without a hidden "O" the page yields "THER BALI", and with a full
// sr-only brand name it yields "Other BaliTHER BALI". Either way the extracted
// brand is wrong.
test("the rendered text nodes concatenate to exactly OTHER BALI", () => {
  // JSX text nodes, in source order. Spans may put their text on its own line.
  const textNodes = [...source.matchAll(/>\s*([A-Za-z][^<>{}]*?)\s*</g)].map((m) => m[1]);

  const textContent = textNodes.join("").replace(/&nbsp;/g, " ");
  assert.equal(textContent, "OTHER BALI");
});
