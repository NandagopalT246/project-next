import { FALLBACK_REASONING } from "@/config/brand";
import type { Reasoning } from "@/lib/types";

/**
 * Client-side reasoning fetch. Talks to /api/reason (Gemini-backed) and,
 * on ANY failure, returns the scripted fallback so the cockpit always plays.
 */
export async function fetchReasoning(signal?: AbortSignal): Promise<Reasoning> {
  try {
    const res = await fetch("/api/reason", { method: "POST", signal });
    if (!res.ok) return FALLBACK_REASONING;
    const data = (await res.json()) as Reasoning;
    if (!data?.optionA?.copy || !data?.optionC?.copy) return FALLBACK_REASONING;
    return data;
  } catch {
    return FALLBACK_REASONING;
  }
}
