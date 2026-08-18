import type { ReactNode } from "react";

export function Panel({
  title,
  tag,
  right,
  children,
  grid,
  className = "",
  bodyClass = "",
}: {
  title?: ReactNode;
  tag?: string;
  right?: ReactNode;
  children: ReactNode;
  grid?: boolean;
  className?: string;
  bodyClass?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-line bg-panel/70 backdrop-blur-sm ${className}`}
    >
      {grid && (
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-[0.35]" />
      )}
      {(title || tag || right) && (
        <div className="relative flex items-center justify-between border-b border-line-soft px-4 py-2.5">
          <div className="flex items-baseline gap-2">
            {tag && <span className="micro text-faint">{tag}</span>}
            {title && (
              <span className="text-[13px] font-medium tracking-wide text-ink">
                {title}
              </span>
            )}
          </div>
          {right}
        </div>
      )}
      <div className={`relative ${bodyClass || "p-4"}`}>{children}</div>
    </div>
  );
}
