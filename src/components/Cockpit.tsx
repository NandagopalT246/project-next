"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TopBar } from "@/components/TopBar";
import { StageSpine } from "@/components/StageSpine";
import { DiscoveryPanel } from "@/components/coe/DiscoveryPanel";
import { DecisionPanel } from "@/components/bae/DecisionPanel";
import { CreativeStudio } from "@/components/bae/CreativeStudio";
import { ApprovalBar } from "@/components/bae/ApprovalBar";
import { OpportunityQueue } from "@/components/bae/OpportunityQueue";
import { BrandMemory } from "@/components/memory/BrandMemory";
import { Countdown } from "@/components/ui/Countdown";
import { useDemo } from "@/lib/useDemo";
import { phaseIndex, reached } from "@/lib/demo";
import { BRAND } from "@/config/brand";

const SIGNATURES = [
  { k: "Time-to-Expiry", v: "value decays live as the window closes" },
  { k: "Pre-Flight Simulation", v: "the AI critiques its own draft, then improves it" },
  { k: "Tiered Governance", v: "no auto-publish — humans hold the gate" },
];

export function Cockpit() {
  const d = useDemo();
  const started = d.started;
  const phase = started ? d.phase : "IDLE";
  const idx = phaseIndex(phase);
  const idle = !started;
  const showDiscovery = started && idx < phaseIndex("BAE_INTAKE");
  const showBae = started && idx >= phaseIndex("BAE_INTAKE") && idx < phaseIndex("MEMORY");
  const showMemory = started && idx >= phaseIndex("MEMORY");
  const fired = started && reached(phase, "COE_FIRE");
  const intook = started && reached(phase, "BAE_INTAKE");

  return (
    <div className="flex h-screen flex-col">
      <TopBar
        running={d.running}
        started={d.started}
        clockMs={d.clock}
        reasoningSource={d.reasoning.source}
        onRun={d.run}
        onReset={d.reset}
      />

      <div className="grid min-h-0 flex-1 grid-cols-[210px_1fr] gap-4 p-4 xl:grid-cols-[230px_1fr_370px]">
        {/* left spine */}
        <aside className="min-h-0 rounded-2xl border border-line bg-panel/40 px-3">
          <StageSpine phase={phase} />
        </aside>

        {/* center stage */}
        <main className="relative min-h-0">
          <AnimatePresence>
            {idle && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center">
                <div className="max-w-xl text-center">
                  <div className="micro text-faint">{BRAND.parent} · {BRAND.name}</div>
                  <h1 className="mt-3 text-[34px] font-semibold leading-tight text-ink">
                    Opportunity detected → live action,<br />in <span className="text-confirm">~90 minutes</span>.
                  </h1>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">
                    A thin, end-to-end slice of an AI-native brand lifecycle. Press <span className="text-ink font-medium">Run Demo</span> to watch one live moment move from signal to approved, on-brand action.
                  </p>
                  <div className="mt-6 flex flex-col gap-2">
                    {SIGNATURES.map((s) => (
                      <div key={s.k} className="flex items-center gap-3 rounded-xl border border-line-soft bg-void/30 px-4 py-2.5 text-left">
                        <span className="text-signal">◆</span>
                        <div>
                          <div className="text-[13px] font-medium text-ink">{s.k}</div>
                          <div className="text-[11px] text-faint">{s.v}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {showDiscovery && (
              <motion.div key="discovery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, filter: "blur(6px)" }} transition={{ duration: 0.4 }} className="absolute inset-0">
                <DiscoveryPanel clock={d.clock} phase={phase} />
              </motion.div>
            )}

            {showBae && (
              <motion.div key="bae" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="absolute inset-0 flex min-h-0 flex-col gap-4">
                <DecisionPanel phase={phase} reasoning={d.reasoning} />
                <CreativeStudio phase={phase} reasoning={d.reasoning} />
                <ApprovalBar phase={phase} approved={d.approved} onApprove={d.approve} />
              </motion.div>
            )}

            {showMemory && (
              <motion.div key="memory" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                <BrandMemory active={showMemory} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* right rail */}
        <aside className="hidden min-h-0 flex-col gap-4 xl:flex">
          <AnimatePresence>
            {fired && (
              <motion.div key="cd" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                <Countdown decay={d.decay} />
              </motion.div>
            )}
          </AnimatePresence>

          {intook ? (
            <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-line bg-panel/40 p-3">
              <OpportunityQueue hotRemaining={d.decay.remaining} clockSec={Math.floor(d.clock / 1000)} />
            </div>
          ) : (
            <div className="flex flex-1 flex-col justify-end rounded-2xl border border-line-soft bg-panel/30 p-4">
              <div className="micro text-faint">system status</div>
              <div className="mt-1 text-[12px] text-muted">
                {idle ? "Idle · awaiting run" : "COE listening · momentum building"}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
