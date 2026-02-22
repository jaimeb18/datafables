import { NextRequest, NextResponse } from "next/server";
import { checkPronunciation } from "@/lib/gemini";
import { storeFailedWord } from "@/lib/vectorai";

export async function POST(req: NextRequest) {
  const { word, audioBase64, mimeType, definition, language, ageGroup } = await req.json();
  if (!word || !audioBase64 || !mimeType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const result = await checkPronunciation(word, audioBase64, mimeType);

  // Store failed words in VectorAI DB for future story practice
  if (!result.correct) {
    storeFailedWord(word, definition || "", language || "English", ageGroup || "8-10");
  }

  return NextResponse.json(result);
}
