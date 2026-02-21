import { NextRequest, NextResponse } from "next/server";
import { generateStory, generateImage } from "@/lib/gemini";
import { getFactsForTopic } from "@/lib/snowflake";

export async function POST(req: NextRequest) {
  try {
    const { topic, ageGroup, language = "English" } = await req.json();

    if (!topic || !ageGroup) {
      return NextResponse.json({ error: "Missing topic or ageGroup" }, { status: 400 });
    }

    const facts = await getFactsForTopic(topic);
    const story = await generateStory(topic, ageGroup, facts, language);

    // Generate all page images in parallel
    const images = await Promise.all(
      story.pages.map((page) => generateImage(topic, story.title, page.text))
    );

    const pages = story.pages.map((page, i) => ({
      ...page,
      imageDataUrl: images[i],
    }));

    return NextResponse.json({ title: story.title, pages, facts });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
