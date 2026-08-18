"use client";

import { motion } from "framer-motion";
import { VerdictChip } from "@/components/ui/Chip";
import { QUEUE } from "@/config/brand";
import { fmtClock } from "@/lib/demo";

export function OpportunityQueue({
  hotRemaining,
  clockSec,
}: {
  hotRemaining: number;
  clockSec: number;
}) {
  const acts = QUEUE.filter((q) => q.verdict === "ACT").length;

  return (
    <div className="flex min-h-0 flex-col">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="micro text-faint">Opportunity Queue</span>
        <span className="micro text-faint">
          <span className="text-act">{acts} ACT</span> · {QUEUE.length - acts} held
        </span>
      </div>
      <div className="flex min-h-0 flex-col gap-2 overflow-y-auto pr-1">
        {QUEUE.map((q, i) => {
          const remaining = q.hot ? hotRemaining : Math.max(0, q.windowSeconds - clockSec);
          const hot = !!q.hot;
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: hot ? 1 : 0.72, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border px-3 py-2.5 ${
                hot ? "border-act/40 bg-act/[0.06]" : "border-line-soft bg-void/30"
              }`}
              style={hot ? { boxShadow: "0 0 20px color-mix(in srgb, var(--act) 12%, transparent)" } : undefined}
            >
              <div className="flex items-center justify-between gap-2">
                <span className={`truncate text-[12px] font-medium ${hot ? "text-ink" : "text-muted"}`}>
                  {q.brand}
                </span>
                <VerdictChip verdict={q.verdict} />
              </div>
              <div className="mt-1 truncate text-[11px] text-faint">{q.summary}</div>
              <div className="mt-2 flex items-center justify-between">
                <span className="micro text-faint">
                  score <span className="tnum text-muted">{q.score}</span>
                </span>
                <span
                  className="tnum text-[11px]"
                  style={{ color: hot ? "var(--decay-warn)" : "var(--faint)" }}
                >
                  {fmtClock(remaining)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
