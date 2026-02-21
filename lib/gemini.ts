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
  pageText: string
): Promise<string | null> {
  try {
    const prompt = `Create a colorful, friendly children's book illustration for a story called "${title}" about ${topic}. This page shows: ${pageText.slice(0, 150)}
Style: bright watercolor painting, whimsical, safe for children, no text in the image, storybook art style.`;

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
