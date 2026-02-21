import { NextRequest, NextResponse } from "next/server";
import { generateBranchingStory, generateImage, StoryPage } from "@/lib/gemini";
import { getFactsForTopic } from "@/lib/snowflake";

export async function POST(req: NextRequest) {
  try {
    const { topic, ageGroup, language = "English" } = await req.json();

    if (!topic || !ageGroup) {
      return NextResponse.json({ error: "Missing topic or ageGroup" }, { status: 400 });
    }

    const facts = await getFactsForTopic(topic);
    const story = await generateBranchingStory(topic, ageGroup, facts, language);

    // Collect all pages that need images
    const allPages: StoryPage[] = [
      ...story.commonPages,
      story.branchPointPage,
      ...story.choiceA.pages,
      ...story.choiceB.pages,
    ];

    // Generate all page images in parallel
    const images = await Promise.all(
      allPages.map((page) => generateImage(topic, story.title, page.text))
    );

    // Reassemble with images
    let idx = 0;
    const commonPages = story.commonPages.map((p) => ({
      ...p,
      imageDataUrl: images[idx++],
    }));
    const branchPointPage = {
      ...story.branchPointPage,
      imageDataUrl: images[idx++],
    };
    const choiceAPages = story.choiceA.pages.map((p) => ({
      ...p,
      imageDataUrl: images[idx++],
    }));
    const choiceBPages = story.choiceB.pages.map((p) => ({
      ...p,
      imageDataUrl: images[idx++],
    }));

    return NextResponse.json({
      title: story.title,
      branchPointIndex: story.branchPointIndex,
      commonPages,
      branchPointPage,
      choiceA: { label: story.choiceA.label, pages: choiceAPages },
      choiceB: { label: story.choiceB.label, pages: choiceBPages },
      facts,
    });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
