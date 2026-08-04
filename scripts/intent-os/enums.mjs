// Controlled vocabularies. Every value here is copied from the governing spec
// (02_CLAUDE_CODE_MASTER_GOAL.md / 03_PIPELINE_STATE_MACHINE.yaml /
// 04_AUTONOMOUS_DECISION_POLICY.yaml). Do not extend without a spec change.

export const NORMALIZED_RECORD_TYPES = [
  'CANONICAL_USER_JOB',
  'CHILD_SCENARIO',
  'MODIFIER',
  'SUPPORTING_JOB',
  'VENUE_CAPABILITY',
  'EDITORIAL_TOPIC',
  'PRODUCT_ACTION',
  'ENTITY_QUERY',
  'HIGH_RISK_GUIDE',
  'REJECT',
];

export const INTERNAL_TYPES = [
  'USER_JOB',
  'TRIP_MISSION',
  'DAY_SCENARIO',
  'VENUE_CAPABILITY',
  'MOOD',
  'OCCASION',
  'TIME_EVENT',
  'TIME_MODIFIER',
  'DERIVED_COLLECTION',
  'EDITORIAL_PROJECTION',
  'SEO_ALIAS',
  'PRODUCT_ACTION',
];

export const SURFACES = [
  'PLAN',
  'MY_DAY',
  'PLACES_SEARCH',
  'PLACES_FILTER',
  'COLLECTION',
  'SCENARIO_PAGE',
  'DECISION_PAGE',
  'INTERACTIVE_TOOL',
  'ITINERARY_MODULE',
  'PRODUCT_ONLY_NO_URL',
  'NO_BUILD',
];

export const DATA_READINESS = [
  'READY',
  'READY_WITH_LIMITED_DISTRICTS',
  'NEEDS_ENRICHMENT',
  'BLOCKED_BY_DATA',
  'HIGH_RISK_NOT_READY',
];

export const RISK_CLASSES = ['LOW', 'OPERATIONAL', 'SAFETY', 'MEDICAL', 'LEGAL_REGULATORY'];

/** Risk classes that 04_AUTONOMOUS_DECISION_POLICY.yaml forbids auto-building. */
export const RESEARCH_ONLY_RISK = ['SAFETY', 'MEDICAL', 'LEGAL_REGULATORY'];

export const STATES = [
  'INGEST', 'NORMALIZE', 'RECONCILE', 'CANONICALIZE', 'MAP_SURFACES', 'DATA_READINESS',
  'SHORTLIST', 'KEYWORD_SERP', 'SELECT_PILOT', 'REUSE_GATE', 'PRODUCT_BRIEF',
  'IMPLEMENT', 'QA', 'INDEPENDENT_REVIEW', 'PREVIEW',
  'READY_FOR_PR', 'READY_FOR_PREVIEW', 'NO_BUILD', 'SAFE_HOLD', 'FAILED_GATE',
];

export const TERMINAL_STATES = ['READY_FOR_PR', 'READY_FOR_PREVIEW', 'NO_BUILD', 'SAFE_HOLD', 'FAILED_GATE'];

export const PARSE_STATUS = ['OK', 'ERROR'];

export const EVIDENCE_STATUS = ['EVIDENCE_STRONG', 'EVIDENCE_MODERATE', 'UNVERIFIED'];

export const LIFECYCLE_STATUS = ['ACTIVE', 'AUTO_HOLD', 'RESEARCH_ONLY', 'REJECTED'];

export const REUSE_DECISIONS = ['EXTEND_EXISTING', 'NEW_ENTRY_SAME_ENGINE', 'NEW_TOOL', 'HOLD'];

/** Scorecard factors and their maximum weights (Stage 7). Sum = 100. */
export const SCORECARD_WEIGHTS = {
  intent_clarity: 20,
  browser_completion: 15,
  second_job_strength: 20,
  repeatability_or_history: 10,
  serp_opportunity: 10,
  unique_utility: 10,
  safety_compliance: 10,
  maintenance_cost: 5,
};

export const WINNER_MIN_SCORE = 85;
export const BACKUP_MIN_SCORE = 80;
export const ALLOWED_PILOT_READINESS = ['READY', 'READY_WITH_LIMITED_DISTRICTS'];

export const LIBRARY_COLUMNS = [
  'canonical_intent_id',
  'canonical_name',
  'user_job_statement',
  'domain',
  'source_record_ids',
  'aliases',
  'child_scenarios',
  'allowed_modifiers',
  'required_venue_capabilities',
  'required_data_fields',
  'publication_risk',
  'demand_evidence_status',
  'answer_evidence_requirement',
  'internal_support_status',
  'recommended_surfaces',
  'single_job_candidate',
  'data_readiness',
  'lifecycle_status',
  'auto_decision_reason',
  'created_at',
  'generator',
  'source_version',
];
