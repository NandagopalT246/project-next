import { BRAND } from "@/config/brand";

/**
 * Deterministic 60-second demo timeline.
 * Every phase starts at a fixed demo-ms so a screen recording is identical
 * on every run. Panels derive their state purely from the current phase + clock.
 */
export const PHASES = [
  "IDLE",
  "COE_STREAM", // signals stream, momentum climbs
  "COE_FIRE", // threshold crossed → Opportunity Object crystallizes, countdown starts
  "BSC", // passive "Within brand strategy ✓"
  "BAE_INTAKE", // object lands in BAE cockpit
  "BAE_SCORE", // score dial → 93, ACT + rationale
  "BAE_DRAFT_A", // AI drafts Option A
  "BAE_PREFLIGHT", // AI stress-tests its own draft (scan sweep)
  "BAE_STRIKE", // risk flagged → Option A struck
  "BAE_OPTION_C", // improved Option C rises, engagement counts up
  "APPROVAL", // Tier-2 gate armed
  "ACTIVATED", // human approved → live, countdown locks
  "MEMORY", // outcome logged, "got smarter"
  "DONE",
] as const;

export type Phase = (typeof PHASES)[number];

/** Phase start times in demo-ms. */
export const PHASE_AT: Record<Phase, number> = {
  IDLE: -1,
  COE_STREAM: 0,
  COE_FIRE: 8200,
  BSC: 10200,
  BAE_INTAKE: 12400,
  BAE_SCORE: 15000,
  BAE_DRAFT_A: 21500,
  BAE_PREFLIGHT: 27500,
  BAE_STRIKE: 35000,
  BAE_OPTION_C: 39000,
  APPROVAL: 45000,
  ACTIVATED: 52000,
  MEMORY: 55000,
  DONE: 60000,
};

export const DEMO_LENGTH = 60000;
export const AUTO_APPROVE_AT = 50000; // hands-free press for recording
export const COUNTDOWN_COMPRESSION = 42; // dramatize decay within 60s

/** Which stage of the pipeline spine is "active" for a given phase. */
export type Stage = "DISCOVER" | "DECIDE" | "ACT" | "LEARN";
export function stageForPhase(p: Phase): Stage | null {
  if (p === "IDLE") return null;
  if (["COE_STREAM", "COE_FIRE"].includes(p)) return "DISCOVER";
  if (p === "BSC") return "DECIDE";
  if (p === "MEMORY" || p === "DONE") return "LEARN";
  return "ACT";
}

export function phaseAt(clock: number): Phase {
  let current: Phase = "IDLE";
  for (const p of PHASES) {
    if (clock >= PHASE_AT[p] && PHASE_AT[p] >= 0) current = p;
  }
  return current;
}

/** Ordered index, handy for "has this phase been reached yet" checks. */
export function phaseIndex(p: Phase): number {
  return PHASES.indexOf(p);
}
export function reached(current: Phase, target: Phase): boolean {
  return phaseIndex(current) >= phaseIndex(target);
}

export interface DecayState {
  remaining: number; // seconds left in the opportunity window
  fraction: number; // 0..1 of window remaining
  color: string; // CSS var for current decay color
  label: "STABLE" | "URGENT" | "CRITICAL";
  locked: boolean;
}

/** Compressed Time-to-Expiry, colored along the reserved decay ramp. */
export function decayState(clock: number, phase: Phase): DecayState {
  const fireAt = PHASE_AT.COE_FIRE;
  const started = clock >= fireAt;
  const lockAt = PHASE_AT.ACTIVATED;
  const locked = clock >= lockAt;
  const effectiveClock = locked ? lockAt : clock;

  const elapsedOpp = started
    ? ((effectiveClock - fireAt) / 1000) * COUNTDOWN_COMPRESSION
    : 0;
  const remaining = Math.max(0, BRAND.windowSeconds - elapsedOpp);
  const fraction = remaining / BRAND.windowSeconds;

  let color = "var(--decay-cool)";
  let label: DecayState["label"] = "STABLE";
  if (fraction < 0.3) {
    color = "var(--decay-crit)";
    label = "CRITICAL";
  } else if (fraction < 0.62) {
    color = "var(--decay-warn)";
    label = "URGENT";
  }
  return { remaining, fraction, color, label, locked };
}

export function fmtClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}
