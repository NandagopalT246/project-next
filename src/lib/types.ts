export type Verdict = "ACT" | "MONITOR" | "IGNORE";
export type Tier = 1 | 2 | 3;

export interface Signal {
  id: string;
  source: string; // platform label, e.g. "X · social listening"
  text: string;
  weight: number; // momentum contribution
  appearAt: number; // demo-ms when it streams in
}

export interface QueueItem {
  id: string;
  brand: string;
  summary: string;
  score: number;
  verdict: Verdict;
  windowSeconds: number; // remaining time-to-expiry, ticks down live
  hot?: boolean; // the star opportunity the demo acts on
}

export interface CreativeOption {
  id: "A" | "C";
  label: string;
  channel: string;
  copy: string;
  predictedEngagement: number; // 0-100
  risks?: string[];
}

export interface OpportunityObject {
  id: string;
  brand: string;
  headline: string;
  context: string;
  audience: string;
  momentum: number; // 0-100 at fire time
  windowSeconds: number; // full time-to-expiry window (e.g. 2820 = 47:00)
  score: number; // BAE opportunity score 0-100
  verdict: Verdict;
  tier: Tier;
}

/** Model-generated (or scripted-fallback) reasoning payload. */
export interface Reasoning {
  rationale: string;
  optionA: CreativeOption;
  critique: string; // the AI's self-critique of Option A
  flaggedRisks: string[];
  optionC: CreativeOption;
  source: "gemini" | "fallback";
}
