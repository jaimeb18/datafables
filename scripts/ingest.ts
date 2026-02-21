/**
 * DataFables — Fact Ingestion Script
 *
 * Pulls from two sources:
 *   1. Open Trivia DB  — thousands of verified trivia Q&A pairs
 *   2. Wikipedia       — article summaries for kid-friendly topics
 *
 * Uses Gemini to convert raw content into clean, age-tagged fact sentences.
 * Bulk-inserts everything into Snowflake STORY_FACTS.
 *
 * Run with:  npx tsx scripts/ingest.ts
 */

import snowflake from "snowflake-sdk";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// ─── Types ────────────────────────────────────────────────────────────────────

interface Fact {
  topic: string;
  fact: string;
  source: string;
  ageGroup: string;
}

// ─── Snowflake ────────────────────────────────────────────────────────────────

function createConn(): Promise<snowflake.Connection> {
  const conn = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT!,
    username: process.env.SNOWFLAKE_USERNAME!,
    password: process.env.SNOWFLAKE_PASSWORD!,
    database: process.env.SNOWFLAKE_DATABASE ?? "DATAFABLES",
    warehouse: process.env.SNOWFLAKE_WAREHOUSE ?? "COMPUTE_WH",
    schema: "PUBLIC",
  });
  return new Promise((resolve, reject) =>
    conn.connect((err, c) => (err ? reject(err) : resolve(c)))
  );
}

function run(conn: snowflake.Connection, sqlText: string, binds: (string | number)[] = []): Promise<void> {
  return new Promise((resolve, reject) =>
    conn.execute({
      sqlText,
      binds: binds as snowflake.Bind[],
      complete: (err) => (err ? reject(err) : resolve()),
    })
  );
}

async function bulkInsert(conn: snowflake.Connection, facts: Fact[]) {
  // Insert in batches of 50
  const BATCH = 50;
  for (let i = 0; i < facts.length; i += BATCH) {
    const batch = facts.slice(i, i + BATCH);
    const placeholders = batch.map(() => "(?, ?, ?, ?)").join(", ");
    const binds: string[] = [];
    for (const f of batch) {
      binds.push(f.topic, f.fact, f.source, f.ageGroup);
    }
    await run(
      conn,
      `INSERT INTO STORY_FACTS (TOPIC, FACT, SOURCE, AGE_GROUP) VALUES ${placeholders}`,
      binds
    );
    console.log(`  Inserted batch ${Math.floor(i / BATCH) + 1} (${batch.length} facts)`);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function decodeHTML(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, "\u201c")
    .replace(/&rdquo;/g, "\u201d");
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function geminiExtract(prompt: string): Promise<{ fact: string; ageGroup: string }[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    let text = (response.text ?? "").trim();

    // Strip markdown code fences if present
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

    // Extract the first JSON array found in the response
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) {
      console.log(`    [gemini] No JSON array found. Raw: ${text.slice(0, 120)}`);
      return [];
    }

    const parsed = JSON.parse(match[0]);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.log(`    [gemini] Parse error: ${err}`);
    return [];
  }
}

// ─── Source 1: Open Trivia DB ─────────────────────────────────────────────────

const TRIVIA_CATEGORIES = [
  { id: 17, topic: "science" },
  { id: 27, topic: "animals" },
  { id: 23, topic: "history" },
  { id: 22, topic: "geography" },
  { id: 19, topic: "math" },
  { id: 25, topic: "art" },
  { id: 18, topic: "computers" },
  { id: 21, topic: "sports" },
  { id: 20, topic: "mythology" },
];

async function fetchTrivia(): Promise<Fact[]> {
  const allFacts: Fact[] = [];

  for (const cat of TRIVIA_CATEGORIES) {
    console.log(`  Fetching trivia: ${cat.topic}...`);
    await sleep(1200); // respect rate limit

    const res = await fetch(
      `https://opentdb.com/api.php?amount=50&category=${cat.id}&type=multiple`
    );
    const data = await res.json();
    if (data.response_code !== 0) {
      console.log(`  Skipping ${cat.topic} (rate limited or empty)`);
      continue;
    }

    // Convert Q&A pairs to fact sentences via Gemini
    const pairs = data.results
      .map(
        (item: { question: string; correct_answer: string; difficulty: string }) =>
          `Q: ${decodeHTML(item.question)} | A: ${decodeHTML(item.correct_answer)} | difficulty: ${item.difficulty}`
      )
      .join("\n");

    const prompt = `Convert each trivia Q&A pair below into a single clear, engaging fact sentence for children.
Use the difficulty to set reading level: easy→ages 5-7, medium→ages 8-10, hard→ages 11-13.
Return ONLY a valid JSON array of objects: [{fact, ageGroup}]
ageGroup must be "5-7", "8-10", or "11-13". No markdown, no extra text.

PAIRS:
${pairs}`;

    const converted = await geminiExtract(prompt);
    const valid = converted.filter((item) => item.fact && item.ageGroup);
    for (const item of valid) {
      allFacts.push({
        topic: cat.topic,
        fact: item.fact,
        source: "Open Trivia DB",
        ageGroup: item.ageGroup,
      });
    }

    console.log(`  Got ${valid.length} facts for ${cat.topic}`);
    await sleep(1000);
  }

  return allFacts;
}

// ─── Source 2: Wikipedia ──────────────────────────────────────────────────────

const WIKIPEDIA_TOPICS = [
  // Animals
  "Tiger", "Giraffe", "Cheetah", "Blue whale", "Bald eagle",
  "Platypus", "Kangaroo", "Giant panda", "Gray wolf", "Gorilla",
  "Parrot", "Jellyfish", "Crocodile", "Polar bear", "Chimpanzee",
  "Koala", "Flamingo", "Axolotl", "Narwhal", "Mantis shrimp",
  // Space
  "Black hole", "Solar System", "Milky Way", "Asteroid", "Comet",
  "Jupiter", "Saturn", "Neptune", "International Space Station",
  // Science
  "Photosynthesis", "Gravity", "Electricity", "Magnetism", "DNA",
  "Evolution", "Atom", "Periodic table", "Light", "Sound",
  // History
  "Ancient Rome", "Ancient Greece", "Maya civilization",
  "Egyptian pyramids", "Renaissance", "Industrial Revolution",
  "Ancient China", "Viking Age", "Medieval castle",
  // Geography
  "Amazon River", "Sahara Desert", "Great Barrier Reef",
  "Mount Everest", "Niagara Falls", "Grand Canyon",
  "Amazon rainforest", "Arctic Ocean", "Himalayas",
  // Nature
  "Earthquake", "Hurricane", "Rainbow", "Northern Lights",
  "Tide", "Cave", "Glacier", "Coral reef", "Geyser",
  // Food & Culture
  "Chocolate", "Pizza", "Bread", "Honey", "Cheese",
  // Sports
  "Soccer", "Basketball", "Olympic Games", "Swimming", "Gymnastics",
  // Technology
  "Internet", "Airplane", "Train", "Telescope", "Microscope",
];

async function fetchWikipedia(): Promise<Fact[]> {
  const allFacts: Fact[] = [];

  for (const topic of WIKIPEDIA_TOPICS) {
    console.log(`  Fetching Wikipedia: ${topic}...`);

    const slug = encodeURIComponent(topic.replace(/\s+/g, "_"));
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`,
      { headers: { "User-Agent": "DataFables/1.0 (children's educational app)" } }
    );

    if (!res.ok) {
      console.log(`  Skipping ${topic} (not found)`);
      await sleep(300);
      continue;
    }

    const data = await res.json();
    const extract: string = data.extract ?? "";
    if (extract.length < 80) {
      await sleep(300);
      continue;
    }

    const prompt = `From this Wikipedia text about "${topic}", extract exactly 5 fascinating true facts for children.
Mix age groups. Each fact must be a single clear sentence.
Return ONLY a valid JSON array: [{fact, ageGroup}]
ageGroup must be "5-7", "8-10", or "11-13". No markdown, no extra text.

TEXT: ${extract.slice(0, 1800)}`;

    const facts = await geminiExtract(prompt);
    const valid = facts.filter((item) => item.fact && item.ageGroup);
    for (const item of valid) {
      allFacts.push({
        topic: topic.toLowerCase(),
        fact: item.fact,
        source: "Wikipedia",
        ageGroup: item.ageGroup,
      });
    }

    console.log(`  Got ${valid.length} facts for ${topic}`);
    await sleep(800);
  }

  return allFacts;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Connecting to Snowflake...");
  const conn = await createConn();
  console.log("Connected!\n");

  // --- Open Trivia DB ---
  console.log("=== Source 1: Open Trivia DB ===");
  const triviaFacts = await fetchTrivia();
  console.log(`\nTotal trivia facts: ${triviaFacts.length}`);
  console.log("Inserting into Snowflake...");
  await bulkInsert(conn, triviaFacts);
  console.log("Done!\n");

  // --- Wikipedia ---
  console.log("=== Source 2: Wikipedia ===");
  const wikiFacts = await fetchWikipedia();
  console.log(`\nTotal Wikipedia facts: ${wikiFacts.length}`);
  console.log("Inserting into Snowflake...");
  await bulkInsert(conn, wikiFacts);
  console.log("Done!\n");

  // Final count
  console.log("=== Summary ===");
  console.log(`Trivia facts inserted:    ${triviaFacts.length}`);
  console.log(`Wikipedia facts inserted: ${wikiFacts.length}`);
  console.log(`Total new facts:          ${triviaFacts.length + wikiFacts.length}`);

  conn.destroy((err) => {
    if (err) console.error(err);
  });
  console.log("\nSnowflake disconnected. All done!");
}

main().catch(console.error);
