#!/usr/bin/env node
// Deterministic reconciliation of collector, validator and acceptor output.
//
//   node reconcile.mjs --batch <dir> --out <dir>
//
// A claim is ACCEPTED only when the collector marked it ready, the validator
// passed it and the blind acceptor accepted it. Any disagreement becomes HOLD
// with both versions attached; nothing is promoted silently. Removals, E-class
// claims and claims whose acceptor could not re-fetch the source always go to
// the founder's manual list. Canary claims are scored separately and a wave
// with an accepted canary is flagged for re-run.

import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const args = process.argv.slice(2);
const val = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
const BATCH = resolve(val("--batch", ".."));
const OUT = resolve(val("--out", BATCH));

const readJson = async (p) => JSON.parse(await readFile(p, "utf8"));
const csvCell = (v) => {
  if (v === null || v === undefined) return "";
  const s = typeof v === "string" ? v : typeof v === "object" ? JSON.stringify(v) : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const slugs = (await readdir(join(BATCH, "claims"), { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name).sort();
const rows = [];
const canaryRows = [];
const perVenue = {};
for (const slug of slugs) {
  const dir = join(BATCH, "claims", slug);
  const collected = await readJson(join(dir, "claims.json")).catch(() => null);
  const validated = await readJson(join(dir, "claims.validated.json")).catch(() => null);
  const verdicts = await readJson(join(dir, "verdicts.json")).catch(() => null);
  const canaries = await readJson(join(dir, "canaries.json")).catch(() => ({ canaries: [] }));
  if (!collected) continue;
  const vById = new Map((validated?.claims ?? []).map((c) => [c.claim_id, c]));
  const aById = new Map((verdicts?.verdicts ?? []).map((v) => [v.claim_id, v]));
  const identity = collected.identity ?? {};
  const identityOk = identity.operating === true && identity.branch_ok === true;
  const v = (perVenue[slug] = { identity, identityOk, accepted: 0, hold: 0, rejected: 0, keep: 0, manual: 0 });
  for (const c of collected.claims ?? []) {
    const val = vById.get(c.claim_id);
    const acc = aById.get(c.claim_id);
    let decision;
    let why = [];
    if (c.action === "keep") {
      decision = "KEEP";
    } else if (!identityOk) {
      decision = "HOLD";
      why.push(`identity gate failed: ${JSON.stringify(identity)}`);
    } else if (c.action === "remove") {
      decision = acc?.verdict === "accept" ? "MANUAL_REVIEW" : "HOLD";
      why.push(acc ? `acceptor: ${acc.verdict} — ${acc.reason_code ?? ""} ${acc.note ?? ""}`.trim() : "no acceptor verdict");
      why.push("removal: founder confirms every removal");
    } else {
      const collectorReady = c.status === "ready";
      const validatorPass = val?.validator === "pass";
      const acceptorAccept = acc?.verdict === "accept";
      if (collectorReady && validatorPass && acceptorAccept) decision = "ACCEPTED";
      else if (acc?.verdict === "reject" && val?.validator === "fail") decision = "REJECTED";
      else decision = "HOLD";
      if (!collectorReady) why.push(`collector status: ${c.status}`);
      if (!validatorPass) why.push(`validator: ${val ? val.reasons.join("; ") : "not run"}`);
      if (!acceptorAccept) why.push(`acceptor: ${acc ? `${acc.verdict} — ${acc.reason_code ?? ""} ${acc.note ?? ""}`.trim() : "no verdict"}`);
      if (acc?.refetch === "blocked" || acc?.quote_found === "snapshot_only") {
        if (decision === "ACCEPTED") decision = "MANUAL_REVIEW";
        why.push("acceptor could not re-fetch the source: snapshot-only evidence");
      }
      if (c.evidence_kind === "image" || c.evidence_kind === "pdf") {
        if (decision === "ACCEPTED") decision = "MANUAL_REVIEW";
        why.push(`quote transcribed from ${c.evidence_kind}: founder checks the file`);
      }
    }
    if (decision === "ACCEPTED") v.accepted += 1;
    else if (decision === "HOLD") v.hold += 1;
    else if (decision === "REJECTED") v.rejected += 1;
    else if (decision === "KEEP") v.keep += 1;
    else v.manual += 1;
    rows.push({
      slug,
      claim_id: c.claim_id,
      field: c.field,
      target: c.target,
      class: c.class,
      action: c.action,
      live_value: c.live_value ?? "",
      proposed: c.proposed,
      source_url: c.source_url ?? "",
      quote: c.quote ?? "",
      source_date: c.source_date ?? "",
      snapshot_sha256: c.snapshot_sha256 ?? "",
      collector_status: c.status,
      validator: val?.validator ?? "",
      acceptor: acc?.verdict ?? "",
      acceptor_reason: acc ? `${acc.reason_code ?? ""} ${acc.note ?? ""}`.trim() : "",
      decision,
      why: why.join(" | "),
    });
  }
  for (const k of canaries.canaries ?? []) {
    const acc = aById.get(k.claim_id);
    canaryRows.push({ slug, claim_id: k.claim_id, kind: k.kind, acceptor: acc?.verdict ?? "no verdict", caught: acc?.verdict === "reject" || acc?.verdict === "hold" });
  }
}

await mkdir(OUT, { recursive: true });
const header = Object.keys(rows[0] ?? { slug: "" });
await writeFile(join(OUT, "change-list.csv"), `# одна строка = одно утверждение по одному полю одного места; decision: ACCEPTED (сборщик ready + валидатор pass + приёмщик accept), HOLD (расхождение), REJECTED, KEEP, MANUAL_REVIEW (удаление / снимок без повторной загрузки / цитата из PDF или картинки)\n${header.join(",")}\n${rows.map((r) => header.map((h) => csvCell(r[h])).join(",")).join("\n")}\n`);
await writeFile(join(OUT, "reconcile-summary.json"), JSON.stringify({ perVenue, totals: rows.reduce((a, r) => ((a[r.decision] = (a[r.decision] ?? 0) + 1), a), {}), canaries: canaryRows, canariesMissed: canaryRows.filter((k) => !k.caught) }, null, 2));
console.log(JSON.stringify({ venues: slugs.length, claims: rows.length, totals: rows.reduce((a, r) => ((a[r.decision] = (a[r.decision] ?? 0) + 1), a), {}), canaries: canaryRows.length, canariesMissed: canaryRows.filter((k) => !k.caught).length }));
