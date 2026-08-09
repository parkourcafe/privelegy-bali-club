// Every literal internal link must lead somewhere.
//
// Two real incidents drive this test. /hotels and /villas shipped and sat in
// the sitemap linked from nowhere — an orphan state invisible to every test
// that only checks whether a page renders. And the audit of 2026-08-09 first
// declared /together nonexistent because its checker only looked at
// app/**/page.tsx, when the page is served from public/together/index.html —
// routes live in app/, in public/, and in rewrites, and a link check that
// covers one surface lies about the other two.
//
// Scope: literal string hrefs in app/ and components/. Template-built hrefs
// (`/places/${slug}`) are runtime data and are covered by their own gates.
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      yield* walk(join(dir, entry.name));
    } else {
      yield join(dir, entry.name);
    }
  }
}

const hrefs = new Set();
for (const dir of ["app", "components"]) {
  for (const file of walk(join(ROOT, dir))) {
    if (!/\.tsx?$/.test(file) || /\.test\./.test(file)) continue;
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(/href[:=]\s*["'](\/[A-Za-z0-9\-_/]*)["']/g)) {
      hrefs.add(m[1]);
    }
  }
}

// App route table with (group) segments flattened and dynamic segments kept.
const routes = [];
(function collect(dir, segs) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(dir, entry.name);
    const next =
      entry.name.startsWith("(") && entry.name.endsWith(")")
        ? segs
        : [...segs, entry.name];
    if (existsSync(join(path, "page.tsx")) || existsSync(join(path, "route.ts"))) {
      routes.push(next);
    }
    collect(path, next);
  }
})(join(ROOT, "app"), []);

function matchesAppRoute(parts) {
  return routes.some((route) => {
    const last = route[route.length - 1] ?? "";
    if (last.startsWith("[...")) {
      if (parts.length < route.length - 1) return false;
      return route
        .slice(0, -1)
        .every((seg, i) => seg.startsWith("[") || seg === parts[i]);
    }
    if (route.length !== parts.length) return false;
    return route.every((seg, i) => seg.startsWith("[") || seg === parts[i]);
  });
}

function servedFromPublic(parts) {
  const path = join(ROOT, "public", ...parts);
  if (existsSync(path)) {
    return statSync(path).isFile() || existsSync(join(path, "index.html"));
  }
  return existsSync(`${path}.html`);
}

test("every literal internal href resolves to an app route or a public file", () => {
  const missing = [];
  for (const href of [...hrefs].sort()) {
    const clean = href.split(/[?#]/)[0];
    if (clean === "/" || clean === "") continue;
    const parts = clean.slice(1).split("/").filter(Boolean);
    if (matchesAppRoute(parts)) continue;
    if (servedFromPublic(parts)) continue;
    missing.push(href);
  }
  assert.deepEqual(missing, [], "internal links lead nowhere (checked app/ and public/)");
});

test("the /together experiment keeps its public/ home while links point at it", () => {
  assert.ok(
    existsSync(join(ROOT, "public/together/index.html")),
    "/together is linked from the hero and footer but no longer served"
  );
});

test("the checker sees through route groups and dynamic segments", () => {
  // Self-check so a refactor of the walker cannot silently blind the test:
  // (protected) must flatten away, and [slug] must act as a wildcard.
  assert.ok(matchesAppRoute(["admin", "submissions"]));
  assert.ok(matchesAppRoute(["places", "any-venue-slug"]));
  assert.ok(!matchesAppRoute(["no", "such", "route"]));
});
