import { NextRequest, NextResponse } from "next/server";
import { checkPronunciation } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { word, audioBase64, mimeType } = await req.json();
  if (!word || !audioBase64 || !mimeType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const result = await checkPronunciation(word, audioBase64, mimeType);
  return NextResponse.json(result);
}
