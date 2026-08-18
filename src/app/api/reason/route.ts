import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BRAND, OPPORTUNITY, FALLBACK_REASONING } from "@/config/brand";
import type { Reasoning } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Reasoning brain. Uses Gemini when GEMINI_API_KEY is present; otherwise —
 * or on ANY failure — returns the scripted fallback so the demo never breaks.
 * Always responds 200 with a valid Reasoning payload.
 */
export async function POST() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json(FALLBACK_REASONING);

  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });

    const prompt = buildPrompt();
    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const parsed = coerce(JSON.parse(raw));
    return NextResponse.json(parsed);
  } catch {
    // Never surface an error to the cockpit — fall back cleanly.
    return NextResponse.json(FALLBACK_REASONING);
  }
}

function buildPrompt(): string {
  return `You are the Brand Action Engine for ${BRAND.parent}'s brand "${BRAND.name}".
A time-critical opportunity has been detected via social listening and platform APIs (never call it scraping):

MOMENT: ${BRAND.moment}
OPPORTUNITY: ${OPPORTUNITY.headline}
AUDIENCE: ${OPPORTUNITY.audience}
BRAND EQUITY: warmth, ${BRAND.accentWord}, everyday human connection. Hashtag ${BRAND.hashtag}.

Do three things and return ONLY JSON matching this exact TypeScript shape:
{
  "rationale": string,            // one tight sentence: why ACT now, on-brand
  "optionA": { "id": "A", "label": "Option A · first draft", "channel": string, "copy": string, "predictedEngagement": number, "risks": string[] },
  "critique": string,             // the AI critiquing its OWN Option A
  "flaggedRisks": string[],       // 2 short risks with Option A
  "optionC": { "id": "C", "label": "Option C · improved", "channel": string, "copy": string, "predictedEngagement": number, "risks": string[] }
}

Rules:
- Option A MUST contain a real flaw: it references the LIVE match/event directly, so it risks a broadcast-IP clash and reads as opportunistic. predictedEngagement ~68-74.
- The critique must catch that flaw honestly, in the AI's own voice.
- Option C MUST fix it: emotion-led, brand-owned, references NO event/broadcast IP, still warm. predictedEngagement ~84-88 (higher than A).
- Copy is short, social-ready, includes ${BRAND.hashtag}. Never use the word "scraping".`;
}

/** Defensive: guarantee the payload matches Reasoning, tag as gemini. */
function coerce(obj: unknown): Reasoning {
  const o = obj as Partial<Reasoning>;
  if (!o?.optionA?.copy || !o?.optionC?.copy || !o?.critique) {
    return FALLBACK_REASONING;
  }
  return {
    rationale: o.rationale ?? FALLBACK_REASONING.rationale,
    optionA: { ...FALLBACK_REASONING.optionA, ...o.optionA, id: "A" },
    critique: o.critique,
    flaggedRisks:
      o.flaggedRisks?.length ? o.flaggedRisks : FALLBACK_REASONING.flaggedRisks,
    optionC: { ...FALLBACK_REASONING.optionC, ...o.optionC, id: "C" },
    source: "gemini",
  };
}
