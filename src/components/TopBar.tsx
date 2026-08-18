"use client";

import { motion } from "framer-motion";
import { BRAND } from "@/config/brand";
import { fmtClock } from "@/lib/demo";

export function TopBar({
  running,
  started,
  clockMs,
  reasoningSource,
  onRun,
  onReset,
}: {
  running: boolean;
  started: boolean;
  clockMs: number;
  reasoningSource: "gemini" | "fallback";
  onRun: () => void;
  onReset: () => void;
}) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-line bg-panel/60 px-5 py-3 backdrop-blur">
      {/* left — identity */}
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-raised">
          <span className="text-signal">◈</span>
        </div>
        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-wide text-ink">Project NEXT</span>
            <span className="micro rounded border border-line px-1.5 py-0.5 text-faint">
              {BRAND.parent} · cockpit
            </span>
          </div>
          <div className="text-[11px] text-faint">AI-native brand lifecycle · Discover → Decide → Act → Learn</div>
        </div>
      </div>

      {/* center — reasoning provenance */}
      <div className="hidden items-center gap-2 md:flex">
        <span className="flex items-center gap-1.5 rounded-full border border-line bg-void/50 px-3 py-1 text-[11px] text-muted">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: reasoningSource === "gemini" ? "var(--confirm)" : "var(--signal)" }}
          />
          Reasoning:{" "}
          <span className="font-medium text-ink">
            {reasoningSource === "gemini" ? "Gemini" : "Gemini · scripted"}
          </span>
        </span>
      </div>

      {/* right — clock + controls */}
      <div className="flex items-center gap-3">
        <div className="text-right leading-none">
          <div className="micro text-faint">mission clock</div>
          <div className="tnum text-sm text-muted">{fmtClock(clockMs / 1000)}</div>
        </div>

        {started && (
          <button
            onClick={onReset}
            className="rounded-lg border border-line px-3 py-2 text-[12px] font-medium text-muted transition hover:border-muted hover:text-ink"
          >
            Reset
          </button>
        )}
        <motion.button
          onClick={onRun}
          whileTap={{ scale: 0.96 }}
          className="relative flex items-center gap-2 overflow-hidden rounded-lg border border-signal/50 bg-signal/15 px-4 py-2 text-[13px] font-semibold text-ink transition hover:bg-signal/25"
        >
          {running && (
            <span className="pointer-events-none absolute inset-0 -skew-x-12">
              <span className="animate-sweep absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-signal/25 to-transparent" />
            </span>
          )}
          <span className="relative">{running ? "● Running…" : started ? "▶ Replay Demo" : "▶ Run Demo"}</span>
        </motion.button>
      </div>
    </header>
  );
}
