"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Panel } from "@/components/ui/Panel";
import { VerdictChip, Tag } from "@/components/ui/Chip";
import { ScoreDial } from "@/components/ui/ScoreDial";
import { OPPORTUNITY } from "@/config/brand";
import { reached, type Phase } from "@/lib/demo";
import type { Reasoning } from "@/lib/types";

export function DecisionPanel({
  phase,
  reasoning,
}: {
  phase: Phase;
  reasoning: Reasoning;
}) {
  const scoring = reached(phase, "BAE_SCORE");

  return (
    <Panel tag="BAE" title="Decision" grid className="shrink-0">
      <div className="flex items-center gap-5">
        <ScoreDial value={OPPORTUNITY.score} active={scoring} color="var(--confirm)" />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <AnimatePresence>
              {scoring && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-[13px] text-muted">Recommendation</span>
                  <VerdictChip verdict="ACT" glow />
                  <Tag color="var(--decay-warn)">Tier 2 · medium-risk</Tag>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {scoring && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                className="mt-3 border-l-2 border-confirm/40 pl-3 text-[13px] leading-relaxed text-ink"
              >
                {reasoning.rationale}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {scoring && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="mt-3 flex items-center gap-4 text-[11px] text-faint"
              >
                <span>momentum <span className="tnum text-muted">{OPPORTUNITY.momentum}</span></span>
                <span>audience <span className="text-muted">{OPPORTUNITY.audience.split(",")[0]}</span></span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Panel>
  );
}
