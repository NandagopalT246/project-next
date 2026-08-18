"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Panel } from "@/components/ui/Panel";
import { VerdictChip, Tag } from "@/components/ui/Chip";
import { SIGNALS, MOMENTUM_THRESHOLD, OPPORTUNITY, BRAND } from "@/config/brand";
import { PHASE_AT, reached, type Phase } from "@/lib/demo";

const FIRE_MS = PHASE_AT.COE_FIRE;

/** Smooth, late-accelerating momentum curve that crosses threshold just before fire. */
function momentumAt(clock: number): number {
  const t = Math.min(Math.max(clock, 0), FIRE_MS) / FIRE_MS;
  const eased = Math.pow(t, 1.8);
  return 6 + eased * 82; // → ~88 at fire
}

function MomentumChart({ clock }: { clock: number }) {
  const W = 320;
  const H = 120;
  const cap = Math.min(clock, FIRE_MS);
  const N = Math.max(2, Math.floor((cap / FIRE_MS) * 48) + 1);
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const ms = (i / (N - 1)) * cap;
    const x = (ms / FIRE_MS) * W;
    const y = H - (momentumAt(ms) / 100) * H;
    pts.push([x, y]);
  }
  const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `0,${H} ${line} ${pts[pts.length - 1][0].toFixed(1)},${H}`;
  const thY = H - (MOMENTUM_THRESHOLD / 100) * H;
  const head = pts[pts.length - 1];
  const crossed = momentumAt(cap) >= MOMENTUM_THRESHOLD;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[120px] w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="mom" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* threshold */}
      <line x1="0" y1={thY} x2={W} y2={thY} stroke="var(--decay-warn)" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
      <polygon points={area} fill="url(#mom)" />
      <polyline points={line} fill="none" stroke={crossed ? "var(--decay-warn)" : "var(--signal)"} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {head && (
        <circle cx={head[0]} cy={head[1]} r="3.5" fill={crossed ? "var(--decay-warn)" : "var(--signal)"}>
          <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}

export function DiscoveryPanel({ clock, phase }: { clock: number; phase: Phase }) {
  const visible = SIGNALS.filter((s) => s.appearAt <= clock);
  const fired = reached(phase, "COE_FIRE");
  const bscOk = reached(phase, "BSC");
  const momentum = Math.round(momentumAt(clock));

  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
      {/* signal feed */}
      <Panel
        tag="COE"
        title="Consumer Opportunity Engine"
        grid
        right={<span className="micro text-faint">Simulated feed · representative data</span>}
        className="flex min-h-0 flex-col"
        bodyClass="p-3 flex-1 min-h-0"
      >
        <div className="flex h-full flex-col gap-2 overflow-hidden">
          <AnimatePresence initial={false}>
            {visible
              .slice()
              .reverse()
              .map((s) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start gap-3 rounded-lg border border-line-soft bg-void/40 px-3 py-2"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                  <div className="min-w-0">
                    <div className="text-[13px] text-ink">{s.text}</div>
                    <div className="micro mt-0.5 text-faint">{s.source}</div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
          {visible.length === 0 && (
            <div className="grid flex-1 place-items-center text-[12px] text-faint">
              Listening across platforms…
            </div>
          )}
        </div>
      </Panel>

      {/* momentum + emitted object */}
      <div className="flex min-h-0 flex-col gap-4">
        <Panel tag="Signal" title="Momentum" right={<span className="tnum text-sm" style={{ color: momentum >= MOMENTUM_THRESHOLD ? "var(--decay-warn)" : "var(--signal)" }}>{momentum}</span>}>
          <MomentumChart clock={clock} />
          <div className="mt-2 flex items-center justify-between">
            <span className="micro text-faint">threshold {MOMENTUM_THRESHOLD}</span>
            <AnimatePresence>
              {momentum >= MOMENTUM_THRESHOLD && !fired && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="micro font-semibold text-decay-warn">
                  ▲ crossing threshold
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </Panel>

        {/* Opportunity Object crystallizes on fire */}
        <AnimatePresence>
          {fired && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Panel
                tag="Emitted"
                title="Opportunity Object"
                className="border-act/30"
                right={<span className="tnum text-[11px] text-faint">{OPPORTUNITY.id}</span>}
              >
                <div className="text-[13px] font-medium text-ink">{OPPORTUNITY.headline}</div>
                <div className="mt-1 text-[11px] leading-relaxed text-muted">{BRAND.moment}</div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <VerdictChip verdict="ACT" glow />
                  <AnimatePresence>
                    {bscOk && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8, x: -6 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      >
                        <Tag color="var(--confirm)">✓ Within brand strategy</Tag>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </Panel>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
