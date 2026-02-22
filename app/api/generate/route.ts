import { NextRequest, NextResponse } from "next/server";
import { generateBranchingStory, generateCharacterSheet, generateImage, StoryPage } from "@/lib/gemini";
import { getFactsForTopic } from "@/lib/snowflake";
import { getPracticeWords } from "@/lib/vectorai";

export async function POST(req: NextRequest) {
  try {
    const { topic, ageGroup, language = "English", characterDescription = "" } = await req.json();

    if (!topic || !ageGroup) {
      return NextResponse.json({ error: "Missing topic or ageGroup" }, { status: 400 });
    }

    // Fetch educational facts and practice words (from VectorAI DB) in parallel
    const [facts, practiceWords] = await Promise.all([
      getFactsForTopic(topic, ageGroup),
      getPracticeWords(topic, language),
    ]);
    console.log(`[facts] topic="${topic}" ageGroup="${ageGroup}" → ${facts.length} facts from Snowflake`);
    console.log(`[vectorai] → ${practiceWords.length} practice words from VectorAI DB`);

    const practiceWordsList = practiceWords.map((w) => w.word);
    const story = await generateBranchingStory(topic, ageGroup, facts, language, characterDescription, practiceWordsList);

    // Collect all pages that need images
    const allPages: StoryPage[] = [
      ...story.commonPages,
      story.branchPointPage,
      ...story.choiceA.pages,
      ...story.choiceB.pages,
    ];

    // Generate a character design sheet once so all images share the same character look
    const characterSheet = await generateCharacterSheet(
      story.title,
      allPages.map((p) => p.text)
    );

    // Combine user's character description with AI-generated character sheet
    const combinedCharacterSheet = [characterDescription, characterSheet].filter(Boolean).join("\n\n");

    // Generate all page images in parallel
    const images = await Promise.all(
      allPages.map((page) => generateImage(topic, story.title, page.text, combinedCharacterSheet))
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
