"use client";

import { animate, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Panel } from "@/components/ui/Panel";
import { MEMORY } from "@/config/brand";

function Bar({ label, value, color, active, delay }: { label: string; value: number; color: string; active: boolean; delay: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return setN(0);
    const c = animate(0, value, { duration: 1, delay, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [active, value, delay]);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-muted">{label}</span>
        <span className="tnum font-semibold" style={{ color }}>{n}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-void/70">
        <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: active ? `${value}%` : 0 }} transition={{ duration: 1, delay }} />
      </div>
    </div>
  );
}

export function BrandMemory({ active }: { active: boolean }) {
  return (
    <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
      <Panel tag="Learn" title="Brand Memory" grid className="flex flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <Bar label="Predicted engagement (Option C)" value={MEMORY.predicted} color="var(--signal)" active={active} delay={0.2} />
            <Bar label="Actual engagement (live)" value={MEMORY.actual} color="var(--confirm)" active={active} delay={0.6} />
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} transition={{ delay: 1.4 }} className="flex items-center gap-2">
            <span className="rounded-md border border-confirm/40 bg-confirm/10 px-2 py-0.5 text-[11px] font-semibold text-confirm">{MEMORY.lift}</span>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: active ? 1 : 0, y: active ? 0 : 6 }} transition={{ delay: 1.7 }} className="border-l-2 border-line pl-3 text-[12.5px] leading-relaxed text-muted">
            {MEMORY.learned}
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0 }} transition={{ delay: 2.1 }} className="flex items-center gap-2 text-[12px] text-confirm">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-confirm/60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-confirm" /></span>
            System updated — next decision starts smarter.
          </motion.div>
        </div>
      </Panel>

      {/* headline stat */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.95 }}
        transition={{ delay: 2.3, duration: 0.6 }}
        className="grid place-items-center rounded-2xl border border-signal/30 bg-gradient-to-b from-signal/[0.12] to-transparent p-6 text-center"
      >
        <div>
          <div className="micro text-faint">Project NEXT · outcome</div>
          <div className="mt-3 text-[30px] font-semibold leading-tight text-ink">
            From <span className="text-decay-warn">21 days</span>
            <br />to <span className="tnum text-confirm">90 minutes</span>
          </div>
          <div className="mt-3 text-[12px] text-muted">{MEMORY.subStat}</div>
        </div>
      </motion.div>
    </div>
  );
}
