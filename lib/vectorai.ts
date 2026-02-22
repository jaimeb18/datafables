const VECTORAI_URL = process.env.VECTORAI_SERVICE_URL || "http://localhost:8000";

export async function storeFailedWord(
  word: string,
  definition: string,
  language: string,
  ageGroup: string
): Promise<void> {
  try {
    await fetch(`${VECTORAI_URL}/store-word`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        word,
        definition,
        language,
        age_group: ageGroup,
      }),
    });
  } catch (err) {
    console.error("Failed to store word in VectorAI DB:", err);
  }
}

export interface PracticeWord {
  word: string;
  definition: string;
  score: number;
}

export async function getPracticeWords(
  topic: string,
  language: string,
  topK: number = 5
): Promise<PracticeWord[]> {
  try {
    const res = await fetch(`${VECTORAI_URL}/get-practice-words`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, language, top_k: topK }),
    });
    if (!res.ok) return [];
    return (await res.json()) as PracticeWord[];
  } catch (err) {
    console.error("Failed to get practice words from VectorAI DB:", err);
    return [];
  }
}
