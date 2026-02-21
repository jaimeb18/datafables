import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export interface VocabWord {
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  definition: string;
  example?: string;
}

export interface StoryPage {
  text: string;
  vocabulary: VocabWord[];
}

export interface StoryResult {
  title: string;
  pages: StoryPage[];
}

export async function generateStory(
  topic: string,
  ageGroup: string,
  facts: string[],
  language: string
): Promise<StoryResult> {
  const factsText =
    facts.length > 0
      ? `Weave these real facts naturally into the story across different pages:\n${facts.map((f, i) => `${i + 1}. ${f}`).join("\n")}`
      : "";

  const ageInstructions: Record<string, string> = {
    "5-7": "Use very simple words, very short sentences. Like a picture book page.",
    "8-10": "Use clear language with some interesting new vocabulary words.",
    "11-13": "Use richer vocabulary with some challenging words worth learning.",
  };

  const prompt = `You are a master children's storyteller creating an illustrated book.

Create a 10-page children's story in ${language} for children aged ${ageGroup} about: "${topic}"

Reading level: ${ageInstructions[ageGroup] || ageInstructions["8-10"]}

${factsText}

Rules:
- Each page has exactly 30-50 words (brief, like a real picture book page)
- The story flows naturally across all 10 pages with a clear beginning, middle, and end
- Naturally weave in the educational facts so kids learn without realizing it
- Include at least one relatable child character
- End on an uplifting or curious note
- For each page, identify 0-2 vocabulary words that might be challenging for the age group
  - The word MUST appear verbatim in that page's text
  - Provide the part of speech (noun, verb, adjective, adverb, etc.) in ${language}
  - Provide a simple, kid-friendly definition in ${language}
  - Provide a short example sentence using the word in ${language}
- Write everything in ${language}

Respond ONLY with valid JSON (no markdown, no extra text):
{
  "title": "Story Title Here",
  "pages": [
    {
      "text": "Page text here, 30-50 words.",
      "vocabulary": [
        {
          "word": "difficultword",
          "partOfSpeech": "noun",
          "definition": "simple kid-friendly definition",
          "example": "A short example sentence using the word."
        }
      ]
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = (response.text ?? "").trim();
  const cleaned = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  const parsed = JSON.parse(cleaned);
  return { title: parsed.title, pages: parsed.pages };
}

export async function generateImage(
  topic: string,
  title: string,
  pageText: string,
  characterDesignSheet: string = "",
  styleGuide: string = ""
): Promise<string | null> {
  try {
    const prompt = `Create a premium full-page children's book illustration in PIXEL ART for the story "${title}" about ${topic}.

SCENE TO ILLUSTRATE
${pageText.slice(0, 280)}

CHARACTER LOCK (strict consistency across all pages)
Use the established recurring character designs exactly as defined below. Do not redesign them:
${characterDesignSheet}

Keep recurring characters consistent in:
- facial features
- hair/fur/skin tone
- clothing colors and outfit design
- accessories
- body proportions
- age appearance
- personality and expression style

If a recurring character appears in this scene, preserve their exact visual identity.

STYLE LOCK (strict consistency across all pages)
Use the same visual style across the entire book:
${styleGuide}

Required art style (override if styleGuide conflicts):
- high-quality children's storybook PIXEL ART
- warm, whimsical, polished, readable pixel illustration
- clean pixel shapes and silhouettes
- limited but rich color palette
- soft-looking lighting using pixel shading (not painterly brush strokes)
- expressive faces and body language in pixel form
- detailed but uncluttered environments
- consistent pixel density / resolution look across pages

GROUNDING RULE (very important: magical but believable)
Keep the scene imaginative and whimsical, but visually grounded and physically plausible within a children's story world.
- Use real-looking actions, expressions, and object behavior
- Avoid random surreal exaggerations unless explicitly described in the page text
- If the page includes humor (like burps, farts, messes, slips, etc.), depict it in a playful, child-friendly, natural way (small comedic cues, funny reactions, motion lines, puff clouds if appropriate)
- Do NOT add exaggerated fantasy effects that are not supported by the story text (example: no rainbow gas, no explosive glitter clouds, no absurd magical beams unless the story specifically says so)

SCENE DIRECTION
Illustrate the strongest visual action or emotional moment from the page.
Prioritize:
1) clear storytelling
2) character emotion
3) readable action
4) supportive environment details

Add magical atmosphere only where it fits the story (glow, sparkles, soft light, floating dust, gentle magical accents), and keep it subtle and purposeful.

COMPOSITION
- Full-page storybook composition
- Clear focal point
- Readable foreground / midground / background
- Balanced detail (interesting, but not crowded)
- Easy for children ages 4–10 to understand at a glance

TEXT / SPELLING RULE (important)
Do NOT include any text, words, letters, numbers, speech bubbles, signs, labels, or written symbols in the image. All text will be added separately in the website UI to ensure correct spelling.

SAFETY
Family-friendly, safe for children, no scary imagery, no disturbing details, no graphic content.

OUTPUT LOOK
A polished, consistent, child-friendly pixel art storybook scene that feels magical, warm, and believable.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: ["IMAGE"],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part.inlineData?.mimeType?.startsWith("image/")) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (err) {
    console.error("Image generation error:", err);
    return null;
  }
}
