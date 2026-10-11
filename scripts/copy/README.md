# scripts/copy — machine-language gate for public copy
- `patterns.mjs` — the one list of patterns (`HYPE`, `RATING`, `REVIEW_DERIVED`, `QUALITY_WARN`, `RULES`), `mask()` and `lintText()`. Import it; never copy a regex out of it. FAIL = guardrail or stub (R1 R2 R3 H1 S1 F1; A9 D1 on `--new` only), WARN = style (A1–A8, A10, A11). A8 is a heuristic verb list; A3/A10 fire above 1 hit per 100 words, A4 above 1 em dash per 50 words (first free in best_for/not_for).
- `extract-code-prose.mjs` — pulls prose (≥4 words, has a lowercase letter) out of `lib/**/*.ts`, `app/**/page.tsx`, `components/**/*.tsx` via the TypeScript AST; skips module specifiers, className/href/src/id/key/type/rel/aria-*/data-* attributes, and slug/href/url/icon/kind/category/src/evidence/note/source/quote/sourceUrl/gmapsUrl/image/canonical keys. `pinned=true` when a `scripts/*.test.*` asserts on the text.
- `lint.mjs` — runs every unit through `lintText`, writes `queue.csv` + `summary.json` (families, duplicate best_for groups, densities per 1000 words).
- `allowlist.json` — `{ unit, code, match, reason, approvedBy }` entries; one exact match in one unit, nothing wider.
- `fact-diff.mjs` — the guard for rewrites: any number, price, time, name, dish or evaluative word in the new text that the old text (or the evidence) did not hold is a REJECT; facts the new text drops are listed. `fixtures/canaries.json` holds 30 mutations and 20 good paraphrases it is accepted against.
- `build-copy-sql.mjs` — turns a decided change list (`decision = ДА`) and a read-only `venues` export into an apply file guarded on the exact old text, a rollback file, holds for rows whose current value moved, and curl lines for the live check.
- `ratchet.mjs` + `baseline.json` — no code file or resort page may gain a FAIL or raise its WARN density; `--write YYYY-MM-DD` lowers the floor after an approved wave.

```sh
npm run copy:test                                                 # all four test files
node scripts/copy/fact-diff.mjs --before "<old>" --after "<new>"   # exit 1 on REJECT
node scripts/copy/build-copy-sql.mjs --changes <list.csv> --export <venues.csv> --out <dir> --date <YYYY-MM-DD>
node scripts/copy/ratchet.mjs                                     # exit 1 on a regression
node scripts/copy/extract-code-prose.mjs lib/guides.ts            # JSONL units
node scripts/copy/lint.mjs --places docs/audits/2026-09-28-web/places.csv --code --resort --date 2026-10-05   # → docs/audits/copy-lint/2026-10-05/
node scripts/copy/lint.mjs --export <db-export.csv> --code --resort --date <YYYY-MM-DD> --out <dir> [--new]  # export wins over --places
node scripts/copy/lint.mjs --text "Perfect for couples" --field best_for --places docs/audits/2026-09-28-web/places.csv --new   # exit 1 on FAIL
```

Families (`street-template`, `spa-formula`, `stub-best-for`, `budget-massage`) are matched on raw text; rules run on text with venue names, dishes (`what_to_order` split on `;`) and areas masked, so "Hidden Gem Uluwatu" is a name, not hype. "Bali" is never masked so `best in Bali` stays detectable.
