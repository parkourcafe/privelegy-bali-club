import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./OtherBaliLogo.tsx", import.meta.url), "utf8");

test("OtherBaliLogo exposes the complete brand name to assistive tech", () => {
  assert.match(source, /aria-label="OTHER BALI"/);
  assert.match(source, /className="sr-only">Other Bali<\/span>/);
});

test("OtherBaliLogo treats the visual O-ring as decorative", () => {
  assert.match(source, /aria-hidden="true"[\s\S]*borderRadius: "50%"/);
  assert.match(source, /aria-hidden="true"[\s\S]*THER&nbsp;BALI/);
});
