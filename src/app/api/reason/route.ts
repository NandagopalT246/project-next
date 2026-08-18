import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BRAND, OPPORTUNITY, FALLBACK_REASONING } from "@/config/brand";
import type { Reasoning } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Candidate models, newest-first. We try each in order and use the first that
 * responds — so a retired model (e.g. an old gemini-1.5-*) never breaks the demo,
 * and the code keeps working as Google rolls model names forward.
 */
const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
  "gemini-1.5-flash",
];

/**
 * Reasoning brain. Uses Gemini when GEMINI_API_KEY is present and a model
 * responds; otherwise — or on ANY failure — returns the scripted fallback so the
 * demo never breaks. Always responds 200 with a valid Reasoning payload.
 * Pass ?debug=1 to see which model was used / why it fell back (no key exposed).
 */
export async function POST(req: Request) {
  const debug = new URL(req.url).searchParams.get("debug") === "1";
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return NextResponse.json(
      debug ? { ...FALLBACK_REASONING, _debug: { reason: "no GEMINI_API_KEY set" } } : FALLBACK_REASONING,
    );
  }

  const genAI = new GoogleGenerativeAI(key);
  const prompt = buildPrompt();
  const errors: Record<string, string> = {};

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: { temperature: 0.7, responseMimeType: "application/json" },
      });
      const result = await model.generateContent(prompt);
      const parsed = coerce(JSON.parse(result.response.text()));
      return NextResponse.json(debug ? { ...parsed, _debug: { model: modelName } } : parsed);
    } catch (e) {
      errors[modelName] = e instanceof Error ? e.message : String(e);
    }
  }

  // Every model failed — fall back cleanly.
  return NextResponse.json(
    debug ? { ...FALLBACK_REASONING, _debug: { keyPresent: true, errors } } : FALLBACK_REASONING,
  );
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
    flaggedRisks: o.flaggedRisks?.length ? o.flaggedRisks : FALLBACK_REASONING.flaggedRisks,
    optionC: { ...FALLBACK_REASONING.optionC, ...o.optionC, id: "C" },
    source: "gemini",
  };
}
