// Snowflake fact retrieval — queries the FACTS table directly.
// No AI extraction. All facts are verified and loaded from snowflake_facts.sql.
// Falls back to the mock bank when Snowflake credentials are absent.

import snowflake from "snowflake-sdk";

const hasSnowflake = !!(
  process.env.SNOWFLAKE_ACCOUNT &&
  process.env.SNOWFLAKE_USERNAME &&
  process.env.SNOWFLAKE_PASSWORD
);

// ─── Connection ───────────────────────────────────────────────────────────────

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

function query<T>(
  conn: snowflake.Connection,
  sqlText: string,
  binds: (string | number)[] = []
): Promise<T[]> {
  return new Promise((resolve, reject) =>
    conn.execute({
      sqlText,
      binds: binds as snowflake.Bind[],
      complete: (err, _stmt, rows) =>
        err ? reject(err) : resolve((rows ?? []) as T[]),
    })
  );
}

function destroyConn(conn: snowflake.Connection) {
  conn.destroy((err) => {
    if (err) console.error("Snowflake disconnect error:", err);
  });
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function getFactsForTopic(
  topic: string,
  ageGroup: string = "all"
): Promise<string[]> {
  if (!hasSnowflake) return getMockFacts(topic);

  let conn: snowflake.Connection | null = null;
  try {
    conn = await createConn();

    // Query facts that match the topic and are suitable for the age group.
    // AGE_GROUP = 'all' means the fact is suitable for every age.
    const rows = await query<{ FACT: string }>(
      conn,
      `SELECT FACT
       FROM STORY_FACTS
       WHERE LOWER(TOPIC) = LOWER(?)
         AND (AGE_GROUP = ? OR AGE_GROUP = 'all')
       ORDER BY RANDOM()
       LIMIT 4`,
      [topic, ageGroup]
    );

    // If no exact match, try a broader keyword search
    if (rows.length === 0) {
      const fuzzyRows = await query<{ FACT: string }>(
        conn,
        `SELECT FACT
         FROM STORY_FACTS
         WHERE LOWER(TOPIC) LIKE LOWER(?)
           AND (AGE_GROUP = ? OR AGE_GROUP = 'all')
         ORDER BY RANDOM()
         LIMIT 4`,
        [`%${topic}%`, ageGroup]
      );
      if (fuzzyRows.length > 0) return fuzzyRows.map((r) => r.FACT);
    }

    if (rows.length > 0) return rows.map((r) => r.FACT);

    // No match in database — fall back to mock
    return getMockFacts(topic);
  } catch (err) {
    console.error("Snowflake query error — falling back to mock:", err);
    return getMockFacts(topic);
  } finally {
    if (conn) destroyConn(conn);
  }
}

// ─── Mock fallback ────────────────────────────────────────────────────────────

function getMockFacts(topic: string): string[] {
  const lower = topic.toLowerCase();
  for (const [key, facts] of Object.entries(MOCK_FACTS)) {
    if (lower === key || lower.includes(key) || key.includes(lower)) {
      return facts.sort(() => Math.random() - 0.5).slice(0, 4);
    }
  }
  return DEFAULT_FACTS.sort(() => Math.random() - 0.5).slice(0, 4);
}

const MOCK_FACTS: Record<string, string[]> = {
  dolphins: [
    "Dolphins sleep with one eye open to stay alert for danger.",
    "Dolphins use echolocation — they send out sound waves that bounce off objects to find them.",
    "A group of dolphins is called a pod, and they work together to hunt fish.",
    "Dolphins can recognize themselves in mirrors, showing they have self-awareness.",
  ],
  space: [
    "One million Earths could fit inside the Sun.",
    "Footprints left on the Moon will last millions of years because there is no wind.",
    "Saturn's rings are made mostly of ice and rock, and are only about 30 feet thick in some places.",
    "A day on Venus is longer than a year on Venus.",
  ],
  ocean: [
    "The ocean covers more than 70% of Earth's surface.",
    "The deepest part of the ocean, the Mariana Trench, is deeper than Mount Everest is tall.",
    "Oceans produce over half of the world's oxygen through tiny plants called phytoplankton.",
    "More than 80% of the ocean remains unexplored by humans.",
  ],
  dinosaurs: [
    "Birds are actually living dinosaurs — they evolved from theropod dinosaurs.",
    "The T. rex had the strongest bite of any land animal that ever lived.",
    "Some dinosaurs were smaller than a chicken.",
    "Dinosaurs lived on Earth for about 165 million years before an asteroid ended their reign.",
  ],
  weather: [
    "Lightning strikes Earth about 100 times every second.",
    "A snowflake can take up to an hour to fall from a cloud to the ground.",
    "Tornadoes can spin faster than 300 miles per hour.",
    "Raindrops are not teardrop-shaped — they are round like tiny balls.",
  ],
  plants: [
    "Trees communicate with each other through underground networks of fungi called the 'Wood Wide Web'.",
    "Some plants, like the Venus flytrap, eat insects for nutrients.",
    "The oldest known living tree is over 5,000 years old.",
    "Bamboo can grow up to 35 inches in a single day — the fastest-growing plant on Earth.",
  ],
  animals: [
    "Octopuses have three hearts and blue blood.",
    "A group of flamingos is called a flamboyance.",
    "Elephants are the only animals that cannot jump.",
    "Cats have a unique collarbone that lets them always land on their feet.",
  ],
  robots: [
    "The word 'robot' comes from a Czech word meaning 'forced labor'.",
    "There are already robots on Mars — NASA's Perseverance rover explores the planet's surface.",
    "Robots are used in surgery to help doctors make tiny, precise movements.",
    "The first industrial robot was installed in a General Motors factory in 1961.",
  ],
  volcanoes: [
    "There are about 1,500 potentially active volcanoes on Earth.",
    "Lava can reach temperatures of 2,200 degrees Fahrenheit.",
    "The largest volcano in the solar system is Olympus Mons on Mars — three times taller than Mount Everest.",
    "Volcanic eruptions have created many of Earth's islands, including Hawaii.",
  ],
  egypt: [
    "Ancient Egyptians invented one of the first writing systems, called hieroglyphics.",
    "The Great Pyramid of Giza was the tallest human-made structure for over 3,800 years.",
    "Ancient Egyptians had over 2,000 gods and goddesses.",
    "Cats were sacred in ancient Egypt and killing one was a serious crime.",
  ],
  science: [
    "Humans share about 60% of their DNA with bananas.",
    "The human brain generates about 20 watts of power — enough to power a dim light bulb.",
    "Water expands when it freezes, which is why ice floats.",
    "Sound travels about four times faster through water than through air.",
  ],
  history: [
    "The printing press, invented in 1440, helped spread knowledge to millions of people.",
    "Ancient Romans used to brush their teeth with crushed bones and oyster shells.",
    "The Great Wall of China took over 1,000 years to build.",
    "Vikings were the first Europeans to reach North America, about 500 years before Columbus.",
  ],
  math: [
    "Zero is the only number that cannot be represented by Roman numerals.",
    "A 'googol' is the number 1 followed by 100 zeros.",
    "The Fibonacci sequence appears everywhere in nature — in sunflowers, shells, and pinecones.",
    "Pi (π) has been calculated to over 100 trillion decimal places.",
  ],
  music: [
    "Music has been found in every human culture throughout history.",
    "Playing a musical instrument uses almost every part of the brain at once.",
    "The world's oldest known musical instrument is a flute made from a bear bone, about 60,000 years old.",
    "Fast music tends to make people feel more energetic, while slow music can calm the heart rate.",
  ],
};

const DEFAULT_FACTS = [
  "The human body has about 37 trillion cells.",
  "Earth is the only planet in the solar system known to support life.",
  "There are more stars in the universe than grains of sand on all of Earth's beaches.",
  "Reading expands your vocabulary and helps build empathy for others.",
];
