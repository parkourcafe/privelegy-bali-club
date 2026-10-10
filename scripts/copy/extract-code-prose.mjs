#!/usr/bin/env node
// Pulls human-readable prose out of TypeScript/TSX so lint.mjs can treat
// hand-written article copy like a venue field. Walks the AST with the
// TypeScript compiler already in devDependencies, loaded through createRequire
// because this file must stay plain ESM.
//
//   node scripts/copy/extract-code-prose.mjs [glob-or-path ...]   → JSONL, one unit per line
//
// Default set when no args: lib/**/*.ts, app/**/page.tsx, components/**/*.tsx.

import { createRequire } from "node:module";
import { readFileSync, globSync, existsSync, statSync } from "node:fs";
import { resolve, relative, dirname, isAbsolute } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { normalizeField, decodeEntities } from "./patterns.mjs";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = resolve(HERE, "../..");
export const DEFAULT_GLOBS = ["lib/**/*.ts", "app/**/page.tsx", "components/**/*.tsx"];
// lib/seed.ts is the offline fallback catalogue, never served when the database is configured.
export const SKIP_FILES = /shader-background|i18n\/|\/api\/|\/admin|\/dev\/|partner|privacy|terms|\.test\.|lib\/seed\.ts/;
// `alt` is kept on purpose: it is read aloud and indexed, so it is public copy.
const SKIP_JSX_ATTRS = /^(className|href|src|id|key|type|rel|aria-[\w-]+|data-[\w-]+)$/;
// `note` is not skipped: on the best-of guides, district pages and route stops
// it renders as public text under the headings. Working notes in evidence
// records are skipped by INTERNAL_CONTAINERS / the ev() call instead.
const SKIP_KEYS = new Set(["slug", "href", "url", "icon", "kind", "category", "src", "evidence", "source", "quote", "sourceUrl", "gmapsUrl", "image", "canonical"]);
// `ev` is the evidence-record constructor in lib/uluwatu/venues.ts; its notes
// are working records, never rendered.
const INTERNAL_CALLS = /^(console\.\w+|assert(\.\w+)?|warn|debug|invariant|require|ev)$/;
// Records whose contents are working notes, never rendered: the Uluwatu
// registry's `evidence: [ev(…, "note"), …]` holds them inside call arguments,
// which the owning-property check alone does not reach.
const INTERNAL_CONTAINERS = new Set(["evidence"]);
const FUNCTION_WORDS = /\b(the|a|an|of|for|to|in|on|at|and|or|but|with|is|are|was|were|it|its|you|your|we|our|this|that|not|no|from|by|as|if|when|than)\b/i;
// Only these field names carry field-scoped rules (F1, R3, A6, A9); any other
// property name is reported as plain prose.
const KNOWN_FIELDS = new Set(["best_for", "not_for", "why_its_here", "what_to_expect", "what_to_order", "price_anchor", "faq_q", "faq_a", "heading", "title", "meta_title"]);

const posix = (p) => p.split("\\").join("/");

// A string is prose when it reads like a sentence. Class lists, column lists
// and paths also clear the "four words with a lowercase letter" bar, so each
// gets a shape test of its own.
export function isProse(text) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length < 4 || !/[a-z]/.test(text)) return false;
  if (/^(https?:|\/|\.\.?\/|data:|mailto:|tel:|#|\?)/.test(text)) return false;
  const punctuated = /[.,;!?]/.test(text);
  const classy = words.filter((w) => /[-:/[\]]/.test(w)).length;
  if (!punctuated && classy / words.length >= 0.5) return false;
  if (words.filter((w) => /[_{}();=<>]/.test(w)).length / words.length >= 0.3) return false;
  if (!/[.!?]/.test(text) && !FUNCTION_WORDS.test(text)) return false;
  return true;
}

function renderTemplate(node, sf) {
  return node.head.text + node.templateSpans.map((s) => `{${s.expression.getText(sf)}}${s.literal.text}`).join("");
}

const propName = (name, sf) => (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name) ? name.text : name.getText(sf));

// Climbs out of array/paren/conditional wrappers to the property that owns the
// literal, so `evidence: ["…", "…"]` is skipped like `evidence: "…"`.
function owningProperty(node) {
  let n = node;
  while (n.parent && (ts.isArrayLiteralExpression(n.parent) || ts.isParenthesizedExpression(n.parent) || ts.isConditionalExpression(n.parent) || ts.isAsExpression(n.parent) || ts.isSatisfiesExpression?.(n.parent) || (ts.isBinaryExpression(n.parent) && n.parent.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken))) n = n.parent;
  return n.parent && ts.isPropertyAssignment(n.parent) ? n.parent : null;
}

function skipReason(node, sf) {
  const parent = node.parent;
  if (!parent) return "root";
  if (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent) || ts.isExternalModuleReference(parent) || ts.isImportTypeNode(parent)) return "module";
  if (ts.isLiteralTypeNode(parent)) return "type";
  if (ts.isPropertyAccessExpression(parent) || ts.isElementAccessExpression(parent) || ts.isComputedPropertyName(parent)) return "access";
  const attr = ts.isJsxAttribute(parent) ? parent : ts.isJsxExpression(parent) && parent.parent && ts.isJsxAttribute(parent.parent) ? parent.parent : null;
  if (attr && SKIP_JSX_ATTRS.test(attr.name.getText(sf))) return `attr:${attr.name.getText(sf)}`;
  const prop = owningProperty(node);
  if (prop && prop.name === node) return "key";
  if (prop && SKIP_KEYS.has(propName(prop.name, sf))) return `key:${propName(prop.name, sf)}`;
  for (let n = parent; n; n = n.parent) {
    if (ts.isPropertyAssignment(n) && INTERNAL_CONTAINERS.has(propName(n.name, sf))) return `container:${propName(n.name, sf)}`;
    if (ts.isCallExpression(n) && INTERNAL_CALLS.test(n.expression.getText(sf))) return "internal-call";
    if (ts.isNewExpression(n) && /Error$/.test(n.expression.getText(sf))) return "error";
    if (ts.isThrowStatement(n)) return "throw";
    if (ts.isSourceFile(n) || ts.isFunctionLike(n) || ts.isClassLike(n)) break;
  }
  return null;
}

function pathOf(node, sf) {
  const segs = [];
  let jsx = null;
  let fn = null;
  for (let n = node; n && !ts.isSourceFile(n); n = n.parent) {
    if (ts.isJsxAttribute(n)) jsx = `<JSX>@${n.name.getText(sf)}`;
    else if (ts.isJsxText(n) || ts.isJsxExpression(n) || ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) jsx ??= "<JSX>";
    if (jsx) return jsx;
    if (ts.isPropertyAssignment(n)) segs.unshift(propName(n.name, sf));
    else if (ts.isVariableDeclaration(n)) {
      segs.unshift(n.name.getText(sf));
      break;
    } else if ((ts.isFunctionDeclaration(n) || ts.isMethodDeclaration(n)) && n.name && !fn) fn = `${n.name.getText(sf)}()`;
    if (n.parent && ts.isArrayLiteralExpression(n.parent)) segs.unshift(`[${n.parent.elements.indexOf(n)}]`);
  }
  const path = segs.join(".").replace(/\.\[/g, "[");
  if (path && fn) return `${fn}.${path}`;
  return path || fn || "<expr>";
}

const lastKey = (path) => path.replace(/\[\d+\]/g, "").split(".").pop();

export function extractProse(filePath, sourceText) {
  const abs = isAbsolute(filePath) ? filePath : resolve(REPO, filePath);
  const rel = posix(relative(REPO, abs));
  const file = rel.startsWith("..") ? posix(filePath) : rel;
  if (SKIP_FILES.test(`/${file}`)) return [];
  const text = sourceText ?? readFileSync(abs, "utf8");
  const sf = ts.createSourceFile(abs, text, ts.ScriptTarget.Latest, true, /\.tsx$/.test(abs) ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const units = [];
  const visit = (node) => {
    let value = null;
    let kind = null;
    if (ts.isStringLiteral(node)) [value, kind] = [node.text, "string"];
    else if (ts.isNoSubstitutionTemplateLiteral(node)) [value, kind] = [node.text, "template"];
    else if (ts.isTemplateExpression(node)) [value, kind] = [renderTemplate(node, sf), "template"];
    else if (ts.isJsxText(node)) [value, kind] = [decodeEntities(node.text), "jsx-text"];
    if (value !== null) {
      const clean = value.replace(/\s+/g, " ").trim();
      if (!skipReason(node, sf) && isProse(clean)) {
        const { line, character } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
        const path = pathOf(node, sf);
        const inAttr = path.startsWith("<JSX>@");
        const key = inAttr ? path.slice(6) : path.startsWith("<JSX>") ? null : lastKey(path);
        const field = key ? normalizeField(key) : null;
        units.push({ id: `${file}:${line + 1}:${character + 1}`, file, line: line + 1, col: character + 1, path, text: clean, kind: inAttr ? "jsx-attr" : kind, field: KNOWN_FIELDS.has(field) ? field : null, pinned: false });
      }
      if (!ts.isTemplateExpression(node)) return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return markPinned(units);
}

// ---------------------------------------------------------------- pinned by tests

// Everything a scripts/*.test.* file asserts against, with regex escapes
// undone, so a unit whose first 40 characters a test expects is marked before
// anyone rewrites it. `.includes("…")` pins text exactly like assert.match.
let pinnedCorpus = null;
export function pinnedCorpusFrom(src) {
  const chunks = [];
  for (const m of src.matchAll(/assert\.(?:match|doesNotMatch)\(|\.includes\(/g)) {
    let depth = 1;
    let i = m.index + m[0].length;
    for (; i < src.length && depth > 0; i += 1) {
      if (src[i] === "(") depth += 1;
      else if (src[i] === ")") depth -= 1;
    }
    chunks.push(src.slice(m.index + m[0].length, i - 1).replace(/\\(.)/g, "$1"));
  }
  return chunks.join("\n");
}
export function loadPinnedCorpus(repo = REPO) {
  return globSync(["scripts/*.test.mjs", "scripts/*.test.ts"], { cwd: repo })
    .map((f) => pinnedCorpusFrom(readFileSync(resolve(repo, f), "utf8")))
    .join("\n");
}

export function markPinned(units, corpus) {
  const c = corpus ?? (pinnedCorpus ??= loadPinnedCorpus());
  for (const u of units) u.pinned = u.text.length >= 4 && c.includes(u.text.slice(0, 40));
  return units;
}

// ---------------------------------------------------------------- file sets

export function expandPatterns(patterns, cwd = REPO) {
  const files = new Set();
  for (const p of patterns) {
    const abs = isAbsolute(p) ? p : resolve(cwd, p);
    if (existsSync(abs) && statSync(abs).isFile()) files.add(abs);
    else for (const f of globSync(p, { cwd })) files.add(resolve(cwd, f));
  }
  return [...files].filter((f) => !SKIP_FILES.test(`/${posix(relative(cwd, f))}`)).sort();
}

export const defaultCodeFiles = (cwd = REPO) => expandPatterns(DEFAULT_GLOBS, cwd);

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  // `| head` closes the pipe early; that is not an error worth a stack trace.
  process.stdout.on("error", (e) => {
    if (e.code === "EPIPE") process.exit(0);
    throw e;
  });
  const args = process.argv.slice(2);
  const files = args.length ? expandPatterns(args, process.cwd()) : defaultCodeFiles();
  for (const f of files) for (const u of extractProse(f)) process.stdout.write(`${JSON.stringify(u)}\n`);
}
