"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/** Animated circular gauge that counts up to `value` when `active` flips true. */
export function ScoreDial({
  value,
  active,
  size = 132,
  stroke = 9,
  color = "var(--signal)",
  suffix = "/100",
}: {
  value: number;
  active: boolean;
  size?: number;
  stroke?: number;
  color?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const progress = useMotionValue(0);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dashoffset = useTransform(progress, (p) => circ * (1 - p));

  useEffect(() => {
    if (!active) {
      setDisplay(0);
      progress.set(0);
      return;
    }
    const num = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    const ring = animate(progress, value / 100, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => {
      num.stop();
      ring.stop();
    };
  }, [active, value, progress]);

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          style={{ strokeDashoffset: dashoffset, filter: `drop-shadow(0 0 6px color-mix(in srgb, ${color} 55%, transparent))` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="tnum text-[34px] font-semibold leading-none text-ink">{display}</span>
        <span className="micro mt-1 text-faint">{suffix}</span>
      </div>
    </div>
  );
}
