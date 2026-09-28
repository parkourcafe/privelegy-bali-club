export const meta = {
  name: 'uluwatu-25-verify',
  description: 'Batch 1: collect official-source claims for the Uluwatu 25, then accept them blind (5 collectors, 5 acceptors)',
  phases: [
    { title: 'Collect', detail: 'one collector per group of 5 venues; official sources only; claims + snapshots' },
    { title: 'Accept', detail: 'blind acceptor per group; re-fetches every source; canaries mixed in' },
  ],
}

// Runs from the repository root. The batch directory holds before.json,
// leads.json, snapshots/ and the briefs in tools/COLLECTOR.md / tools/ACCEPTOR.md.
const BATCH = 'data/data-ops/verification/2026-09-28-batch-01-uluwatu'
const GROUPS = args.groups

const COLLECT_SCHEMA = {
  type: 'object',
  properties: {
    venues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          identity: { type: 'string' },
          claims: { type: 'number' },
          ready: { type: 'number' },
          unclear: { type: 'number' },
          not_found: { type: 'number' },
          validator_pass: { type: 'number' },
          validator_fail: { type: 'number' },
          blockers: { type: 'string' },
        },
        required: ['slug', 'identity', 'claims', 'ready', 'unclear', 'not_found', 'blockers'],
      },
    },
  },
  required: ['venues'],
}

const ACCEPT_SCHEMA = {
  type: 'object',
  properties: {
    venues: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
          accept: { type: 'number' },
          reject: { type: 'number' },
          hold: { type: 'number' },
          blocked_sources: { type: 'string' },
        },
        required: ['slug', 'accept', 'reject', 'hold', 'blocked_sources'],
      },
    },
  },
  required: ['venues'],
}

const collectorPrompt = (slugs) => `You are a COLLECTOR for Other Bali batch 01 (Uluwatu 25).
Read ${BATCH}/tools/COLLECTOR.md first and follow it exactly for these venues, one at a time: ${slugs.join(', ')}.
Work from the repository root (${BATCH} is relative to it). Write ${BATCH}/claims/<slug>/claims.json for each venue and run the validator on each. Do not edit any other file. No WebFetch. No Google Maps, Instagram, aggregators. Unknown stays null. Nothing you write is published.
Return the per-venue summary as your structured output.`

const acceptorPrompt = (slugs) => `You are a blind ACCEPTOR for Other Bali batch 01 (Uluwatu 25).
Read ${BATCH}/tools/ACCEPTOR.md first and follow it exactly for these venues, one at a time: ${slugs.join(', ')}.
Before reading a venue's claims run: node ${BATCH}/tools/blind.mjs <slug>  — then read ONLY ${BATCH}/claims/<slug>/blinded.json. Do not open claims.json, claims.validated.json, canaries.json, before.json, leads.json, codex-proposals.json or ${BATCH}/snapshots/. Re-fetch every source yourself with snapshot.mjs --root snapshots-acceptor --force. Your default when unsure is hold or reject, never accept.
Write ${BATCH}/claims/<slug>/verdicts.json for each venue. Return the per-venue counts as your structured output.`

phase('Collect')
const results = await pipeline(
  GROUPS,
  (slugs, _item, i) => agent(collectorPrompt(slugs), { label: `collect:${i + 1}`, phase: 'Collect', effort: 'medium', schema: COLLECT_SCHEMA }),
  (collected, slugs, i) => {
    log(`group ${i + 1} collected: ${(collected?.venues ?? []).map((v) => `${v.slug} ${v.ready}/${v.claims}`).join(', ')}`)
    return agent(acceptorPrompt(slugs), { label: `accept:${i + 1}`, phase: 'Accept', effort: 'high', schema: ACCEPT_SCHEMA }).then((accepted) => ({ collected, accepted }))
  },
)
return results
