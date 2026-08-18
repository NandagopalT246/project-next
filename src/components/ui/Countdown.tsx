"use client";

import { motion } from "framer-motion";
import { fmtClock, type DecayState } from "@/lib/demo";

/**
 * Time-to-Expiry — the signature live countdown.
 * Uses the RESERVED decay ramp (cool → amber → red). Pulses harder as it decays;
 * freezes with a LOCK when the opportunity is activated.
 */
export function Countdown({ decay }: { decay: DecayState }) {
  const { remaining, fraction, color, label, locked } = decay;
  const urgency = 1 - fraction; // 0 calm → 1 critical
  const pulse = label === "STABLE" ? 0 : label === "URGENT" ? 1 : 1.8;

  return (
    <div
      className="relative rounded-2xl border px-4 py-3.5"
      style={{
        borderColor: `color-mix(in srgb, ${color} 45%, var(--line))`,
        background: `radial-gradient(120% 140% at 50% 0%, color-mix(in srgb, ${color} 14%, transparent), transparent 70%), var(--panel)`,
        boxShadow: locked ? "none" : `0 0 ${18 + urgency * 26}px color-mix(in srgb, ${color} ${18 + urgency * 22}%, transparent)`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="micro text-faint">Time-to-Expiry</span>
        <span
          className="micro font-semibold"
          style={{ color: locked ? "var(--confirm)" : color }}
        >
          {locked ? "LOCKED ✓" : label}
        </span>
      </div>

      <motion.div
        key={locked ? "locked" : "live"}
        className="tnum mt-1 text-[40px] font-semibold leading-none"
        style={{ color: locked ? "var(--ink)" : color }}
        animate={
          locked || pulse === 0
            ? { scale: 1, opacity: 1 }
            : { scale: [1, 1.015, 1], opacity: [1, 0.86, 1] }
        }
        transition={{ duration: Math.max(0.5, 1.4 - urgency), repeat: locked ? 0 : Infinity }}
      >
        {fmtClock(remaining)}
      </motion.div>

      {/* decay bar */}
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-void/70">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${fraction * 100}%`, background: locked ? "var(--confirm)" : color }}
        />
      </div>
    </div>
  );
}
