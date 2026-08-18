"use client";

import { AnimatePresence, motion } from "framer-motion";
import { reached, type Phase } from "@/lib/demo";

const TIERS = [
  { n: 1, label: "Low risk", route: "Auto-approved" },
  { n: 2, label: "Medium risk", route: "1-click human" },
  { n: 3, label: "High risk", route: "Escalate" },
];

export function ApprovalBar({
  phase,
  approved,
  onApprove,
}: {
  phase: Phase;
  approved: boolean;
  onApprove: () => void;
}) {
  const armed = reached(phase, "APPROVAL");

  return (
    <div className="rounded-2xl border border-line bg-panel/70 p-3 backdrop-blur-sm">
      <div className="mb-2.5 flex items-center justify-between px-1">
        <span className="micro text-faint">Tiered human governance</span>
        <span className="micro text-faint">AI never auto-publishes</span>
      </div>

      <div className="flex items-stretch gap-2">
        {TIERS.map((t) => {
          const isGate = t.n === 2;
          const done = isGate && approved;
          return (
            <div
              key={t.n}
              className={`flex-1 rounded-xl border px-3 py-2 ${
                isGate
                  ? done
                    ? "border-confirm/50 bg-confirm/10"
                    : armed
                      ? "border-act/50 bg-act/[0.08]"
                      : "border-line bg-void/30"
                  : "border-line-soft bg-void/20 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="micro text-faint">Tier {t.n}</span>
                <span
                  className="micro font-semibold"
                  style={{
                    color: done ? "var(--confirm)" : isGate && armed ? "var(--act)" : "var(--faint)",
                  }}
                >
                  {t.label}
                </span>
              </div>
              <div className="mt-1 text-[12px] text-muted">{t.route}</div>
            </div>
          );
        })}

        {/* action */}
        <div className="flex w-[190px] shrink-0 items-center">
          <AnimatePresence mode="wait">
            {!approved ? (
              <motion.button
                key="approve"
                onClick={onApprove}
                disabled={!armed}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: armed ? 1 : 0.4,
                  boxShadow: armed
                    ? ["0 0 0 rgba(255,176,32,0)", "0 0 22px rgba(255,176,32,0.35)", "0 0 0 rgba(255,176,32,0)"]
                    : "none",
                }}
                transition={{ boxShadow: { duration: 1.6, repeat: Infinity } }}
                className="h-full w-full rounded-xl border border-act/60 bg-act/15 text-[13px] font-semibold text-ink disabled:cursor-not-allowed"
              >
                {armed ? "✓ Approve & Activate" : "Awaiting review"}
              </motion.button>
            ) : (
              <motion.div
                key="activated"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 16 }}
                className="grid h-full w-full place-items-center rounded-xl border border-confirm/60 bg-confirm/15"
              >
                <span className="text-[13px] font-semibold text-confirm">● ACTIVATED</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
