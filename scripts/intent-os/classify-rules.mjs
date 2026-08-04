// Ordered classification rules for Stage 2.
//
// Determinism contract: rules are evaluated top to bottom; the FIRST match wins
// and its `id` is recorded in the artifact as `decision_rule`, so any row's type
// can be traced back to the exact rule that produced it.
//
// Rule 3 of the master goal forbids inventing evidence. Classification is a
// taxonomy judgement over text the source already contains, not new evidence:
// no rule here asserts a fact about the world, only about the record's shape.

/** Risk classes drive 04_AUTONOMOUS_DECISION_POLICY.yaml risk_policy. */
export const RISK_RULES = [
  { id: 'RISK.MEDICAL',
    risk: 'MEDICAL',
    re: /rabies|bali belly|doctor|clinic|vaccin|imodium|medication|pharmac|injur|accident|pregnan|hangover|monkey bite|sunburn|burn\)|tropical sun|food safety|raw vegetable|tap water/i },
  // "customs" alone is ambiguous in this corpus: it matches Indonesian border
  // customs AND Balinese cultural customs. Only the border sense is regulatory,
  // so the pattern is anchored to the state-authority reading.
  { id: 'RISK.LEGAL',
    risk: 'LEGAL_REGULATORY',
    re: /visa|drug law|penalt|immigration|indonesian customs|customs declaration|register phone|legitimacy|legal/i },
  // "blocked" alone matched a bank-card inconvenience; scoped to genuine harm.
  { id: 'RISK.SAFETY',
    risk: 'SAFETY',
    re: /rip current|theft|steal|snatch|scam|fake|skimming|helmet|fatality|safe as a solo|solo female|safety|complacent|drown|traffic/i },
  { id: 'RISK.OPERATIONAL',
    risk: 'OPERATIONAL',
    re: /price|bargain|budget|laundry|luggage|driver|taxi|grab|gojek|transport|scooter|motorbike|open before|24\/7|last-minute|day pass|extension|bank card|card being blocked/i },
];

/**
 * Type rules. `type` is one of NORMALIZED_RECORD_TYPES.
 * Rules that depend on risk are expressed via `requiresRisk`.
 */
export const TYPE_RULES = [
  // 1. High-risk guidance outranks everything: a record whose answer can hurt
  //    someone is never a venue-selection job first.
  { id: 'TYPE.HIGH_RISK_GUIDE.medical', type: 'HIGH_RISK_GUIDE', requiresRisk: ['MEDICAL'] },
  { id: 'TYPE.HIGH_RISK_GUIDE.legal', type: 'HIGH_RISK_GUIDE', requiresRisk: ['LEGAL_REGULATORY'] },
  { id: 'TYPE.HIGH_RISK_GUIDE.safety', type: 'HIGH_RISK_GUIDE', requiresRisk: ['SAFETY'] },

  // 2. Product actions (save / share / add-to-trip / redeem) per the Stage 3 fixed decisions.
  { id: 'TYPE.PRODUCT_ACTION', type: 'PRODUCT_ACTION',
    re: /^(save|share|add to trip|add-to-trip|redeem)\b/i },

  // 3. Named-entity lookups: the record names a specific venue, market, brand or app.
  { id: 'TYPE.ENTITY_QUERY', type: 'ENTITY_QUERY',
    re: /locavore|ap[eé]ritif|trunyan|taman festival|lempuyang|melasti|botanical gardens|artedesana|kuta art market|monkey forest road|celuk|pasar badung|balitrees|blooming lotus|bali garden|waterbom|bluebird|herocyn|kopi luwak|campuhan|mount batur|nusa penida|munduk|amed|sideman|ayung|denpasar|kecak/i },

  // 4. Trip-supporting logistics that do not select a place to go.
  { id: 'TYPE.SUPPORTING_JOB', type: 'SUPPORTING_JOB',
    re: /luggage|laundry|get around|pick up|private driver|deodorant|sunscreen|snacks|sim card|phone with|combine .* with/i },

  // 5. Understanding / etiquette / awareness content with no venue outcome.
  { id: 'TYPE.EDITORIAL_TOPIC', type: 'EDITORIAL_TOPIC',
    re: /^(understand|respect|avoid close-up|say no|learn basic|manage (first impression|expectations)|plan loosely|participate respectfully|witness|attend|photograph during)\b/i },
  { id: 'TYPE.EDITORIAL_TOPIC.culture', type: 'EDITORIAL_TOPIC',
    reDomain: /culture & (respect|social|awareness|language)|environment & expectations|expectations & (mindset|planning)|mindset & planning/i },

  // 6. Explicit venue attributes rather than jobs (rare in this source set).
  { id: 'TYPE.VENUE_CAPABILITY', type: 'VENUE_CAPABILITY',
    re: /^(work-friendly|family-easy|laptop-friendly|pet-friendly|wheelchair-accessible)$/i },

  // 7. Standalone modifiers (time / qualifier words with no job verb).
  { id: 'TYPE.MODIFIER', type: 'MODIFIER',
    re: /^(golden-hour|sunset|sunrise|romantic|local-and-calm)$/i },

  // 8. Default: an actionable job the product could answer with places.
  { id: 'TYPE.CANONICAL_USER_JOB', type: 'CANONICAL_USER_JOB', re: /.*/ },
];

/**
 * Explicit per-record overrides, applied AFTER the rule table.
 * Each entry must carry a reason; this is the audit trail for judgement that the
 * regex table cannot express. Keeping them here rather than inline in the
 * classifier keeps the rule engine honest and the exceptions countable.
 */
export const OVERRIDES = {
  // Named-entity regex catches the landmark, but the record's job is a real
  // day-planning decision the product can answer with places.
  'OB-INT-0031': { type: 'CANONICAL_USER_JOB', reason: 'Mount Batur sunrise trek is a bookable activity job, not a lookup' },
  'OB-INT-0033': { type: 'CHILD_SCENARIO', parent: 'OB-INT-0032', reason: 'Campuhan at sunrise is a district-specific instance of the sunrise-walk job' },
  'OB-INT-0063': { type: 'CANONICAL_USER_JOB', reason: 'multi-waterfall day trip is a planning job despite naming no single entity' },
  'OB-INT-0066': { type: 'CANONICAL_USER_JOB', reason: 'Kecak at Uluwatu is a scheduled experience booking job' },
  'OB-INT-0070': { type: 'CANONICAL_USER_JOB', reason: 'Ubud loop is an itinerary job, not an entity lookup' },
  'OB-INT-0068': { type: 'CANONICAL_USER_JOB', reason: 'Nusa Penida day trip is a planning job' },
  'OB-INT-0069': { type: 'CANONICAL_USER_JOB', reason: 'snorkelling/diving day trip is a planning job' },
  'OB-INT-0064': { type: 'CHILD_SCENARIO', parent: 'OB-INT-0063', reason: 'Munduk-from-Ubud is a route-specific instance of the waterfall day trip' },
  // Shopping-with-named-market records stay entity queries, but these two are
  // generic shopping jobs that merely mention a place type.
  'OB-INT-0144': { type: 'CANONICAL_USER_JOB', reason: 'generic craft night-market job, no specific entity named' },
  'OB-INT-0146': { type: 'CANONICAL_USER_JOB', reason: 'generic Ubud craft-shop job, no specific entity named' },
  // Temple dress code appears in both files; it is etiquette guidance, not a venue job.
  'OB-INT-0065': { type: 'EDITORIAL_TOPIC', reason: 'temple dress code is etiquette guidance with no venue outcome' },
  // Retreat legitimacy is a fraud-avoidance safety guide, not a booking job.
  'OB-INT-0165': { type: 'HIGH_RISK_GUIDE', reason: 'evaluating retreat legitimacy is fraud-risk guidance' },
  // Solo-female safety is safety guidance even though phrased as a feeling.
  'OB-INT-0047': { type: 'HIGH_RISK_GUIDE', reason: 'solo female safety is personal-safety guidance' },
  // --- corrections found by auditing the first normalize run -----------------
  // Names a landmark, but the job is finding a massage, not looking up Batur.
  'OB-INT-0055': { type: 'CHILD_SCENARIO', parent: 'OB-INT-0054', reason: 'post-trek massage is a context-specific instance of the massage job, not an entity lookup' },
  // "combine X with Y" is multi-activity planning, not a supporting errand.
  'OB-INT-0167': { type: 'CANONICAL_USER_JOB', reason: 'combining two activities is an itinerary-planning job' },
  // Financial-logistics errand, not personal safety.
  'OB-INT-0106': { type: 'SUPPORTING_JOB', reason: 'pre-trip bank notification is trip logistics, not a safety guide' },
};

/**
 * Child -> parent relationships that the source set expresses implicitly.
 * A CHILD_SCENARIO must resolve to a parent that exists in the same ledger.
 */
export const PARENTS = {
  'OB-INT-0008': 'OB-INT-0007', // Canggu brunch -> breakfast
  'OB-INT-0009': 'OB-INT-0007', // Ubud breakfast view -> breakfast
  'OB-INT-0010': 'OB-INT-0007', // Sanur breakfast -> breakfast
  'OB-INT-0015': 'OB-INT-0014', // Uluwatu romantic dinner -> romantic dinner
  'OB-INT-0042': 'OB-INT-0014', // Bali-wide romantic dinner -> romantic dinner
  'OB-INT-0020': 'OB-INT-0019', // Sanur late-night -> late-night food
  'OB-INT-0021': 'OB-INT-0019', // post-clubbing -> late-night food
  'OB-INT-0023': 'OB-INT-0022', // early coffee -> specialty coffee
  'OB-INT-0027': 'OB-INT-0026', // 24/7 coworking -> coworking day pass
  'OB-INT-0040': 'OB-INT-0037', // Seminyak kid-friendly -> family cafe
  'OB-INT-0041': 'OB-INT-0037', // baby-friendly food -> family cafe
  'OB-INT-0051': 'OB-INT-0016', // group birthday dinner -> special-occasion dinner
  'OB-INT-0061': 'OB-INT-0060', // Uluwatu beginner surf -> learn to surf
  'OB-INT-0077': 'OB-INT-0075', // vegan outside Ubud -> vegan restaurants
  'OB-INT-0076': 'OB-INT-0075', // vegetarian at warungs -> vegan/vegetarian
  'OB-INT-0099': 'OB-INT-0045', // anniversary villa dining -> secluded proposal spot
  'OB-INT-0098': 'OB-INT-0034', // kids rainy afternoon -> rainy day
  'OB-INT-0035': 'OB-INT-0034', // Ubud rain backup -> rainy day
  'OB-INT-0093': 'OB-INT-0034', // 15-min rain backup -> rainy day
  'OB-INT-0036': 'OB-INT-0034', // indoor cooking class -> rainy day
  'OB-INT-0125': 'OB-INT-0085', // duplicate private-driver phrasing
  'OB-INT-0169': 'OB-INT-0126', // helmet concerns -> Gojek bike safety
  'OB-INT-0171': 'OB-INT-0126', // helmet decision -> Gojek bike safety
  'OB-INT-0170': 'OB-INT-0105', // snatching -> jewelry theft on bike
  'OB-INT-0182': 'OB-INT-0108', // rabies vaccine -> monkey bite
  'OB-INT-0183': 'OB-INT-0108', // rabies risk -> monkey bite
  'OB-INT-0173': 'OB-INT-0102', // escape technique -> rip currents
  'OB-INT-0175': 'OB-INT-0174', // when to see doctor -> Bali belly prevention
  'OB-INT-0185': 'OB-INT-0174', // medication options -> Bali belly
  'OB-INT-0186': 'OB-INT-0174', // Imodium -> Bali belly
  'OB-INT-0056': 'OB-INT-0174', // recover from Bali belly -> Bali belly
  'OB-INT-0130': 'OB-INT-0065', // temple dress code detail -> dress code
  'OB-INT-0157': 'OB-INT-0156', // fake villa listings -> Airbnb fake listings
  'OB-INT-0158': 'OB-INT-0156',
  'OB-INT-0159': 'OB-INT-0156',
  'OB-INT-0160': 'OB-INT-0156',
  'OB-INT-0107': 'OB-INT-0088', // ATM skimming duplicate phrasing
  'OB-INT-0166': 'OB-INT-0163', // authentic vs touristy retreat -> yoga retreat
  'OB-INT-0164': 'OB-INT-0163', // named retreats -> yoga retreat
  'OB-INT-0168': 'OB-INT-0163', // low-season retreat -> yoga retreat
};
