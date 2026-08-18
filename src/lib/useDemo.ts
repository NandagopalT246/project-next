"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AUTO_APPROVE_AT,
  DEMO_LENGTH,
  decayState,
  phaseAt,
  type Phase,
} from "@/lib/demo";
import { fetchReasoning } from "@/lib/reasoning";
import { FALLBACK_REASONING } from "@/config/brand";
import type { Reasoning } from "@/lib/types";

export interface DemoState {
  clock: number;
  phase: Phase;
  running: boolean;
  started: boolean;
  approved: boolean;
  reasoning: Reasoning;
  reasoningReady: boolean;
  decay: ReturnType<typeof decayState>;
  run: () => void;
  reset: () => void;
  approve: () => void;
}

export function useDemo(): DemoState {
  const [clock, setClock] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [approved, setApproved] = useState(false);
  const [reasoning, setReasoning] = useState<Reasoning | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTsRef = useRef<number>(0);
  const approvedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const run = useCallback(() => {
    stopTimer();
    approvedRef.current = false;
    setApproved(false);
    setStarted(true);
    setRunning(true);
    setClock(0);

    // Kick the reasoning brain (Gemini or fallback) so it's ready by BAE.
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setReasoning(null);
    fetchReasoning(ctrl.signal).then((r) => setReasoning(r));

    startTsRef.current = performance.now();
    // setInterval (not rAF) so the timeline advances even if the tab is not
    // being composited, and stays deterministic via performance.now().
    timerRef.current = setInterval(() => {
      const c = Math.min(performance.now() - startTsRef.current, DEMO_LENGTH);
      setClock(c);
      if (c >= AUTO_APPROVE_AT && !approvedRef.current) {
        approvedRef.current = true;
        setApproved(true);
      }
      if (c >= DEMO_LENGTH) {
        stopTimer();
        setRunning(false);
      }
    }, 33);
  }, [stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    abortRef.current?.abort();
    approvedRef.current = false;
    setRunning(false);
    setStarted(false);
    setApproved(false);
    setClock(0);
    setReasoning(null);
  }, [stopTimer]);

  const approve = useCallback(() => {
    approvedRef.current = true;
    setApproved(true);
  }, []);

  useEffect(() => {
    return () => {
      stopTimer();
      abortRef.current?.abort();
    };
  }, [stopTimer]);

  const phase = useMemo(() => phaseAt(clock), [clock]);
  const decay = useMemo(() => decayState(clock, phase), [clock, phase]);

  return {
    clock,
    phase,
    running,
    started,
    approved,
    reasoning: reasoning ?? FALLBACK_REASONING,
    reasoningReady: reasoning !== null,
    decay,
    run,
    reset,
    approve,
  };
}
