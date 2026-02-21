import { NextRequest, NextResponse } from "next/server";
import { generateSpeech } from "@/lib/elevenlabs";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    const { audioBuffer, words } = await generateSpeech(text);

    return NextResponse.json({
      audioBase64: audioBuffer.toString("base64"),
      words,
    });
  } catch (err) {
    console.error("Audio error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Audio generation failed" },
      { status: 500 }
    );
  }
}
