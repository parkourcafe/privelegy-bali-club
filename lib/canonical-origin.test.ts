import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const sourceRoots = ["app", "components", "lib", "mobile", "public"];
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".html", ".json"]);

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(target);
    if (!sourceExtensions.has(extname(entry.name)) || /\.test\.[^.]+$/.test(entry.name)) return [];
    return [target];
  });
}

test("production source contains no absolute apex-host URLs", () => {
  const offenders = sourceRoots.flatMap((relative) => sourceFiles(join(root, relative)))
    .filter((file) => readFileSync(file, "utf8").includes("https://otherbali.com"))
    .map((file) => file.slice(root.length));
  assert.deepEqual(offenders, []);
});
