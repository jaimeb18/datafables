import { NextRequest, NextResponse } from "next/server";
import { generateBranchingStory, generateCharacterSheet, generateImage, StoryPage } from "@/lib/gemini";
import { getFactsForTopic } from "@/lib/snowflake";
import { getPracticeWords } from "@/lib/vectorai";
import { checkStorySafety } from "@/lib/safetykit";
import { storeStory } from "@/lib/actian";

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

    // Generate all page images + run safety check in parallel
    const allPageText = allPages.map((p) => p.text).join("\n\n");
    const [images, safetyResult] = await Promise.all([
      Promise.all(allPages.map((page) => generateImage(topic, story.title, page.text, combinedCharacterSheet))),
      checkStorySafety(allPageText),
    ]);
    console.log(`[safety] safe=${safetyResult.safe} score=${safetyResult.score} provider=${safetyResult.provider} flags=${safetyResult.flags.join(",") || "none"}`);

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

    // Store story in Actian VectorAI DB for recommendations (fire-and-forget)
    const storyId = `${Date.now()}-${topic.replace(/\s+/g, "_")}`;
    const summarySentence = story.commonPages[0]?.text?.slice(0, 300) ?? story.title;
    storeStory({
      id: storyId,
      title: story.title,
      topic,
      ageGroup,
      summary: summarySentence,
    }).catch(() => {}); // non-blocking

    return NextResponse.json({
      title: story.title,
      branchPointIndex: story.branchPointIndex,
      commonPages,
      branchPointPage,
      choiceA: { label: story.choiceA.label, pages: choiceAPages },
      choiceB: { label: story.choiceB.label, pages: choiceBPages },
      facts,
      safety: safetyResult,
      storyId,
      practiceWords: practiceWordsList,
    });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
