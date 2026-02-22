export interface Achievement {
  id: string;
  title: string;
  description: string;
  xp: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // ── Core story actions ────────────────────────────────────────────────────
  { id: "first_story",        title: "Once Upon a Time",     description: "Generate your very first story",                     xp: 10 },
  { id: "story_collector",    title: "Story Collector",      description: "Generate 5 stories",                                 xp: 15 },
  { id: "story_marathon",     title: "Story Marathon",       description: "Generate 10 stories",                                xp: 20 },
  { id: "bookworm",           title: "Bookworm",             description: "Read all the way to the last page",                  xp: 10 },
  { id: "both_paths",         title: "Explorer",             description: "Complete both branches of a single story",           xp: 20 },
  { id: "path_explorer",      title: "Road Less Traveled",   description: "Try the other story path",                           xp: 10 },
  // ── Vocabulary & learning ─────────────────────────────────────────────────
  { id: "word_wizard",        title: "Word Wizard",          description: "Tap a vocabulary word to learn its meaning",         xp: 5  },
  { id: "vocab_master",       title: "Word Nerd",            description: "Tap 10 vocabulary words in total",                   xp: 15 },
  { id: "deep_reader",        title: "Deep Reader",          description: "Tap 5 vocabulary words in a single story",           xp: 15 },
  { id: "fact_finder",        title: "Did You Know?",        description: "Discover fun facts at the end of a story",           xp: 5  },
  // ── Audio & pronunciation ─────────────────────────────────────────────────
  { id: "listener",           title: "Story Time",           description: "Listen to a page narrated aloud",                    xp: 5  },
  { id: "audio_fan",          title: "Audio Fan",            description: "Listen to 5 narrated pages",                         xp: 10 },
  { id: "pronunciation_star", title: "Pronunciation Star",   description: "Nail a vocabulary word pronunciation",               xp: 15 },
  { id: "pronunciation_trio", title: "Silver Tongue",        description: "Get 3 correct pronunciations",                       xp: 15 },
  // ── Customization ────────────────────────────────────────────────────────
  { id: "genre_picker",       title: "Genre Hopper",         description: "Pick a story genre from the gallery",                xp: 5  },
  { id: "all_genres",         title: "Connoisseur",          description: "Try all 6 genres at least once",                     xp: 20 },
  { id: "character_designer", title: "Fashion Designer",     description: "Design your own story character",                    xp: 10 },
  // ── Language / international ──────────────────────────────────────────────
  { id: "linguist",           title: "Polyglot",             description: "Generate a story in another language",               xp: 15 },
  { id: "world_traveler",     title: "World Traveler",       description: "Generate stories in 3 different languages",          xp: 20 },
  // ── Genre-specific ────────────────────────────────────────────────────────
  { id: "fantasy_fan",        title: "Fantasy Fan",          description: "Generate a Fantasy story",                           xp: 5  },
  { id: "sci_fi_fan",         title: "Sci-Fi Fan",           description: "Generate a Sci-Fi story",                            xp: 5  },
  { id: "mystery_fan",        title: "Mystery Fan",          description: "Generate a Mystery story",                           xp: 5  },
  { id: "history_fan",        title: "History Fan",          description: "Generate a Historical Fiction story",                xp: 5  },
  { id: "poet",               title: "Poet's Heart",         description: "Generate a Poem story",                              xp: 5  },
  { id: "realist",            title: "Realist",              description: "Generate a Realistic Fiction story",                 xp: 5  },
];

// ─── Level definitions ─────────────────────────────────────────────────────

export interface LevelInfo {
  level: number;
  label: string;
  minXp: number;
  maxXp: number;   // XP needed to reach NEXT level (or Infinity at max)
  coinBoost: number; // multiplier on base coins earned per story
  baseCoins: number; // base coins per completed story at this level
}

export const LEVELS: LevelInfo[] = [
  { level: 1, label: "Beginner",  minXp: 0,   maxXp: 50,  coinBoost: 1.0,  baseCoins: 10 },
  { level: 2, label: "Reader",    minXp: 50,  maxXp: 110, coinBoost: 1.25, baseCoins: 12 },
  { level: 3, label: "Scholar",   minXp: 110, maxXp: 185, coinBoost: 1.5,  baseCoins: 15 },
  { level: 4, label: "Sage",      minXp: 185, maxXp: 260, coinBoost: 1.75, baseCoins: 18 },
  { level: 5, label: "Legend",    minXp: 260, maxXp: Infinity, coinBoost: 2.0, baseCoins: 20 },
];

// ─── Storage keys ──────────────────────────────────────────────────────────

const KEY_ACHIEVEMENTS = "datafables_achievements";
const KEY_XP           = "datafables_xp";
const KEY_COINS        = "datafables_coins";
const KEY_COUNTERS     = "datafables_counters";
const KEY_SETS         = "datafables_sets";

// ─── Safe localStorage helpers ─────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function save(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Achievements ─────────────────────────────────────────────────────────

function loadUnlocked(): Set<string> {
  return new Set(load<string[]>(KEY_ACHIEVEMENTS, []));
}

export function isUnlocked(id: string): boolean {
  return loadUnlocked().has(id);
}

export function getAllAchievements(): (Achievement & { unlocked: boolean })[] {
  const u = loadUnlocked();
  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: u.has(a.id) }));
}

/** Unlock an achievement. Returns true if newly unlocked, false if already had it. */
export function unlockAchievement(id: string): boolean {
  const u = loadUnlocked();
  if (u.has(id)) return false;
  u.add(id);
  save(KEY_ACHIEVEMENTS, [...u]);

  // Award XP
  const def = ACHIEVEMENTS.find((a) => a.id === id);
  if (def) addXP(def.xp);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("datafables:achievement", { detail: { id } }));
  }
  return true;
}

// ─── XP & Levels ──────────────────────────────────────────────────────────

export function getXP(): number {
  return load<number>(KEY_XP, 0);
}

export function addXP(amount: number): void {
  const prev = getXP();
  const next = prev + amount;
  save(KEY_XP, next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("datafables:xp", { detail: { xp: next, gained: amount } }));
  }
}

export function getLevelInfo(xp?: number): LevelInfo {
  const x = xp ?? getXP();
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (x >= LEVELS[i].minXp) return LEVELS[i];
  }
  return LEVELS[0];
}

/** XP progress within the current level: { current, needed } */
export function getXPProgress(): { current: number; needed: number } {
  const xp = getXP();
  const info = getLevelInfo(xp);
  if (info.maxXp === Infinity) return { current: xp - info.minXp, needed: 0 };
  return { current: xp - info.minXp, needed: info.maxXp - info.minXp };
}

// ─── Coins ────────────────────────────────────────────────────────────────

export function getCoins(): number {
  return load<number>(KEY_COINS, 0);
}

export function addCoins(amount: number): void {
  save(KEY_COINS, getCoins() + amount);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("datafables:coins", { detail: { coins: getCoins() } }));
  }
}

export function spendCoins(amount: number): boolean {
  const current = getCoins();
  if (current < amount) return false;
  save(KEY_COINS, current - amount);
  return true;
}

/** Call when a story is completed. Awards coins based on current level boost. */
export function earnStoryCoins(): number {
  const info = getLevelInfo();
  const earned = Math.round(info.baseCoins * info.coinBoost);
  addCoins(earned);
  return earned;
}

// ─── Counters (for threshold-based achievements) ───────────────────────────

type Counters = Record<string, number>;

function loadCounters(): Counters {
  return load<Counters>(KEY_COUNTERS, {});
}

export function incrementCounter(key: string): number {
  const c = loadCounters();
  c[key] = (c[key] ?? 0) + 1;
  save(KEY_COUNTERS, c);
  return c[key];
}

export function getCounter(key: string): number {
  return loadCounters()[key] ?? 0;
}

// ─── Sets (for unique-value-based achievements) ────────────────────────────

type Sets = Record<string, string[]>;

function loadSets(): Sets {
  return load<Sets>(KEY_SETS, {});
}

/** Add a value to a named set. Returns the new size of the set. */
export function addToSet(key: string, value: string): number {
  const s = loadSets();
  const arr = s[key] ?? [];
  if (!arr.includes(value)) arr.push(value);
  s[key] = arr;
  save(KEY_SETS, s);
  return arr.length;
}

export function getSetSize(key: string): number {
  return (loadSets()[key] ?? []).length;
}
