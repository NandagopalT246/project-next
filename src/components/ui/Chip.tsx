import type { Verdict } from "@/lib/types";

const VERDICT_STYLE: Record<Verdict, string> = {
  ACT: "text-act border-act/50 bg-act/10",
  MONITOR: "text-monitor border-monitor/40 bg-monitor/10",
  IGNORE: "text-ignore border-ignore/40 bg-ignore/10",
};

export function VerdictChip({
  verdict,
  glow = false,
}: {
  verdict: Verdict;
  glow?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wider ${VERDICT_STYLE[verdict]}`}
      style={glow && verdict === "ACT" ? { animation: "pulse-ring 2s infinite" } : undefined}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {verdict}
    </span>
  );
}

export function Tag({
  children,
  color = "var(--muted)",
  className = "",
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium ${className}`}
      style={{ color, borderColor: `color-mix(in srgb, ${color} 40%, transparent)`, background: `color-mix(in srgb, ${color} 8%, transparent)` }}
    >
      {children}
    </span>
  );
}
