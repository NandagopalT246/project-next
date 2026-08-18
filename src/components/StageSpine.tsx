"use client";

import { motion } from "framer-motion";
import { reached, stageForPhase, type Phase, type Stage } from "@/lib/demo";

const STAGES: { key: Stage; label: string; sub: string; reachAt: Phase }[] = [
  { key: "DISCOVER", label: "DISCOVER", sub: "COE · Opportunity Engine", reachAt: "COE_STREAM" },
  { key: "DECIDE", label: "DECIDE", sub: "BSC · Strategy guardrail", reachAt: "BSC" },
  { key: "ACT", label: "ACT", sub: "BAE · Action Engine", reachAt: "BAE_INTAKE" },
  { key: "LEARN", label: "LEARN", sub: "Brand Memory", reachAt: "MEMORY" },
];

export function StageSpine({ phase }: { phase: Phase }) {
  const active = stageForPhase(phase);

  return (
    <div className="flex h-full flex-col justify-center gap-1 py-4">
      {STAGES.map((s, i) => {
        const isReached = reached(phase, s.reachAt);
        const isActive = active === s.key;
        return (
          <div key={s.key} className="relative flex items-stretch gap-3">
            {/* node + connector */}
            <div className="relative flex w-4 flex-col items-center">
              <motion.span
                className="z-10 mt-2 h-3 w-3 rounded-full border-2"
                animate={{
                  borderColor: isReached ? "var(--signal)" : "var(--line)",
                  backgroundColor: isActive ? "var(--signal)" : isReached ? "color-mix(in srgb, var(--signal) 35%, transparent)" : "var(--void)",
                  boxShadow: isActive ? "0 0 12px var(--signal)" : "0 0 0 transparent",
                  scale: isActive ? 1.25 : 1,
                }}
                transition={{ duration: 0.4 }}
              />
              {i < STAGES.length - 1 && (
                <div className="relative my-1 w-[2px] flex-1 overflow-hidden rounded bg-line">
                  <motion.div
                    className="absolute inset-x-0 top-0 rounded bg-signal"
                    animate={{ height: reached(phase, STAGES[i + 1].reachAt) ? "100%" : "0%" }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              )}
            </div>

            {/* label */}
            <div className="pb-6 pt-0.5">
              <motion.div
                className="text-[13px] font-semibold tracking-wide"
                animate={{ color: isActive ? "var(--ink)" : isReached ? "var(--muted)" : "var(--faint)" }}
              >
                {s.label}
              </motion.div>
              <div className="mt-0.5 text-[10px] tracking-wide text-faint">{s.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
