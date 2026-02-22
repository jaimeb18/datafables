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

// Chibi pixel art character preview — big round head, tiny body, like RPG sprites
function CharacterPreview({ traits }: { traits: CharacterTraits }) {
  const skin = getColorHex(traits.skinTone, SKIN_TONES) ?? "#EDBB99";
  const hair = getColorHex(traits.hairColor, HAIR_COLORS) ?? "#6B4226";
  const eyes = getColorHex(traits.eyeColor, EYE_COLORS) ?? "#5B3A1A";
  const topCol = getColorHex(traits.topColor, TOP_COLORS) ?? "#2E86C1";
  const bottomCol = traits.bottom === "Skirt" ? "#8E44AD" : "#2C3E50";
  const shoeCol = "#4A4A4A";
  const isGirl = traits.gender === "Girl";
  const outline = "#383659";
  const skinShade = "#00000018"; // subtle shadow overlay

  const hs = traits.hairStyle ?? "";
  const isLong = hs.includes("Long") || hs === "Braids" || hs === "Pigtails";
  const isCurly = hs.includes("curly") || hs === "Afro";
  const isBuzz = hs === "Buzz cut";
  const isPonytail = hs === "Ponytail";
  const isBun = hs === "Bun";
  const isMohawk = hs === "Mohawk";
  const isPigtails = hs === "Pigtails";
  const isBob = hs === "Bob";
  const isBraids = hs === "Braids";
  const isAfro = hs === "Afro";

  // Darker shade of hair for depth
  const hairDark = "#00000020";

  // Head dimensions: rounded oval, centered at x=32, top at y=8
  // Head spans roughly x:18-46, y:8-30 (28w x 22h)
  const headX = 18;
  const headW = 28;
  const headY = 10;

  // Body starts at y=32
  const bodyY = 33;
  const bodyX = 22;
  const bodyW = 20;
  const bodyH = 12;

  return (
    <div className="flex justify-center py-2">
      <svg
        width="160"
        height="160"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: "pixelated" }}
        shapeRendering="crispEdges"
      >
        {/* ═══ HAIR BEHIND HEAD (long styles) ═══ */}
        {isLong && !isPigtails && !isBraids && !isAfro && (
          <>
            <rect x={headX - 1} y={headY + 4} width={headW + 2} height={24} fill={hair} />
            <rect x={headX} y={headY + 22} width={headW} height={6} fill={hair} />
          </>
        )}
        {isPigtails && (
          <>
            {/* Two hanging pigtail strips */}
            <rect x={headX - 4} y={headY + 6} width={4} height={22} fill={hair} />
            <rect x={headX + headW} y={headY + 6} width={4} height={22} fill={hair} />
            {/* Small bows */}
            <rect x={headX - 5} y={headY + 5} width={6} height={2} fill="#EC7063" />
            <rect x={headX + headW - 1} y={headY + 5} width={6} height={2} fill="#EC7063" />
          </>
        )}
        {isBraids && (
          <>
            {/* Two thin braids hanging down */}
            <rect x={headX + 2} y={headY + 4} width={3} height={28} fill={hair} />
            <rect x={headX + headW - 5} y={headY + 4} width={3} height={28} fill={hair} />
            {/* Braid texture */}
            <rect x={headX + 2} y={headY + 10} width={3} height={1} fill={hairDark} />
            <rect x={headX + 2} y={headY + 14} width={3} height={1} fill={hairDark} />
            <rect x={headX + 2} y={headY + 18} width={3} height={1} fill={hairDark} />
            <rect x={headX + headW - 5} y={headY + 10} width={3} height={1} fill={hairDark} />
            <rect x={headX + headW - 5} y={headY + 14} width={3} height={1} fill={hairDark} />
            <rect x={headX + headW - 5} y={headY + 18} width={3} height={1} fill={hairDark} />
          </>
        )}
        {isAfro && (
          /* Large rounded mass around head */
          <>
            <rect x={headX - 6} y={headY - 6} width={headW + 12} height={4} fill={hair} />
            <rect x={headX - 8} y={headY - 2} width={headW + 16} height={26} fill={hair} />
            <rect x={headX - 6} y={headY + 22} width={headW + 12} height={4} fill={hair} />
            {/* Texture dots */}
            <rect x={headX - 5} y={headY + 2} width={1} height={1} fill={hairDark} />
            <rect x={headX + headW + 4} y={headY + 6} width={1} height={1} fill={hairDark} />
            <rect x={headX - 3} y={headY + 12} width={1} height={1} fill={hairDark} />
            <rect x={headX + headW + 2} y={headY + 14} width={1} height={1} fill={hairDark} />
          </>
        )}

        {/* Cape behind body */}
        {traits.accessories.includes("Cape") && (
          <rect x={bodyX - 4} y={bodyY} width={bodyW + 8} height={bodyH + 14} fill="#8E44AD" opacity="0.6" rx="0" />
        )}

        {/* Backpack behind body */}
        {traits.accessories.includes("Backpack") && (
          <rect x={bodyX + bodyW - 2} y={bodyY + 1} width={6} height={10} fill="#E67E22" />
        )}

        {/* ═══ HEAD — rounded oval from stacked rects ═══ */}
        {/* Outline layer (1px bigger) */}
        <rect x={headX + 3} y={headY - 1} width={headW - 6} height={1} fill={outline} />
        <rect x={headX + 1} y={headY} width={headW - 2} height={1} fill={outline} />
        <rect x={headX - 1} y={headY + 1} width={headW + 2} height={20} fill={outline} />
        <rect x={headX + 1} y={headY + 21} width={headW - 2} height={1} fill={outline} />
        <rect x={headX + 3} y={headY + 22} width={headW - 6} height={1} fill={outline} />
        {/* Skin fill */}
        <rect x={headX + 4} y={headY} width={headW - 8} height={1} fill={skin} />
        <rect x={headX + 2} y={headY + 1} width={headW - 4} height={1} fill={skin} />
        <rect x={headX} y={headY + 2} width={headW} height={18} fill={skin} />
        <rect x={headX + 2} y={headY + 20} width={headW - 4} height={1} fill={skin} />
        <rect x={headX + 4} y={headY + 21} width={headW - 8} height={1} fill={skin} />
        {/* Shadow on right side of face */}
        <rect x={headX + headW - 3} y={headY + 4} width={3} height={14} fill={skinShade} />

        {/* ═══ HAIR ON TOP ═══ */}
        {isBuzz ? (
          /* Very thin cap */
          <>
            <rect x={headX + 2} y={headY} width={headW - 4} height={3} fill={hair} opacity="0.6" />
            <rect x={headX + 4} y={headY - 1} width={headW - 8} height={2} fill={hair} opacity="0.4" />
          </>
        ) : isMohawk ? (
          /* Tall center strip */
          <>
            <rect x={headX + 10} y={headY - 8} width={8} height={12} fill={hair} />
            <rect x={headX + 11} y={headY - 10} width={6} height={3} fill={hair} />
            {/* Texture */}
            <rect x={headX + 12} y={headY - 6} width={1} height={1} fill={hairDark} />
          </>
        ) : isBun ? (
          <>
            {/* Hair cap */}
            <rect x={headX + 2} y={headY - 2} width={headW - 4} height={6} fill={hair} />
            <rect x={headX} y={headY + 2} width={headW} height={3} fill={hair} />
            {/* Bun on top */}
            <rect x={headX + 9} y={headY - 6} width={10} height={6} fill={hair} />
            <rect x={headX + 10} y={headY - 8} width={8} height={3} fill={hair} />
            {/* Side fringe */}
            <rect x={headX} y={headY + 4} width={3} height={6} fill={hair} />
            <rect x={headX + headW - 3} y={headY + 4} width={3} height={4} fill={hair} />
          </>
        ) : isPonytail ? (
          <>
            {/* Hair cap */}
            <rect x={headX + 2} y={headY - 2} width={headW - 4} height={6} fill={hair} />
            <rect x={headX} y={headY + 2} width={headW} height={3} fill={hair} />
            {/* Side fringe */}
            <rect x={headX} y={headY + 4} width={3} height={8} fill={hair} />
            {/* Ponytail going to the right */}
            <rect x={headX + headW - 2} y={headY + 2} width={6} height={4} fill={hair} />
            <rect x={headX + headW + 2} y={headY + 5} width={4} height={16} fill={hair} />
            <rect x={headX + headW + 1} y={headY + 18} width={3} height={4} fill={hair} />
          </>
        ) : isBob ? (
          <>
            {/* Hair cap */}
            <rect x={headX + 2} y={headY - 2} width={headW - 4} height={6} fill={hair} />
            <rect x={headX} y={headY + 2} width={headW} height={3} fill={hair} />
            {/* Bob sides — wider at jaw level */}
            <rect x={headX - 2} y={headY + 4} width={4} height={14} fill={hair} />
            <rect x={headX + headW - 2} y={headY + 4} width={4} height={14} fill={hair} />
            <rect x={headX - 3} y={headY + 12} width={3} height={6} fill={hair} />
            <rect x={headX + headW} y={headY + 12} width={3} height={6} fill={hair} />
          </>
        ) : isCurly && !isAfro ? (
          <>
            {/* Curly cap with bumpy outline */}
            <rect x={headX + 2} y={headY - 3} width={headW - 4} height={3} fill={hair} />
            <rect x={headX - 1} y={headY - 1} width={headW + 2} height={6} fill={hair} />
            {/* Bumpy curls on top */}
            <rect x={headX + 4} y={headY - 5} width={4} height={3} fill={hair} />
            <rect x={headX + 12} y={headY - 5} width={4} height={3} fill={hair} />
            <rect x={headX + 20} y={headY - 5} width={4} height={3} fill={hair} />
            {/* Side fringe — curly texture */}
            <rect x={headX - 2} y={headY + 3} width={4} height={10} fill={hair} />
            <rect x={headX + headW - 2} y={headY + 3} width={4} height={10} fill={hair} />
            <rect x={headX - 3} y={headY + 5} width={2} height={3} fill={hair} />
            <rect x={headX + headW + 1} y={headY + 7} width={2} height={3} fill={hair} />
            {isLong && (
              <>
                <rect x={headX - 2} y={headY + 12} width={4} height={12} fill={hair} />
                <rect x={headX + headW - 2} y={headY + 12} width={4} height={12} fill={hair} />
                <rect x={headX - 3} y={headY + 16} width={2} height={3} fill={hair} />
                <rect x={headX + headW + 1} y={headY + 18} width={2} height={3} fill={hair} />
              </>
            )}
          </>
        ) : isAfro ? (
          /* Afro — hair cap already drawn behind, just add top detail */
          <>
            <rect x={headX + 2} y={headY - 2} width={headW - 4} height={4} fill={hair} />
          </>
        ) : (
          /* Default short straight / long straight */
          <>
            <rect x={headX + 2} y={headY - 2} width={headW - 4} height={6} fill={hair} />
            <rect x={headX} y={headY + 2} width={headW} height={3} fill={hair} />
            {/* Fringe / bangs */}
            <rect x={headX} y={headY + 4} width={3} height={6} fill={hair} />
            <rect x={headX + headW - 3} y={headY + 4} width={3} height={4} fill={hair} />
            {/* Long straight extends down */}
            {isLong && (
              <>
                <rect x={headX - 1} y={headY + 4} width={3} height={20} fill={hair} />
                <rect x={headX + headW - 2} y={headY + 4} width={3} height={20} fill={hair} />
              </>
            )}
          </>
        )}

        {/* ═══ EYES — small dots ═══ */}
        <rect x={headX + 7} y={headY + 12} width={3} height={3} fill={eyes} />
        <rect x={headX + 18} y={headY + 12} width={3} height={3} fill={eyes} />
        {/* Eye highlights */}
        <rect x={headX + 8} y={headY + 12} width={1} height={1} fill="white" />
        <rect x={headX + 19} y={headY + 12} width={1} height={1} fill="white" />

        {/* Blush (girl) */}
        {isGirl && (
          <>
            <rect x={headX + 3} y={headY + 14} width={3} height={2} fill="#F5A0A0" opacity="0.5" />
            <rect x={headX + headW - 6} y={headY + 14} width={3} height={2} fill="#F5A0A0" opacity="0.5" />
          </>
        )}

        {/* Mouth — tiny line */}
        <rect x={headX + 11} y={headY + 17} width={6} height={1} fill={outline} opacity="0.35" />

        {/* ═══ GLASSES ═══ */}
        {traits.accessories.includes("Glasses") && (
          <>
            <rect x={headX + 5} y={headY + 10} width={6} height={6} fill="none" stroke={outline} strokeWidth="1" />
            <rect x={headX + 17} y={headY + 10} width={6} height={6} fill="none" stroke={outline} strokeWidth="1" />
            <rect x={headX + 11} y={headY + 12} width={6} height={1} fill={outline} />
          </>
        )}

        {/* ═══ HAT ═══ */}
        {traits.accessories.includes("Hat") && (
          <>
            <rect x={headX - 3} y={headY - 2} width={headW + 6} height={3} fill="#D4A017" />
            <rect x={headX + 2} y={headY - 8} width={headW - 4} height={7} fill="#D4A017" />
            <rect x={headX - 3} y={headY - 2} width={headW + 6} height={3} fill="none" stroke={outline} strokeWidth="0.5" />
          </>
        )}

        {/* ═══ HEADBAND ═══ */}
        {traits.accessories.includes("Headband") && (
          <rect x={headX} y={headY + 3} width={headW} height={2} fill="#EC7063" />
        )}

        {/* ═══ NECK ═══ */}
        <rect x={28} y={headY + 21} width={8} height={3} fill={skin} />

        {/* ═══ BODY / TOP ═══ */}
        {traits.top === "Dress" ? (
          <>
            {/* Dress — wider at bottom */}
            <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH - 2} fill={topCol} />
            <rect x={bodyX - 2} y={bodyY + bodyH - 2} width={bodyW + 4} height={3} fill={topCol} />
            <rect x={bodyX - 3} y={bodyY + bodyH + 1} width={bodyW + 6} height={3} fill={topCol} />
            {/* Collar */}
            <rect x={28} y={bodyY} width={8} height={1} fill="white" opacity="0.5" />
            {/* Body outline */}
            <rect x={bodyX - 3} y={bodyY} width={1} height={bodyH + 4} fill={outline} opacity="0.3" />
            <rect x={bodyX + bodyW + 2} y={bodyY} width={1} height={bodyH + 4} fill={outline} opacity="0.3" />
          </>
        ) : (
          <>
            <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} fill={topCol} />
            {/* Collar detail */}
            <rect x={28} y={bodyY} width={8} height={1} fill="white" opacity="0.5" />
            {/* Body shadow */}
            <rect x={bodyX + bodyW - 3} y={bodyY + 2} width={3} height={bodyH - 3} fill="#00000012" />
            {/* Body outline */}
            <rect x={bodyX - 1} y={bodyY} width={1} height={bodyH} fill={outline} opacity="0.3" />
            <rect x={bodyX + bodyW} y={bodyY} width={1} height={bodyH} fill={outline} opacity="0.3" />
          </>
        )}

        {/* ═══ SCARF ═══ */}
        {traits.accessories.includes("Scarf") && (
          <>
            <rect x={bodyX + 2} y={bodyY - 1} width={bodyW - 4} height={3} fill="#E74C3C" />
            <rect x={bodyX + bodyW / 2 - 1} y={bodyY + 2} width={3} height={5} fill="#E74C3C" />
          </>
        )}

        {/* ═══ BOW TIE ═══ */}
        {traits.accessories.includes("Bow tie") && (
          <>
            <rect x={29} y={bodyY + 1} width={2} height={2} fill="#E74C3C" />
            <rect x={33} y={bodyY + 1} width={2} height={2} fill="#E74C3C" />
            <rect x={31} y={bodyY + 1} width={2} height={2} fill="#C0392B" />
          </>
        )}

        {/* ═══ ARMS ═══ */}
        <rect x={bodyX - 4} y={bodyY + 1} width={4} height={9} fill={skin} />
        <rect x={bodyX + bodyW} y={bodyY + 1} width={4} height={9} fill={skin} />
        {/* Sleeve hints */}
        <rect x={bodyX - 4} y={bodyY + 1} width={4} height={3} fill={topCol} />
        <rect x={bodyX + bodyW} y={bodyY + 1} width={4} height={3} fill={topCol} />

        {/* ═══ BACKPACK STRAPS ═══ */}
        {traits.accessories.includes("Backpack") && (
          <>
            <rect x={bodyX + 2} y={bodyY + 1} width={1} height={bodyH - 2} fill="#E67E22" opacity="0.7" />
            <rect x={bodyX + bodyW - 3} y={bodyY + 1} width={1} height={bodyH - 2} fill="#E67E22" opacity="0.7" />
          </>
        )}

        {/* ═══ LEGS / BOTTOM ═══ */}
        {traits.top === "Dress" ? (
          /* Dress — legs peek out below */
          <>
            <rect x={bodyX + 4} y={bodyY + bodyH + 4} width={4} height={7} fill={skin} />
            <rect x={bodyX + bodyW - 8} y={bodyY + bodyH + 4} width={4} height={7} fill={skin} />
          </>
        ) : isGirl && traits.bottom === "Skirt" ? (
          <>
            {/* Mini skirt */}
            <rect x={bodyX - 1} y={bodyY + bodyH} width={bodyW + 2} height={3} fill={bottomCol} />
            <rect x={bodyX - 2} y={bodyY + bodyH + 3} width={bodyW + 4} height={2} fill={bottomCol} />
            {/* Legs */}
            <rect x={bodyX + 4} y={bodyY + bodyH + 5} width={4} height={6} fill={skin} />
            <rect x={bodyX + bodyW - 8} y={bodyY + bodyH + 5} width={4} height={6} fill={skin} />
          </>
        ) : (
          <>
            {/* Pants / shorts / leggings */}
            <rect x={bodyX + 3} y={bodyY + bodyH} width={5} height={8} fill={bottomCol} />
            <rect x={bodyX + bodyW - 8} y={bodyY + bodyH} width={5} height={8} fill={bottomCol} />
            {traits.bottom === "Shorts" && (
              <>
                {/* Shorter legs, skin below */}
                <rect x={bodyX + 3} y={bodyY + bodyH + 4} width={5} height={4} fill={skin} />
                <rect x={bodyX + bodyW - 8} y={bodyY + bodyH + 4} width={5} height={4} fill={skin} />
              </>
            )}
          </>
        )}

        {/* ═══ SHOES ═══ */}
        {traits.shoes !== "Barefoot" && (
          traits.top === "Dress" ? (
            <>
              <rect x={bodyX + 3} y={bodyY + bodyH + 11} width={6} height={3} fill={shoeCol} />
              <rect x={bodyX + bodyW - 9} y={bodyY + bodyH + 11} width={6} height={3} fill={shoeCol} />
            </>
          ) : isGirl && traits.bottom === "Skirt" ? (
            <>
              <rect x={bodyX + 3} y={bodyY + bodyH + 11} width={6} height={3} fill={shoeCol} />
              <rect x={bodyX + bodyW - 9} y={bodyY + bodyH + 11} width={6} height={3} fill={shoeCol} />
            </>
          ) : (
            <>
              <rect x={bodyX + 2} y={bodyY + bodyH + 8} width={6} height={3} fill={shoeCol} />
              <rect x={bodyX + bodyW - 8} y={bodyY + bodyH + 8} width={6} height={3} fill={shoeCol} />
            </>
          )
        )}
        {traits.shoes === "Barefoot" && (
          traits.top === "Dress" || (isGirl && traits.bottom === "Skirt") ? (
            <>
              <rect x={bodyX + 4} y={bodyY + bodyH + 11} width={4} height={2} fill={skin} />
              <rect x={bodyX + bodyW - 8} y={bodyY + bodyH + 11} width={4} height={2} fill={skin} />
            </>
          ) : (
            <>
              <rect x={bodyX + 3} y={bodyY + bodyH + 8} width={5} height={2} fill={skin} />
              <rect x={bodyX + bodyW - 8} y={bodyY + bodyH + 8} width={5} height={2} fill={skin} />
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
