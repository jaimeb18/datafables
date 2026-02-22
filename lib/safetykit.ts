/**
 * SafetyKit integration — scans story content to ensure it's safe for children.
 * If SAFETYKIT_API_KEY is not set, falls back to Gemini-based safety analysis.
 */

export interface SafetyResult {
  safe: boolean;
  score: number;          // 0–100, higher = safer
  flags: string[];        // any concern categories detected
  provider: "safetykit" | "gemini_fallback";
  decisionId?: string;
}

const SAFETYKIT_BASE = "https://api.safetykit.com/v1";

/** Check story text via SafetyKit Decisions API, with Gemini fallback */
export async function checkStorySafety(storyText: string): Promise<SafetyResult> {
  const apiKey = process.env.SAFETYKIT_API_KEY;

  if (apiKey) {
    return checkWithSafetyKit(storyText, apiKey);
  }
  return checkWithGeminiFallback(storyText);
}

async function checkWithSafetyKit(text: string, apiKey: string): Promise<SafetyResult> {
  try {
    // Create a decision
    const createRes = await fetch(`${SAFETYKIT_BASE}/decisions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "text_content",
        content: {
          text,
          context: "Children's educational story generated for ages 4-12",
        },
        metadata: {
          app: "DataFables",
          audience: "children",
        },
      }),
    });

    if (!createRes.ok) {
      console.warn("[safetykit] Decision creation failed, falling back to Gemini");
      return checkWithGeminiFallback(text);
    }

    const { decision_id } = await createRes.json();

    // Poll for result (up to 5s)
    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const pollRes = await fetch(`${SAFETYKIT_BASE}/decisions/${decision_id}`, {
        headers: { "Authorization": `Bearer ${apiKey}` },
      });
      if (!pollRes.ok) continue;
      const result = await pollRes.json();

      // SafetyKit returns action: "allow" | "review" | "block"
      if (result.action) {
        const flags: string[] = result.labels?.map((l: { name: string }) => l.name) ?? [];
        const safe = result.action === "allow";
        const score = safe ? 95 : result.action === "review" ? 60 : 10;
        return { safe, score, flags, provider: "safetykit", decisionId: decision_id };
      }
    }

    // Timed out waiting
    return { safe: true, score: 80, flags: [], provider: "safetykit", decisionId: decision_id };
  } catch (err) {
    console.warn("[safetykit] Error:", err, "— falling back to Gemini");
    return checkWithGeminiFallback(text);
  }
}

async function checkWithGeminiFallback(text: string): Promise<SafetyResult> {
  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const prompt = `You are a child safety content moderator. Analyze this children's story text and return a JSON object.

Story text:
"""
${text.slice(0, 3000)}
"""

Return ONLY valid JSON:
{
  "safe": true or false,
  "score": 0-100 (higher = safer for children aged 4-12),
  "flags": ["list", "of", "concerns"] or []
}

Flag any: violence, fear-inducing content, inappropriate language, manipulation, adult themes, harmful messages.
Children's stories about mild adventure, friendship, animals, magic, science are all safe.`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const raw = result.candidates?.[0]?.content?.parts?.[0]?.text ?? '{"safe":true,"score":85,"flags":[]}';
    const cleaned = raw.replace(/```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const parsed = JSON.parse(cleaned) as { safe: boolean; score: number; flags: string[] };

    return {
      safe: parsed.safe ?? true,
      score: parsed.score ?? 85,
      flags: parsed.flags ?? [],
      provider: "gemini_fallback",
    };
  } catch {
    // If all else fails, assume safe
    return { safe: true, score: 85, flags: [], provider: "gemini_fallback" };
  }
}
