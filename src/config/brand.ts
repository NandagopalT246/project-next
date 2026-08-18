import type { QueueItem, Signal, OpportunityObject, Reasoning } from "@/lib/types";

/**
 * SINGLE SOURCE OF TRUTH for the demo brand & scenario.
 * Swap the values here to re-skin the entire cockpit for a different brand.
 * Everything downstream (feed, queue, cockpit, memory) reads from this object.
 */
export const BRAND = {
  parent: "HUL",
  name: "Brooke Bond Red Label",
  product: "Red Label",
  hashtag: "#SwadApnepanKa",
  accentWord: "togetherness",

  /** The live moment being detected. Kept generic — no real individuals named. */
  event: "Live cricket final · a veteran's farewell",
  moment:
    "A beloved veteran's on-field farewell — the whole stadium sings together. Sentiment around shared, emotional togetherness is spiking in real time.",

  /** Time-to-Expiry window for the star opportunity. 2820s = 47:00. */
  windowSeconds: 2820,
} as const;

/** COE streaming feed — deterministic, scripted, representative. */
export const SIGNALS: Signal[] = [
  { id: "s1", source: "X · social listening", text: "“Whole stadium singing together, goosebumps 🥹”", weight: 9, appearAt: 600 },
  { id: "s2", source: "Instagram · platform API", text: "Reels tagged #together up 240% in 20 min", weight: 14, appearAt: 1500 },
  { id: "s3", source: "News wire", text: "“A farewell that united a nation” — trending headline", weight: 12, appearAt: 2600 },
  { id: "s4", source: "YouTube · platform API", text: "Fan edits crossing 1.2M views/hr", weight: 16, appearAt: 3700 },
  { id: "s5", source: "X · social listening", text: "Sentiment: 94% warmth · low controversy", weight: 18, appearAt: 5200 },
  { id: "s6", source: "Search trends", text: "“moments to remember” breakout query", weight: 21, appearAt: 6600 },
];

/** Momentum threshold that, when crossed, fires the Opportunity Object. */
export const MOMENTUM_THRESHOLD = 72;

/** Other queue cards — deliberately mostly MONITOR / IGNORE to prove restraint. */
export const QUEUE: QueueItem[] = [
  {
    id: "opp-hot",
    brand: BRAND.name,
    summary: "Stadium-wide togetherness moment · farewell",
    score: 93,
    verdict: "ACT",
    windowSeconds: BRAND.windowSeconds,
    hot: true,
  },
  { id: "opp-2", brand: "Kwality Wall's", summary: "Heatwave chatter in metros, gradual build", score: 48, verdict: "MONITOR", windowSeconds: 15600 },
  { id: "opp-3", brand: "Lakmé", summary: "Micro-influencer look trending, niche reach", score: 37, verdict: "MONITOR", windowSeconds: 9200 },
  { id: "opp-4", brand: "Surf Excel", summary: "Reactive meme, off-brand tone risk", score: 21, verdict: "IGNORE", windowSeconds: 4100 },
  { id: "opp-5", brand: "Lifebuoy", summary: "Seasonal flu uptick, evergreen not urgent", score: 29, verdict: "MONITOR", windowSeconds: 41000 },
];

/** The structured Opportunity Object emitted by COE and handed to BAE. */
export const OPPORTUNITY: OpportunityObject = {
  id: "OPP-4417",
  brand: BRAND.name,
  headline: "Nationwide togetherness spike around a live farewell",
  context: BRAND.moment,
  audience: "Cricket-watching families, 18–45, high emotional engagement",
  momentum: 88,
  windowSeconds: BRAND.windowSeconds,
  score: 93,
  verdict: "ACT",
  tier: 2,
};

/**
 * SCRIPTED FALLBACK reasoning — guarantees the exact 60s beats even with
 * no Gemini key or a failed call. Live Gemini output slots into this shape.
 */
export const FALLBACK_REASONING: Reasoning = {
  rationale:
    "High-warmth, low-controversy national moment with rising momentum and a tight window. Emotional territory maps cleanly onto the brand's togetherness equity — act now, on-brand, without touching the live broadcast.",
  optionA: {
    id: "A",
    label: "Option A · first draft",
    channel: "Instagram + X",
    copy:
      "What a farewell! 🏏 The whole stadium came together tonight. Some goodbyes deserve a cup of Red Label. #SwadApnepanKa",
    predictedEngagement: 71,
    risks: ["References the live match moment directly", "Reads as riding the event"],
  },
  critique:
    "Pre-flight flags Option A: leaning on the live match risks a broadcast-IP clash and reads as opportunistic — appropriating the event rather than adding to it. Warmth is right; the hook is wrong.",
  flaggedRisks: [
    "Potential broadcast-IP clash (live match reference)",
    "Tone reads as opportunistic / bandwagon",
  ],
  optionC: {
    id: "C",
    label: "Option C · improved",
    channel: "Instagram + X",
    copy:
      "Some moments are too big to watch alone. Whoever you called first tonight — that's togetherness. Pour them a cup. #SwadApnepanKa",
    predictedEngagement: 86,
    risks: ["Emotion-led, brand-owned — no event IP referenced"],
  },
  source: "fallback",
};

/** Brand Memory ledger — the "got smarter" close. */
export const MEMORY = {
  predicted: 86,
  actual: 89,
  lift: "+3.5% engagement vs. predicted",
  learned:
    "Emotion-led, IP-free framing outperformed event-referencing drafts for this brand. Pattern stored — next togetherness moment starts from Option C's shape.",
  headlineStat: "From 21 days to 90 minutes",
  subStat: "opportunity detected → live, on-brand action",
};
