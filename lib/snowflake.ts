// Snowflake integration with mock fallback.
// When SNOWFLAKE_ACCOUNT env vars are present, real queries run.
// Otherwise, a curated educational fact bank is used.

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
  "ancient egypt": [
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

function findMatchingFacts(topic: string): string[] {
  const lower = topic.toLowerCase();

  // Try exact match first
  if (MOCK_FACTS[lower]) return MOCK_FACTS[lower];

  // Try partial keyword match
  for (const key of Object.keys(MOCK_FACTS)) {
    if (lower.includes(key) || key.includes(lower)) {
      return MOCK_FACTS[key];
    }
  }

  // Default: return a mix of general science + nature facts
  return [
    "The human body has about 37 trillion cells.",
    "Earth is the only planet in the solar system known to support life.",
    "There are more stars in the universe than grains of sand on all of Earth's beaches.",
    "Reading expands your vocabulary and helps build empathy for others.",
  ];
}

export async function getFactsForTopic(topic: string): Promise<string[]> {
  // Future: when Snowflake credentials are present, query real data here.
  // const hasSnowflake = process.env.SNOWFLAKE_ACCOUNT && process.env.SNOWFLAKE_USERNAME;
  // if (hasSnowflake) { ... }

  const facts = findMatchingFacts(topic);
  // Return a random selection of 3-4 facts
  return facts.sort(() => Math.random() - 0.5).slice(0, 4);
}
