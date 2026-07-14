# Other Bali — Complete Product Update Package

**Package date:** 2026-07-13  
**Scope:** Final Bali-wide product definition, repository rules, technical contract, and four-session parallel execution plan.

## What this package fixes

Other Bali is one Bali-wide product for travellers across all areas of Bali.  
Canggu is not the product boundary and not the public definition.

The fixed product model is:

```text
Traveller's moment and context
→ Other Bali selects and explains the right options
→ Traveller views menu / reserves / orders / chooses takeaway / saves
→ Partner confirms and fulfils
→ Google Maps handles navigation
```

## Canonical product sentence

> Other Bali helps travellers decide where to go and why. Partners fulfil the experience. Google Maps gets them there.

## Folder guide

### 01_PRODUCT_DEFINITION

- `Other_Bali_Product_Constitution_v1.1.md`  
  Product principles and final responsibility boundaries.

- `Other_Bali_Master_Architecture.md`  
  Full product and technical architecture in a clean product-facing filename.

- `Other_Bali_Project_One_Page_Bali_Wide.docx`  
  Plain-English one-page explanation for partners, team members, and stakeholders.

### 02_REPOSITORY_UPDATE

Files intended to be copied into the repository:

- `AGENTS.md` — canonical rules for coding agents.
- `AGENT.md` — compatibility entrypoint.
- `CLAUDE.md` — thin Claude entrypoint.
- `Other_Bali_Master_Architecture.md` — canonical architecture filename (v2 rename from legacy `Bali_Privilege_*`; update any references to the old name inside the existing repository in the same baseline commit).
- `lib/contracts/menu-action.ts` — frozen shared contract before parallel work starts.

### 03_PARALLEL_LOOP_EXECUTION

- Master execution plan for four parallel sessions.
- Four self-contained prompts:
  1. Data Foundation
  2. Place and Menu UX
  3. Action Gateway
  4. Admin, Integration and QA

### 04_COORDINATION

- Shared status board template.
- Per-session handoff template.

## Authority order

When files disagree, use this order:

1. `02_REPOSITORY_UPDATE/AGENTS.md`
2. `02_REPOSITORY_UPDATE/Other_Bali_Master_Architecture.md`
3. `03_PARALLEL_LOOP_EXECUTION/PARALLEL_LOOP_EXECUTION_PLAN.md`
4. The assigned session prompt
5. Existing implementation, after conflicts are documented

## Product boundaries fixed in this package

```text
Bali-wide product — yes
All tourist areas — yes
Moments as the main entry point — yes
Categories as internal structure — yes

Menus — yes
Editorial "What to order" — yes
Reservations through trusted handoff — yes
Delivery and takeaway through trusted handoff — yes
Partner-confirmed pre-order capability — yes
Google Maps navigation handoff — yes
Saved / My Bali — yes

Own booking engine — no
Own courier network — no
Own turn-by-turn navigation — no
Tourist payment platform by default — no
Wallet or real-money cashback as base product — no
AI chatbot as the product — no
Paid organic ranking — no
```

## Deliberately excluded as obsolete

The package does not include:

- the earlier Canggu-only one-page;
- the first abstract one-page;
- Product Constitution v1;
- old Bali Privilege architecture drafts;
- duplicate nested ZIP files.

Those versions are superseded. Keeping them in the same delivery would be an efficient way to make four agents implement five different products.

---

## v2 PATCH (13.07.2026, Bali)

Founder-approved fixes applied on top of the original bundle — full list in `PATCH_NOTES_v2.md`. Key points: architecture file renamed to `Other_Bali_Master_Architecture.md` everywhere; status board path unified to `docs/loop/STATUS_BOARD.md`; frozen contract extended with `VenueActionBarProps` + canonical fixtures file; new Track 0 — Data Ops with the pre-fill → owner-approval content workflow (`02_REPOSITORY_UPDATE/docs/DATA_OPS_TRACK.md`). Read the Data Ops doc right after the execution plan.
