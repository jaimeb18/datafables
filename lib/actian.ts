/**
 * Actian VectorAI DB client — calls the Python proxy server.
 * The proxy handles embeddings + gRPC to Actian.
 */

const ACTIAN_PROXY = process.env.ACTIAN_PROXY_URL ?? "http://localhost:8001";

export interface StorySuggestion {
  id: string;
  title: string;
  topic: string;
  age_group: string;
  score: number;
}

/** Store a story in Actian VectorAI after generation */
export async function storeStory(params: {
  id: string;
  title: string;
  topic: string;
  ageGroup: string;
  summary: string;
}): Promise<void> {
  try {
    await fetch(`${ACTIAN_PROXY}/stories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: params.id,
        title: params.title,
        topic: params.topic,
        age_group: params.ageGroup,
        summary: params.summary,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (e) {
    // Non-fatal — don't break story generation if Actian is down
    console.warn("[actian] storeStory failed (server may not be running):", e);
  }
}

/** Find semantically similar stories */
export async function getSimilarStories(
  query: string,
  topK = 3
): Promise<StorySuggestion[]> {
  try {
    const res = await fetch(`${ACTIAN_PROXY}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, top_k: topK }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    return (await res.json()) as StorySuggestion[];
  } catch {
    return [];
  }
}

/** Check if the Actian proxy is reachable */
export async function isActianAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${ACTIAN_PROXY}/health`, {
      signal: AbortSignal.timeout(2000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
