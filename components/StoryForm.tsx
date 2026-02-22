"use client";

import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/translations";

interface StoryFormProps {
  onSubmit: (topic: string, ageGroup: string, language: string, characterDescription: string) => void;
  loading: boolean;
  prefillTopic?: string;
}

const LANGUAGES = [
  { value: "English", flag: "🇬🇧" },
  { value: "Spanish", flag: "🇪🇸" },
  { value: "French", flag: "🇫🇷" },
  { value: "German", flag: "🇩🇪" },
  { value: "Portuguese", flag: "🇧🇷" },
  { value: "Italian", flag: "🇮🇹" },
  { value: "Chinese (Simplified)", flag: "🇨🇳" },
  { value: "Japanese", flag: "🇯🇵" },
  { value: "Arabic", flag: "🇸🇦" },
  { value: "Hindi", flag: "🇮🇳" },
];

// Character designer options
const SKIN_TONES = [
  { label: "Light", color: "#FDEBD0" },
  { label: "Fair", color: "#F5CBA7" },
  { label: "Medium", color: "#EDBB99" },
  { label: "Tan", color: "#D4A574" },
  { label: "Brown", color: "#A0785A" },
  { label: "Dark Brown", color: "#6B4226" },
];

const HAIR_COLORS = [
  { label: "Black", color: "#1C1C1C" },
  { label: "Dark Brown", color: "#3B2314" },
  { label: "Brown", color: "#6B4226" },
  { label: "Auburn", color: "#922B21" },
  { label: "Red", color: "#C0392B" },
  { label: "Blonde", color: "#F4D03F" },
  { label: "Strawberry Blonde", color: "#E8A87C" },
  { label: "White", color: "#E5E5E5" },
];

const EYE_COLORS = [
  { label: "Brown", color: "#5B3A1A" },
  { label: "Dark Brown", color: "#3B2314" },
  { label: "Blue", color: "#2E86C1" },
  { label: "Green", color: "#27AE60" },
  { label: "Hazel", color: "#A68B2C" },
  { label: "Gray", color: "#909497" },
];

const HAIR_STYLES = [
  "Short straight", "Short curly", "Long straight", "Long curly",
  "Braids", "Ponytail", "Afro", "Bun", "Pigtails", "Buzz cut",
  "Bob", "Mohawk",
];

const TOPS = ["T-shirt", "Hoodie", "Button shirt", "Dress", "Sweater", "Tank top", "Jacket"];
const BOTTOMS = ["Jeans", "Shorts", "Skirt", "Sweatpants", "Leggings", "Overalls"];
const SHOES = ["Sneakers", "Boots", "Sandals", "Rain boots", "Barefoot"];
const ACCESSORIES = ["Glasses", "Hat", "Backpack", "Scarf", "Headband", "Cape", "Bow tie"];

const TOP_COLORS = [
  { label: "Red", color: "#E74C3C" },
  { label: "Blue", color: "#2E86C1" },
  { label: "Green", color: "#27AE60" },
  { label: "Yellow", color: "#F4D03F" },
  { label: "Purple", color: "#8E44AD" },
  { label: "Orange", color: "#E67E22" },
  { label: "Pink", color: "#EC7063" },
  { label: "White", color: "#F0F0F0" },
  { label: "Black", color: "#1C1C1C" },
];

const GENDERS = [
  { label: "Boy", emoji: "👦" },
  { label: "Girl", emoji: "👧" },
];

// Emoji lookup for display-only labels
const EMOJI: Record<string, string> = {
  "Short straight": "✂️", "Short curly": "🌀", "Long straight": "💇‍♀️", "Long curly": "🌊",
  "Braids": "🪢", "Ponytail": "🎀", "Afro": "🌟", "Bun": "🍩",
  "Pigtails": "🎀", "Buzz cut": "💈", "Bob": "📐", "Mohawk": "🦄",
  "T-shirt": "👕", "Hoodie": "🧥", "Button shirt": "👔", "Dress": "👗",
  "Sweater": "🧶", "Tank top": "🎽", "Jacket": "🧥",
  "Jeans": "👖", "Shorts": "🩳", "Skirt": "💃", "Sweatpants": "🏃",
  "Leggings": "🩰", "Overalls": "👨‍🌾",
  "Sneakers": "👟", "Boots": "🥾", "Sandals": "🩴", "Rain boots": "🌧️", "Barefoot": "🦶",
  "Glasses": "👓", "Hat": "🎩", "Backpack": "🎒", "Scarf": "🧣",
  "Headband": "💆", "Cape": "🦸", "Bow tie": "🎀",
};

interface CharacterTraits {
  gender: string | null;
  skinTone: string | null;
  hairColor: string | null;
  eyeColor: string | null;
  hairStyle: string | null;
  top: string | null;
  topColor: string | null;
  bottom: string | null;
  shoes: string | null;
  accessories: string[];
}

function buildCharacterDescription(traits: CharacterTraits): string {
  const parts: string[] = [];

  if (traits.skinTone) parts.push(`${traits.skinTone.toLowerCase()} skin tone`);
  if (traits.hairStyle && traits.hairColor) {
    parts.push(`${traits.hairStyle.toLowerCase()} ${traits.hairColor.toLowerCase()} hair`);
  } else if (traits.hairStyle) {
    parts.push(`${traits.hairStyle.toLowerCase()} hair`);
  } else if (traits.hairColor) {
    parts.push(`${traits.hairColor.toLowerCase()} hair`);
  }
  if (traits.eyeColor) parts.push(`${traits.eyeColor.toLowerCase()} eyes`);

  const clothing: string[] = [];
  if (traits.top) {
    const topStr = traits.topColor
      ? `a ${traits.topColor.toLowerCase()} ${traits.top.toLowerCase()}`
      : `a ${traits.top.toLowerCase()}`;
    clothing.push(topStr);
  }
  if (traits.bottom) clothing.push(traits.bottom.toLowerCase());
  if (traits.shoes) clothing.push(traits.shoes.toLowerCase());
  if (clothing.length > 0) parts.push(`wearing ${clothing.join(", ")}`);

  if (traits.accessories.length > 0) {
    parts.push(`with ${traits.accessories.map((a) => a.toLowerCase()).join(" and ")}`);
  }

  if (parts.length === 0 && !traits.gender) return "";
  const genderWord = traits.gender ? traits.gender.toLowerCase() : "child";
  return `Main character: a ${genderWord} with ${parts.length > 0 ? parts.join(", ") : "a friendly appearance"}.`;
}

function ColorSwatch({
  options,
  selected,
  onSelect,
  disabled,
}: {
  options: { label: string; color: string }[];
  selected: string | null;
  onSelect: (label: string | null) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.label}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(selected === opt.label ? null : opt.label)}
          title={opt.label}
          className="w-9 h-9 transition-all active:scale-90 disabled:opacity-60"
          style={{
            backgroundColor: opt.color,
            border: selected === opt.label ? "3px solid var(--pixel-dark)" : "2px solid var(--pixel-mid)",
            borderRadius: "8px",
            boxShadow: selected === opt.label ? "2px 2px 0 var(--pixel-dark)" : "1px 1px 0 var(--pixel-mid)",
            transform: selected === opt.label ? "scale(1.1)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

function StyledSelect({
  value,
  options,
  onChange,
  placeholder,
  disabled,
}: {
  value: string | null;
  options: string[];
  onChange: (val: string | null) => void;
  placeholder: string;
  disabled: boolean;
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      disabled={disabled}
      className="pixel-input w-full px-3 py-2 text-sm disabled:opacity-60 cursor-pointer appearance-none"
      style={{ color: "var(--pixel-dark)" }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{EMOJI[opt] ? `${EMOJI[opt]} ${opt}` : opt}</option>
      ))}
    </select>
  );
}

function getColorHex(label: string | null, options: { label: string; color: string }[]): string | null {
  if (!label) return null;
  return options.find((o) => o.label === label)?.color ?? null;
}

// Pixel art character preview — all shapes are blocky rectangles on a 4px grid
function CharacterPreview({ traits }: { traits: CharacterTraits }) {
  const skin = getColorHex(traits.skinTone, SKIN_TONES) ?? "#EDBB99";
  const hair = getColorHex(traits.hairColor, HAIR_COLORS) ?? "#6B4226";
  const eyes = getColorHex(traits.eyeColor, EYE_COLORS) ?? "#5B3A1A";
  const topCol = getColorHex(traits.topColor, TOP_COLORS) ?? "#2E86C1";
  const bottomCol = traits.bottom === "Skirt" ? "#8E44AD" : "#2C3E50";
  const shoeCol = "#555";
  const isGirl = traits.gender === "Girl";
  const isBoy = traits.gender === "Boy";
  const outline = "#383659";

  const hs = traits.hairStyle ?? "";
  const isLong = hs.includes("Long") || hs === "Braids" || hs === "Pigtails";
  const isCurly = hs.includes("curly") || hs === "Afro";
  const isBuzz = hs === "Buzz cut";
  const isPonytail = hs === "Ponytail";
  const isBun = hs === "Bun";
  const isMohawk = hs === "Mohawk";
  const isPigtails = hs === "Pigtails";

  // Grid unit = 4px, canvas = 96x144
  return (
    <div className="flex justify-center py-2">
      <svg
        width="128"
        height="192"
        viewBox="0 0 96 144"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: "pixelated" }}
        shapeRendering="crispEdges"
      >
        {/* Hair behind head (long hair) */}
        {isLong && !isPigtails && (
          <rect x="20" y="20" width="56" height="52" fill={hair} />
        )}
        {isPigtails && (
          <>
            <rect x="12" y="24" width="12" height="40" fill={hair} />
            <rect x="72" y="24" width="12" height="40" fill={hair} />
          </>
        )}

        {/* Head */}
        <rect x="24" y="16" width="48" height="44" fill={skin} />
        <rect x="24" y="16" width="48" height="44" fill="none" stroke={outline} strokeWidth="2" />

        {/* Hair on top */}
        {isBuzz ? (
          <rect x="24" y="12" width="48" height="12" fill={hair} opacity="0.5" />
        ) : isMohawk ? (
          <rect x="40" y="0" width="16" height="20" fill={hair} />
        ) : isBun ? (
          <>
            <rect x="24" y="8" width="48" height="12" fill={hair} />
            <rect x="36" y="0" width="24" height="12" fill={hair} />
          </>
        ) : isPonytail ? (
          <>
            <rect x="24" y="8" width="48" height="12" fill={hair} />
            <rect x="68" y="20" width="12" height="36" fill={hair} />
          </>
        ) : isCurly ? (
          <>
            <rect x="20" y="8" width="56" height="16" fill={hair} />
            <rect x="16" y="16" width="8" height="20" fill={hair} />
            <rect x="72" y="16" width="8" height="20" fill={hair} />
            {isLong && <rect x="16" y="36" width="8" height="16" fill={hair} />}
            {isLong && <rect x="72" y="36" width="8" height="16" fill={hair} />}
          </>
        ) : (
          /* Default / short / bob */
          <rect x="24" y="8" width="48" height="14" fill={hair} />
        )}

        {/* Eyes — pixel squares */}
        <rect x="32" y="32" width="8" height="8" fill="white" />
        <rect x="56" y="32" width="8" height="8" fill="white" />
        <rect x="34" y="34" width="4" height="4" fill={eyes} />
        <rect x="58" y="34" width="4" height="4" fill={eyes} />
        {/* Highlight pixel */}
        <rect x="35" y="33" width="2" height="2" fill="white" />
        <rect x="59" y="33" width="2" height="2" fill="white" />

        {/* Mouth — small pixel line */}
        <rect x="40" y="48" width="16" height="2" fill={outline} opacity="0.5" />

        {/* Nose — tiny pixel */}
        <rect x="46" y="43" width="4" height="3" fill={outline} opacity="0.2" />

        {/* Glasses */}
        {traits.accessories.includes("Glasses") && (
          <>
            <rect x="30" y="30" width="12" height="12" fill="none" stroke={outline} strokeWidth="2" />
            <rect x="54" y="30" width="12" height="12" fill="none" stroke={outline} strokeWidth="2" />
            <rect x="42" y="34" width="12" height="2" fill={outline} />
          </>
        )}

        {/* Hat */}
        {traits.accessories.includes("Hat") && (
          <>
            <rect x="20" y="8" width="56" height="8" fill="#D4A017" />
            <rect x="28" y="0" width="40" height="12" fill="#D4A017" />
            <rect x="20" y="8" width="56" height="8" fill="none" stroke={outline} strokeWidth="1" />
          </>
        )}

        {/* Headband */}
        {traits.accessories.includes("Headband") && (
          <rect x="24" y="18" width="48" height="4" fill="#EC7063" />
        )}

        {/* Neck */}
        <rect x="40" y="58" width="16" height="8" fill={skin} />

        {/* Cape (behind body) */}
        {traits.accessories.includes("Cape") && (
          <rect x="16" y="64" width="64" height="48" fill="#8E44AD" opacity="0.5" />
        )}

        {/* Body / Top */}
        {isGirl ? (
          <>
            <rect x="28" y="64" width="40" height="12" fill={topCol} />
            <rect x="32" y="76" width="32" height="8" fill={topCol} />
            <rect x="28" y="84" width="40" height="4" fill={topCol} />
          </>
        ) : isBoy ? (
          <>
            <rect x="24" y="64" width="48" height="12" fill={topCol} />
            <rect x="28" y="76" width="40" height="16" fill={topCol} />
          </>
        ) : (
          <rect x="28" y="64" width="40" height="28" fill={topCol} />
        )}
        {/* Body outline */}
        <rect x={isGirl ? 28 : isBoy ? 24 : 28} y="64" width={isGirl ? 40 : isBoy ? 48 : 40} height={isGirl ? 24 : isBoy ? 28 : 28} fill="none" stroke={outline} strokeWidth="1" />

        {/* Scarf */}
        {traits.accessories.includes("Scarf") && (
          <>
            <rect x="32" y="60" width="32" height="6" fill="#E74C3C" />
            <rect x="40" y="66" width="8" height="12" fill="#E74C3C" />
          </>
        )}

        {/* Bow tie */}
        {traits.accessories.includes("Bow tie") && (
          <>
            <rect x="40" y="66" width="6" height="4" fill="#E74C3C" />
            <rect x="50" y="66" width="6" height="4" fill="#E74C3C" />
            <rect x="46" y="66" width="4" height="4" fill="#C0392B" />
          </>
        )}

        {/* Arms */}
        {isBoy ? (
          <>
            <rect x="12" y="66" width="12" height="28" fill={skin} />
            <rect x="72" y="66" width="12" height="28" fill={skin} />
          </>
        ) : (
          <>
            <rect x="16" y="68" width="12" height="24" fill={skin} />
            <rect x="68" y="68" width="12" height="24" fill={skin} />
          </>
        )}

        {/* Backpack straps */}
        {traits.accessories.includes("Backpack") && (
          <>
            <rect x="32" y="66" width="4" height="24" fill="#E67E22" />
            <rect x="60" y="66" width="4" height="24" fill="#E67E22" />
          </>
        )}

        {/* Legs / Bottom */}
        {isGirl && (traits.bottom === "Skirt" || traits.bottom === "Leggings" || !traits.bottom) ? (
          <>
            {/* Skirt — blocky trapezoid via stacked rects */}
            <rect x="24" y="88" width="48" height="4" fill={bottomCol} />
            <rect x="20" y="92" width="56" height="4" fill={bottomCol} />
            <rect x="16" y="96" width="64" height="4" fill={bottomCol} />
            {/* Legs */}
            <rect x="32" y="100" width="12" height="16" fill={skin} />
            <rect x="52" y="100" width="12" height="16" fill={skin} />
          </>
        ) : (
          <>
            <rect x="32" y="88" width="12" height="28" fill={bottomCol} />
            <rect x="52" y="88" width="12" height="28" fill={bottomCol} />
          </>
        )}

        {/* Shoes */}
        {traits.shoes !== "Barefoot" && (
          isGirl && (traits.bottom === "Skirt" || traits.bottom === "Leggings" || !traits.bottom) ? (
            <>
              <rect x="28" y="116" width="16" height="6" fill={shoeCol} />
              <rect x="52" y="116" width="16" height="6" fill={shoeCol} />
            </>
          ) : (
            <>
              <rect x="28" y="116" width="16" height="6" fill={shoeCol} />
              <rect x="52" y="116" width="16" height="6" fill={shoeCol} />
            </>
          )
        )}
      </svg>
    </div>
  );
}

const INITIAL_TRAITS: CharacterTraits = {
  gender: null,
  skinTone: null,
  hairColor: null,
  eyeColor: null,
  hairStyle: null,
  top: null,
  topColor: null,
  bottom: null,
  shoes: null,
  accessories: [],
};

export default function StoryForm({ onSubmit, loading, prefillTopic = "" }: StoryFormProps) {
  const [language, setLanguage] = useState("English");
  const t = getTranslations(language);

  const AGE_GROUPS = [
    { id: "5-7", label: t.littleReader, emoji: "🌱", desc: t.littleReaderAge },
    { id: "8-10", label: t.explorer, emoji: "🔭", desc: t.explorerAge },
    { id: "11-13", label: t.adventurer, emoji: "⚡", desc: t.adventurerAge },
  ];

  const [topic, setTopic] = useState(prefillTopic);

  useEffect(() => {
    if (prefillTopic) setTopic(prefillTopic);
  }, [prefillTopic]);

  const [showDesigner, setShowDesigner] = useState(false);
  const [traits, setTraits] = useState<CharacterTraits>({ ...INITIAL_TRAITS });

  const updateTrait = <K extends keyof CharacterTraits>(key: K, value: CharacterTraits[K]) => {
    setTraits((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAccessory = (acc: string) => {
    setTraits((prev) => ({
      ...prev,
      accessories: prev.accessories.includes(acc)
        ? prev.accessories.filter((a) => a !== acc)
        : [...prev.accessories, acc],
    }));
  };

  const resetTraits = () => setTraits({ ...INITIAL_TRAITS });

  const characterDescription = buildCharacterDescription(traits);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const ageGroup = data.get("ageGroup") as string;
        if (topic.trim() && ageGroup) onSubmit(topic.trim(), ageGroup, language, characterDescription);
      }}
      className="flex flex-col gap-7 w-full max-w-xl"
    >
      {/* Topic input */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="topic"
          className="font-pixel"
          style={{ fontSize: "1rem", fontWeight: 700, color: "var(--pixel-dark)", letterSpacing: "0.02em" }}
        >
          {t.topicLabel}
        </label>
        <input
          id="topic"
          name="topic"
          type="text"
          required
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={t.topicPlaceholder}
          disabled={loading}
          className="pixel-input w-full px-4 py-3 text-sm disabled:opacity-60"
          style={{ color: "var(--pixel-dark)" }}
        />
      </div>

      {/* Character Designer (optional, collapsible) */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => setShowDesigner((s) => !s)}
          className="flex items-center gap-2 font-pixel disabled:opacity-60 transition"
          style={{ fontSize: "1rem", fontWeight: 700, color: "var(--pixel-dark)", letterSpacing: "0.02em" }}
        >
          <span className={`transition-transform duration-200 ${showDesigner ? "rotate-90" : ""}`}>
            &#9654;
          </span>
          <span>🎨 Design Your Character</span>
          <span className="font-pixel" style={{ fontSize: "0.7rem", fontWeight: 400, color: "var(--pixel-mid)", marginLeft: "4px" }}>(Optional)</span>
        </button>

        {showDesigner && (
          <div
            className="pixel-card p-5 flex flex-col gap-5"
          >
            {/* Character Preview */}
            <div className="flex flex-col items-center gap-1">
              <CharacterPreview traits={traits} />
              <span className="font-pixel" style={{ fontSize: "0.65rem", color: "var(--pixel-mid)", letterSpacing: "0.1em" }}>PREVIEW</span>
            </div>
            <div style={{ height: "2px", background: "var(--pixel-mid)", opacity: 0.3 }} />

            {/* Gender */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>Gender</span>
              <div className="flex gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g.label}
                    type="button"
                    disabled={loading}
                    onClick={() => updateTrait("gender", traits.gender === g.label ? null : g.label)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-60"
                    style={{
                      background: traits.gender === g.label ? "var(--pixel-card-alt)" : "var(--pixel-card)",
                      border: `3px solid ${traits.gender === g.label ? "var(--pixel-dark)" : "var(--pixel-mid)"}`,
                      borderRadius: "10px",
                      boxShadow: traits.gender === g.label ? "3px 3px 0 var(--pixel-dark)" : "2px 2px 0 var(--pixel-mid)",
                      color: "var(--pixel-dark)",
                    }}
                  >
                    <span className="text-lg">{g.emoji}</span>
                    <span className="font-pixel" style={{ fontSize: "0.8rem" }}>{g.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Tone */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>Skin Tone</span>
              <ColorSwatch
                options={SKIN_TONES}
                selected={traits.skinTone}
                onSelect={(v) => updateTrait("skinTone", v)}
                disabled={loading}
              />
            </div>

            {/* Hair Color */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>Hair Color</span>
              <ColorSwatch
                options={HAIR_COLORS}
                selected={traits.hairColor}
                onSelect={(v) => updateTrait("hairColor", v)}
                disabled={loading}
              />
            </div>

            {/* Hair Style */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>Hair Style</span>
              <StyledSelect
                value={traits.hairStyle}
                options={HAIR_STYLES}
                onChange={(v) => updateTrait("hairStyle", v)}
                placeholder="✨ Pick a hair style..."
                disabled={loading}
              />
            </div>

            {/* Eye Color */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>Eye Color</span>
              <ColorSwatch
                options={EYE_COLORS}
                selected={traits.eyeColor}
                onSelect={(v) => updateTrait("eyeColor", v)}
                disabled={loading}
              />
            </div>

            {/* Clothing Top + Color */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>Top</span>
              <StyledSelect
                value={traits.top}
                options={TOPS}
                onChange={(v) => updateTrait("top", v)}
                placeholder="👕 Pick a top..."
                disabled={loading}
              />
              {traits.top && (
                <div className="flex flex-col gap-1">
                  <span className="font-pixel" style={{ fontSize: "0.7rem", color: "var(--pixel-mid)" }}>Top Color</span>
                  <ColorSwatch
                    options={TOP_COLORS}
                    selected={traits.topColor}
                    onSelect={(v) => updateTrait("topColor", v)}
                    disabled={loading}
                  />
                </div>
              )}
            </div>

            {/* Clothing Bottom */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>Bottom</span>
              <StyledSelect
                value={traits.bottom}
                options={BOTTOMS}
                onChange={(v) => updateTrait("bottom", v)}
                placeholder="👖 Pick bottoms..."
                disabled={loading}
              />
            </div>

            {/* Shoes */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>Shoes</span>
              <StyledSelect
                value={traits.shoes}
                options={SHOES}
                onChange={(v) => updateTrait("shoes", v)}
                placeholder="👟 Pick shoes..."
                disabled={loading}
              />
            </div>

            {/* Accessories (multi-select toggle buttons) */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>Accessories</span>
              <div className="flex flex-wrap gap-2">
                {ACCESSORIES.map((acc) => (
                  <button
                    key={acc}
                    type="button"
                    disabled={loading}
                    onClick={() => toggleAccessory(acc)}
                    className="px-3 py-1.5 text-xs font-semibold transition active:scale-95 disabled:opacity-60"
                    style={{
                      background: traits.accessories.includes(acc) ? "var(--pixel-card-alt)" : "var(--pixel-card)",
                      border: `${traits.accessories.includes(acc) ? "3px" : "2px"} solid ${traits.accessories.includes(acc) ? "var(--pixel-dark)" : "var(--pixel-mid)"}`,
                      borderRadius: "8px",
                      boxShadow: traits.accessories.includes(acc) ? "2px 2px 0 var(--pixel-dark)" : "1px 1px 0 var(--pixel-mid)",
                      color: "var(--pixel-dark)",
                    }}
                  >
                    {EMOJI[acc] ? `${EMOJI[acc]} ` : ""}{acc}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Preview */}
            {characterDescription && (
              <div
                style={{
                  background: "var(--pixel-card)",
                  border: "2px solid var(--pixel-mid)",
                  borderRadius: "10px",
                  padding: "10px 14px",
                  boxShadow: "2px 2px 0 var(--pixel-mid)",
                }}
              >
                <p className="font-pixel" style={{ fontSize: "0.7rem", color: "var(--pixel-mid)", fontStyle: "italic" }}>{characterDescription}</p>
              </div>
            )}

            <button
              type="button"
              onClick={resetTraits}
              disabled={loading}
              className="self-end font-pixel transition disabled:opacity-60"
              style={{ fontSize: "0.7rem", color: "var(--pixel-mid)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
            >
              Reset character
            </button>
          </div>
        )}
      </div>

      {/* Language selector */}
      <div className="flex flex-col gap-3">
        <span
          className="font-pixel"
          style={{ fontSize: "1rem", fontWeight: 700, color: "var(--pixel-dark)", letterSpacing: "0.02em" }}
        >
          {t.languageLabel}
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              type="button"
              disabled={loading}
              onClick={() => setLanguage(lang.value)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold disabled:opacity-60 transition-transform active:scale-95"
              style={{
                background: language === lang.value ? "var(--pixel-card-alt)" : "#EAE0DF",
                border: `3px solid ${language === lang.value ? "var(--pixel-dark)" : "var(--pixel-mid)"}`,
                borderRadius: "10px",
                boxShadow: language === lang.value
                  ? "3px 3px 0 var(--pixel-dark)"
                  : "2px 2px 0 var(--pixel-mid)",
                color: "var(--pixel-dark)",
              }}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="text-xs">{lang.value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Age group selector */}
      <div className="flex flex-col gap-3">
        <span
          className="font-pixel"
          style={{ fontSize: "1rem", fontWeight: 700, color: "var(--pixel-dark)", letterSpacing: "0.02em" }}
        >
          {t.readingLevel}
        </span>
        <div className="grid grid-cols-3 gap-3">
          {AGE_GROUPS.map((group) => (
            <label key={group.id} className="cursor-pointer group">
              <input
                type="radio"
                name="ageGroup"
                value={group.id}
                defaultChecked={group.id === "8-10"}
                disabled={loading}
                className="sr-only peer"
              />
              <div
                className="flex flex-col items-center gap-1 py-4 px-2 text-center transition peer-checked:scale-95"
                style={{
                  background: "#EAE0DF",
                  border: "3px solid var(--pixel-mid)",
                  borderRadius: "12px",
                  boxShadow: "3px 3px 0 var(--pixel-mid)",
                }}
              >
                <span className="text-3xl">{group.emoji}</span>
                <span
                  className="font-pixel"
                  style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}
                >
                  {group.label}
                </span>
                <span className="text-xs font-semibold" style={{ color: "var(--pixel-mid)" }}>
                  {group.desc}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="pixel-btn w-full py-4 text-sm"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="inline-block animate-bounce">📖</span>
            <span>{t.creating}</span>
          </span>
        ) : (
          t.createStory
        )}
      </button>
    </form>
  );
}
