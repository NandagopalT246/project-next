"use client";

import { AnimatePresence, animate, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { Tag } from "@/components/ui/Chip";
import { reached, type Phase } from "@/lib/demo";
import type { CreativeOption, Reasoning } from "@/lib/types";

function useCountUp(value: number, active: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) {
      setN(0);
      return;
    }
    const c = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => c.stop();
  }, [value, active]);
  return n;
}

function EngagementReadout({
  value,
  active,
  color,
  delta,
}: {
  value: number;
  active: boolean;
  color: string;
  delta?: number;
}) {
  const n = useCountUp(value, active);
  return (
    <div className="flex items-center gap-2">
      <span className="micro text-faint">pred. engagement</span>
      <span className="tnum text-lg font-semibold" style={{ color }}>{n}</span>
      {delta ? (
        <span className="tnum text-[11px] font-semibold text-confirm">+{delta}</span>
      ) : null}
    </div>
  );
}

function OptionCard({
  option,
  tone,
  scanning,
  struck,
  active,
  delta,
  children,
}: {
  option: CreativeOption;
  tone: "neutral" | "reject" | "win";
  scanning?: boolean;
  struck?: boolean;
  active: boolean;
  delta?: number;
  children?: React.ReactNode;
}) {
  const border =
    tone === "win" ? "border-confirm/45" : tone === "reject" ? "border-decay-crit/40" : "border-line";
  const color = tone === "win" ? "var(--confirm)" : tone === "reject" ? "var(--decay-crit)" : "var(--signal)";

  return (
    <motion.div
      layout
      animate={{
        opacity: struck ? 0.45 : 1,
        filter: struck ? "grayscale(0.7)" : "grayscale(0)",
        scale: struck ? 0.98 : 1,
      }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-xl border ${border} bg-void/40 p-3.5`}
    >
      {/* scan sweep */}
      {scanning && (
        <motion.div
          className="pointer-events-none absolute inset-y-0 w-1/3"
          style={{ background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--signal) 30%, transparent), transparent)" }}
          animate={{ x: ["-120%", "360%"] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}
        />
      )}
      <div className="relative flex items-center justify-between">
        <span className="text-[12px] font-semibold" style={{ color }}>{option.label}</span>
        <span className="micro text-faint">{option.channel}</span>
      </div>
      <p
        className={`relative mt-2 text-[13px] leading-relaxed ${struck ? "text-faint line-through decoration-decay-crit/60" : "text-ink"}`}
      >
        {option.copy}
      </p>
      <div className="relative mt-3 flex items-center justify-between">
        <EngagementReadout value={option.predictedEngagement} active={active} color={color} delta={delta} />
      </div>
      {children}
    </motion.div>
  );
}

export function CreativeStudio({
  phase,
  reasoning,
}: {
  phase: Phase;
  reasoning: Reasoning;
}) {
  const showA = reached(phase, "BAE_DRAFT_A");
  const preflight = reached(phase, "BAE_PREFLIGHT");
  const struck = reached(phase, "BAE_STRIKE");
  const showC = reached(phase, "BAE_OPTION_C");
  const scanning = preflight && !struck;
  const delta = reasoning.optionC.predictedEngagement - reasoning.optionA.predictedEngagement;

  return (
    <Panel
      tag="BAE"
      title="Creative · Pre-Flight Simulation"
      grid
      className="flex min-h-0 flex-1 flex-col"
      bodyClass="p-4 flex-1 min-h-0 overflow-y-auto"
      right={
        <AnimatePresence>
          {scanning && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, repeat: Infinity }}
              className="micro font-semibold text-signal"
            >
              ◍ simulating audience reaction…
            </motion.span>
          )}
          {struck && !showC && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="micro font-semibold text-decay-crit">
              ⚠ flaw detected
            </motion.span>
          )}
          {showC && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="micro font-semibold text-confirm">
              ✓ improved draft ready
            </motion.span>
          )}
        </AnimatePresence>
      }
    >
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {showA && (
            <motion.div key="a" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <OptionCard
                option={reasoning.optionA}
                tone={struck ? "reject" : "neutral"}
                scanning={scanning}
                struck={struck}
                active={showA}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* self-critique callout */}
        <AnimatePresence>
          {preflight && (
            <motion.div
              key="crit"
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-decay-crit/30 bg-decay-crit/[0.06] p-3.5"
            >
              <div className="flex items-center gap-2">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-decay-crit/20 text-[11px] text-decay-crit">!</span>
                <span className="micro font-semibold text-decay-crit">AI self-critique</span>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink">{reasoning.critique}</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {reasoning.flaggedRisks.map((r) => (
                  <Tag key={r} color="var(--decay-crit)">⚑ {r}</Tag>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* improved Option C rises */}
        <AnimatePresence>
          {showC && (
            <motion.div
              key="c"
              initial={{ opacity: 0, y: 22, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <OptionCard option={reasoning.optionC} tone="win" active={showC} delta={delta} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Panel>
  );
}
