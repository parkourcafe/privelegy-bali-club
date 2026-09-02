import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const root = fileURLToPath(new URL("..", import.meta.url));
const SEARCH_ROOTS = ["app", "components", "lib"];

async function sourceFiles() {
  const found = [];
  async function walk(dir) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".next") continue;
        await walk(full);
      } else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
        found.push(full);
      }
    }
  }
  for (const dir of SEARCH_ROOTS) await walk(path.join(root, dir));
  return found;
}

const files = await Promise.all(
  (await sourceFiles()).map(async (file) => ({
    path: path.relative(root, file),
    source: await readFile(file, "utf8"),
  })),
);

const stripComments = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "").replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

// A page carried two BreadcrumbList nodes whenever it built its own JSON-LD and
// also rendered <Breadcrumbs>, which emits the same node beside the visible
// trail. Duplicate breadcrumb markup is a structured-data error, and the fix has
// to hold: the shape is easy to paste back in.
test("a page emits at most one BreadcrumbList", () => {
  const offenders = files
    .filter(({ source }) => {
      const code = stripComments(source);
      return code.includes("<Breadcrumbs") && code.includes('"@type": "BreadcrumbList"');
    })
    .map(({ path: p }) => p);

  assert.deepEqual(
    offenders,
    [],
    "these render <Breadcrumbs> (which emits BreadcrumbList) and emit a second one:\n" + offenders.join("\n"),
  );
});

test("Breadcrumbs remains the shared emitter", async () => {
  const breadcrumbs = files.find((f) => f.path === path.join("components", "Breadcrumbs.tsx"));
  assert.ok(breadcrumbs, "components/Breadcrumbs.tsx must exist");
  assert.match(breadcrumbs.source, /"@type": "BreadcrumbList"/);
});

// Guardrail #11 / AGENTS.md §11: availability, confirmation and fulfilment
// belong to the partner. /about tells readers we do not confirm live
// availability, and the Offer markup used to assert InStock unconditionally.
test("no structured data claims live availability", () => {
  const offenders = files
    .filter(({ source }) => /schema\.org\/(InStock|LimitedAvailability|PreOrder|InStoreOnly)/.test(stripComments(source)))
    .map(({ path: p }) => p);

  assert.deepEqual(
    offenders,
    [],
    "availability is the provider's to state, never ours:\n" + offenders.join("\n"),
  );
});
