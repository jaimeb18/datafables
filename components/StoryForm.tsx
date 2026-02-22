"use client";

import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/translations";
import { unlockAchievement } from "@/lib/achievements";
import { SHOP_ITEMS, getOwnedItems, type ShopItem } from "@/lib/shop";

interface StoryFormProps {
  onSubmit: (topic: string, ageGroup: string, language: string, characterDescription: string) => void;
  loading: boolean;
  prefillTopic?: string;
  language: string;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
  { value: "English", label: "English", flag: "🇬🇧" },
  { value: "Spanish", label: "Español", flag: "🇪🇸" },
  { value: "French", label: "Français", flag: "🇫🇷" },
  { value: "German", label: "Deutsch", flag: "🇩🇪" },
  { value: "Portuguese", label: "Português", flag: "🇧🇷" },
  { value: "Italian", label: "Italiano", flag: "🇮🇹" },
  { value: "Chinese (Simplified)", label: "中文", flag: "🇨🇳" },
  { value: "Japanese", label: "日本語", flag: "🇯🇵" },
  { value: "Arabic", label: "العربية", flag: "🇸🇦" },
  { value: "Hindi", label: "हिन्दी", flag: "🇮🇳" },
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
  { label: "Brown", color: "#8B5E3C" },
  { label: "Auburn", color: "#922B21" },
  { label: "Red", color: "#C0392B" },
  { label: "Blonde", color: "#F4D03F" },
  { label: "Strawberry Blonde", color: "#E8A87C" },
  { label: "White", color: "#F5F5F5" },
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
  { label: "Boy" },
  { label: "Girl" },
];

// Default presets applied when selecting a gender
const GENDER_PRESETS: Record<string, Partial<CharacterTraits>> = {
  Boy: {
    hairStyle: "Short straight",
    top: "T-shirt",
    bottom: "Jeans",
    shoes: "Sneakers",
  },
  Girl: {
    hairStyle: "Long straight",
    top: "T-shirt",
    bottom: "Leggings",
    shoes: "Sneakers",
  },
};

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
  // Shop-unlocked accessories
  "Sword": "⚔️", "Shield": "🛡️", "Wings": "🪽",
  "Crown": "👑", "Wand": "🪄", "Dragon": "🐉",
  // Shop-unlocked hair styles
  "Undercut": "✂️", "Dreadlocks": "🌿", "Space Buns": "🪐", "Cornrows": "🪢",
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
  shopLabels,
  newlyPurchased,
}: {
  options: { label: string; color: string }[];
  selected: string | null;
  onSelect: (label: string | null) => void;
  disabled: boolean;
  shopLabels?: Set<string>;
  newlyPurchased?: string | null;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isShop = shopLabels?.has(opt.label);
        const isNew = newlyPurchased === opt.label;
        return (
          <button
            key={opt.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(selected === opt.label ? null : opt.label)}
            title={opt.label + (isShop ? " ★ Shop Item" : "")}
            className={`relative w-9 h-9 transition-all active:scale-90 disabled:opacity-60${isNew ? " animate-pixel-glow" : ""}`}
            style={{
              backgroundColor: opt.color,
              border: selected === opt.label
                ? "3px solid var(--pixel-dark)"
                : isShop
                  ? "2px solid #2ECC71"
                  : "2px solid var(--pixel-mid)",
              borderRadius: "8px",
              boxShadow: selected === opt.label
                ? "2px 2px 0 var(--pixel-dark)"
                : isShop
                  ? "1px 1px 0 #1a6a3a"
                  : "1px 1px 0 var(--pixel-mid)",
              transform: selected === opt.label ? "scale(1.1)" : undefined,
            }}
          >
            {isShop && (
              <span
                className="font-pixel"
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  fontSize: "0.55rem",
                  lineHeight: 1,
                  background: "#2ECC71",
                  color: "#1a1428",
                  padding: "1px 3px",
                  border: "1.5px solid #1a6a3a",
                  pointerEvents: "none",
                }}
              >
                ★
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function StyledSelect({
  value,
  options,
  onChange,
  placeholder,
  disabled,
  shopValues,
}: {
  value: string | null;
  options: string[];
  onChange: (val: string | null) => void;
  placeholder: string;
  disabled: boolean;
  shopValues?: Set<string>;
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
      {options.map((opt) => {
        const isShop = shopValues?.has(opt);
        const prefix = EMOJI[opt] ? `${EMOJI[opt]} ` : "";
        return (
          <option key={opt} value={opt}>
            {isShop ? `★ ${prefix}${opt} (Shop)` : `${prefix}${opt}`}
          </option>
        );
      })}
    </select>
  );
}

function getColorHex(label: string | null, options: { label: string; color: string }[]): string | null {
  if (!label) return null;
  return options.find((o) => o.label === label)?.color ?? null;
}

// Chibi pixel art character preview — big round head, tiny body, like RPG sprites
function CharacterPreview({
  traits,
  hairColorOptions,
}: {
  traits: CharacterTraits;
  hairColorOptions: { label: string; color: string }[];
}) {
  const skin = getColorHex(traits.skinTone, SKIN_TONES) ?? "#EDBB99";
  // Use full merged list so shop-unlocked colors resolve correctly
  const hair = getColorHex(traits.hairColor, hairColorOptions) ?? "#6B4226";
  const eyes = getColorHex(traits.eyeColor, EYE_COLORS) ?? "#5B3A1A";
  const topCol = getColorHex(traits.topColor, TOP_COLORS) ?? "#2E86C1";
  // Bottom color varies by type
  const bottomCol = (() => {
    switch (traits.bottom) {
      case "Jeans": return "#3B5998";
      case "Shorts": return "#5B7FA5";
      case "Skirt": return "#8E44AD";
      case "Sweatpants": return "#6C6C6C";
      case "Leggings": return "#2C2C3E";
      case "Overalls": return "#4A6FA5";
      default: return "#3B5998";
    }
  })();
  // Shoe color varies by type
  const shoeCol = (() => {
    switch (traits.shoes) {
      case "Sneakers": return "#F0F0F0";
      case "Boots": return "#6B4226";
      case "Sandals": return "#C8A67A";
      case "Rain boots": return "#F4D03F";
      default: return "#4A4A4A";
    }
  })();
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
  const isBraids    = hs === "Braids";
  const isAfro      = hs === "Afro";
  // Shop-unlocked styles
  const isUndercut   = hs === "Undercut";
  const isSpaceBuns  = hs === "Space Buns";
  const isDreadlocks = hs === "Dreadlocks";
  const isCornrows   = hs === "Cornrows";

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

        {/* Wings behind body */}
        {traits.accessories.includes("Wings") && (
          <>
            {/* Left wing */}
            <rect x={bodyX - 16} y={bodyY}     width={14} height={6}  fill="#E8E8E8" />
            <rect x={bodyX - 14} y={bodyY + 5} width={12} height={5}  fill="#D0D0D0" />
            <rect x={bodyX - 16} y={bodyY}     width={14} height={1}  fill="white" />
            <rect x={bodyX - 16} y={bodyY}     width={1}  height={10} fill="white" opacity="0.5" />
            {/* Right wing */}
            <rect x={bodyX + bodyW + 2} y={bodyY}     width={14} height={6}  fill="#E8E8E8" />
            <rect x={bodyX + bodyW + 2} y={bodyY + 5} width={12} height={5}  fill="#D0D0D0" />
            <rect x={bodyX + bodyW + 2} y={bodyY}     width={14} height={1}  fill="white" />
            <rect x={bodyX + bodyW + 15} y={bodyY}    width={1}  height={10} fill="#C0C0C0" opacity="0.5" />
          </>
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
        ) : isUndercut ? (
          /* Undercut — tall volume on top, nearly shaved sides */
          <>
            <rect x={headX + 3} y={headY - 6} width={headW - 6} height={9} fill={hair} />
            <rect x={headX} y={headY + 1} width={headW} height={3} fill={hair} />
            {/* Shaved side fade */}
            <rect x={headX} y={headY + 3} width={2} height={5} fill={hair} opacity="0.3" />
            <rect x={headX + headW - 2} y={headY + 3} width={2} height={5} fill={hair} opacity="0.3" />
          </>
        ) : isSpaceBuns ? (
          /* Space Buns — two circular buns on top */
          <>
            {/* Base cap */}
            <rect x={headX + 2} y={headY - 1} width={headW - 4} height={4} fill={hair} />
            <rect x={headX} y={headY + 2} width={headW} height={2} fill={hair} />
            {/* Left bun */}
            <rect x={headX + 2}  y={headY - 8} width={8} height={8} fill={hair} />
            <rect x={headX + 3}  y={headY - 9} width={6} height={2} fill={hair} />
            {/* Right bun */}
            <rect x={headX + headW - 10} y={headY - 8} width={8} height={8} fill={hair} />
            <rect x={headX + headW - 9}  y={headY - 9} width={6} height={2} fill={hair} />
            {/* Bun depth/shadow */}
            <rect x={headX + 8}  y={headY - 4} width={2} height={4} fill={hairDark} opacity="0.25" />
            <rect x={headX + headW - 10} y={headY - 4} width={2} height={4} fill={hairDark} opacity="0.25" />
          </>
        ) : isDreadlocks ? (
          /* Dreadlocks — thick hanging locks */
          <>
            {/* Hair cap */}
            <rect x={headX + 2} y={headY - 2} width={headW - 4} height={5} fill={hair} />
            <rect x={headX} y={headY + 2} width={headW} height={2} fill={hair} />
            {/* Hanging locks */}
            <rect x={headX - 3} y={headY + 4} width={5} height={24} fill={hair} />
            <rect x={headX + 5} y={headY + 4} width={4} height={26} fill={hair} />
            <rect x={headX + 13} y={headY + 4} width={4} height={24} fill={hair} />
            <rect x={headX + headW - 2} y={headY + 4} width={5} height={22} fill={hair} />
            {/* Lock texture rings */}
            <rect x={headX - 2} y={headY + 9}  width={3} height={1} fill={hairDark} opacity="0.4" />
            <rect x={headX + 6} y={headY + 11} width={2} height={1} fill={hairDark} opacity="0.4" />
            <rect x={headX + 14} y={headY + 10} width={2} height={1} fill={hairDark} opacity="0.4" />
            <rect x={headX + headW - 1} y={headY + 8} width={3} height={1} fill={hairDark} opacity="0.4" />
            <rect x={headX - 2} y={headY + 17} width={3} height={1} fill={hairDark} opacity="0.4" />
            <rect x={headX + 6} y={headY + 19} width={2} height={1} fill={hairDark} opacity="0.4" />
          </>
        ) : isCornrows ? (
          /* Cornrows — tight rows pulled back */
          <>
            <rect x={headX + 2} y={headY - 1} width={headW - 4} height={4} fill={hair} />
            <rect x={headX} y={headY + 2} width={headW} height={5} fill={hair} />
            {/* Row stripe texture */}
            <rect x={headX + 1} y={headY + 1} width={headW - 2} height={1} fill={hairDark} opacity="0.22" />
            <rect x={headX + 1} y={headY + 3} width={headW - 2} height={1} fill={hairDark} opacity="0.22" />
            <rect x={headX + 1} y={headY + 5} width={headW - 2} height={1} fill={hairDark} opacity="0.22" />
            <rect x={headX + 1} y={headY + 7} width={headW - 2} height={1} fill={hairDark} opacity="0.22" />
            {/* Tapered sides */}
            <rect x={headX - 1} y={headY + 4} width={2} height={8} fill={hair} opacity="0.5" />
            <rect x={headX + headW - 1} y={headY + 4} width={2} height={8} fill={hair} opacity="0.5" />
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

        {/* ═══ CROWN ═══ */}
        {traits.accessories.includes("Crown") && (
          <>
            {/* Crown base */}
            <rect x={headX + 2}  y={headY - 5}  width={headW - 4} height={4} fill="#EAA624" />
            <rect x={headX + 2}  y={headY - 5}  width={headW - 4} height={1} fill="#F2D091" />
            <rect x={headX + headW - 4} y={headY - 4} width={2} height={3} fill="#8B6010" />
            {/* Crown points */}
            <rect x={headX + 4}  y={headY - 9}  width={5} height={5} fill="#EAA624" />
            <rect x={headX + 4}  y={headY - 9}  width={2} height={2} fill="#F2D091" />
            <rect x={headX + 12} y={headY - 10} width={4} height={6} fill="#EAA624" />
            <rect x={headX + 12} y={headY - 10} width={2} height={2} fill="#F2D091" />
            <rect x={headX + 19} y={headY - 9}  width={5} height={5} fill="#EAA624" />
            <rect x={headX + 19} y={headY - 9}  width={2} height={2} fill="#F2D091" />
            {/* Gem stones */}
            <rect x={headX + 13} y={headY - 9}  width={2} height={2} fill="#E87777" />
            <rect x={headX + 5}  y={headY - 8}  width={2} height={2} fill="#7BBFFF" />
            <rect x={headX + 20} y={headY - 8}  width={2} height={2} fill="#8BC34A" />
          </>
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
            {/* Hem detail */}
            <rect x={bodyX - 3} y={bodyY + bodyH + 3} width={bodyW + 6} height={1} fill="#00000015" />
            {/* Body outline */}
            <rect x={bodyX - 3} y={bodyY} width={1} height={bodyH + 4} fill={outline} opacity="0.3" />
            <rect x={bodyX + bodyW + 2} y={bodyY} width={1} height={bodyH + 4} fill={outline} opacity="0.3" />
          </>
        ) : (
          <>
            {/* Base top shape */}
            <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} fill={topCol} />
            {/* Body shadow */}
            <rect x={bodyX + bodyW - 3} y={bodyY + 2} width={3} height={bodyH - 3} fill="#00000012" />
            {/* Body outline */}
            <rect x={bodyX - 1} y={bodyY} width={1} height={bodyH} fill={outline} opacity="0.3" />
            <rect x={bodyX + bodyW} y={bodyY} width={1} height={bodyH} fill={outline} opacity="0.3" />

            {/* Top-specific details */}
            {traits.top === "Hoodie" && (
              <>
                {/* Hood behind head */}
                <rect x={headX + 2} y={headY + 18} width={headW - 4} height={6} fill={topCol} />
                <rect x={headX + 4} y={headY + 16} width={headW - 8} height={3} fill={topCol} />
                {/* Front pocket */}
                <rect x={bodyX + 5} y={bodyY + 7} width={10} height={4} fill="#00000010" />
                <rect x={bodyX + 5} y={bodyY + 7} width={10} height={1} fill="#00000018" />
                {/* Drawstrings */}
                <rect x={bodyX + 8} y={bodyY} width={1} height={4} fill="#00000015" />
                <rect x={bodyX + 11} y={bodyY} width={1} height={4} fill="#00000015" />
              </>
            )}
            {traits.top === "Button shirt" && (
              <>
                {/* Collar flaps */}
                <rect x={26} y={bodyY} width={4} height={3} fill="white" opacity="0.4" />
                <rect x={34} y={bodyY} width={4} height={3} fill="white" opacity="0.4" />
                {/* Button line */}
                <rect x={bodyX + 9} y={bodyY + 1} width={2} height={1} fill="#00000025" />
                <rect x={bodyX + 9} y={bodyY + 4} width={2} height={1} fill="#00000025" />
                <rect x={bodyX + 9} y={bodyY + 7} width={2} height={1} fill="#00000025" />
                <rect x={bodyX + 9} y={bodyY + 10} width={2} height={1} fill="#00000025" />
              </>
            )}
            {traits.top === "Sweater" && (
              <>
                {/* Collar */}
                <rect x={27} y={bodyY} width={10} height={2} fill={topCol} />
                <rect x={27} y={bodyY} width={10} height={1} fill="#00000015" />
                {/* Horizontal knit texture lines */}
                <rect x={bodyX} y={bodyY + 3} width={bodyW} height={1} fill="#00000008" />
                <rect x={bodyX} y={bodyY + 6} width={bodyW} height={1} fill="#00000008" />
                <rect x={bodyX} y={bodyY + 9} width={bodyW} height={1} fill="#00000008" />
                {/* Bottom ribbing */}
                <rect x={bodyX} y={bodyY + bodyH - 2} width={bodyW} height={2} fill="#00000012" />
              </>
            )}
            {traits.top === "Tank top" && (
              <>
                {/* Narrower shoulders — show skin on outer edges */}
                <rect x={bodyX} y={bodyY} width={3} height={bodyH} fill={skin} />
                <rect x={bodyX + bodyW - 3} y={bodyY} width={3} height={bodyH} fill={skin} />
                {/* Neckline scoop */}
                <rect x={28} y={bodyY} width={8} height={2} fill={skin} />
              </>
            )}
            {traits.top === "Jacket" && (
              <>
                {/* Inner shirt showing */}
                <rect x={bodyX + 6} y={bodyY} width={8} height={bodyH} fill="#D0D0D0" />
                {/* Jacket edges / lapels */}
                <rect x={bodyX + 5} y={bodyY} width={1} height={bodyH} fill="#00000018" />
                <rect x={bodyX + 14} y={bodyY} width={1} height={bodyH} fill="#00000018" />
                {/* Collar */}
                <rect x={26} y={bodyY} width={3} height={2} fill={topCol} />
                <rect x={35} y={bodyY} width={3} height={2} fill={topCol} />
                {/* Zipper line */}
                <rect x={bodyX + 9} y={bodyY + 2} width={2} height={bodyH - 2} fill="#00000012" />
              </>
            )}
            {(traits.top === "T-shirt" || !traits.top) && (
              <>
                {/* Simple collar */}
                <rect x={28} y={bodyY} width={8} height={1} fill="white" opacity="0.5" />
              </>
            )}
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
        {/* Sleeves — length varies by top type */}
        {traits.top === "Tank top" ? (
          /* No sleeves */
          null
        ) : traits.top === "Hoodie" || traits.top === "Sweater" || traits.top === "Jacket" ? (
          /* Long sleeves — cover most of arm */
          <>
            <rect x={bodyX - 4} y={bodyY + 1} width={4} height={7} fill={topCol} />
            <rect x={bodyX + bodyW} y={bodyY + 1} width={4} height={7} fill={topCol} />
            {/* Cuff detail */}
            <rect x={bodyX - 4} y={bodyY + 7} width={4} height={1} fill="#00000015" />
            <rect x={bodyX + bodyW} y={bodyY + 7} width={4} height={1} fill="#00000015" />
          </>
        ) : (
          /* Short sleeves (T-shirt, Button shirt, default) */
          <>
            <rect x={bodyX - 4} y={bodyY + 1} width={4} height={3} fill={topCol} />
            <rect x={bodyX + bodyW} y={bodyY + 1} width={4} height={3} fill={topCol} />
          </>
        )}

        {/* ═══ BACKPACK STRAPS ═══ */}
        {traits.accessories.includes("Backpack") && (
          <>
            <rect x={bodyX + 2} y={bodyY + 1} width={1} height={bodyH - 2} fill="#E67E22" opacity="0.7" />
            <rect x={bodyX + bodyW - 3} y={bodyY + 1} width={1} height={bodyH - 2} fill="#E67E22" opacity="0.7" />
          </>
        )}

        {/* ═══ SWORD (right hand) ═══ */}
        {traits.accessories.includes("Sword") && (
          <>
            {/* Blade */}
            <rect x={bodyX + bodyW + 5} y={bodyY - 6} width={3} height={20} fill="#C8D0E0" />
            <rect x={bodyX + bodyW + 5} y={bodyY - 6} width={1} height={16} fill="white" opacity="0.55" />
            <rect x={bodyX + bodyW + 7} y={bodyY - 2} width={1} height={12} fill="#9090A8" opacity="0.5" />
            {/* Crossguard */}
            <rect x={bodyX + bodyW + 2} y={bodyY + 8}  width={9} height={2} fill="#EAA624" />
            <rect x={bodyX + bodyW + 2} y={bodyY + 8}  width={9} height={1} fill="#F2D091" />
            {/* Handle */}
            <rect x={bodyX + bodyW + 5} y={bodyY + 10} width={3} height={5} fill="#8B5E3C" />
            <rect x={bodyX + bodyW + 5} y={bodyY + 10} width={1} height={5} fill="#A07040" />
            {/* Pommel */}
            <rect x={bodyX + bodyW + 4} y={bodyY + 15} width={5} height={3} fill="#EAA624" />
            <rect x={bodyX + bodyW + 4} y={bodyY + 15} width={5} height={1} fill="#F2D091" />
          </>
        )}

        {/* ═══ SHIELD (left arm) ═══ */}
        {traits.accessories.includes("Shield") && (
          <>
            {/* Shield body */}
            <rect x={bodyX - 12} y={bodyY + 2}  width={9} height={11} fill="#4A90D9" />
            <rect x={bodyX - 12} y={bodyY + 2}  width={9} height={1}  fill="#7BBFFF" />
            <rect x={bodyX - 12} y={bodyY + 2}  width={1} height={11} fill="#7BBFFF" />
            <rect x={bodyX - 4}  y={bodyY + 3}  width={1} height={10} fill="#2255AA" />
            <rect x={bodyX - 12} y={bodyY + 12} width={9} height={1}  fill="#2255AA" />
            {/* Cross emblem */}
            <rect x={bodyX - 9}  y={bodyY + 4}  width={3} height={7}  fill="#EAA624" />
            <rect x={bodyX - 11} y={bodyY + 7}  width={7} height={3}  fill="#EAA624" />
            <rect x={bodyX - 9}  y={bodyY + 4}  width={1} height={1}  fill="#F2D091" />
          </>
        )}

        {/* ═══ WAND (right hand) ═══ */}
        {traits.accessories.includes("Wand") && (
          <>
            {/* Wand stick */}
            <rect x={bodyX + bodyW + 4} y={bodyY + 2} width={2} height={12} fill="#3B2314" />
            <rect x={bodyX + bodyW + 4} y={bodyY + 2} width={1} height={12} fill="#6B4A30" />
            {/* Star tip */}
            <rect x={bodyX + bodyW + 3} y={bodyY + 1}  width={4} height={1} fill="#EAA624" />
            <rect x={bodyX + bodyW + 4} y={bodyY - 2}  width={2} height={4} fill="#EAA624" />
            <rect x={bodyX + bodyW + 3} y={bodyY}       width={4} height={2} fill="#F2D091" />
            <rect x={bodyX + bodyW + 4} y={bodyY - 1}  width={2} height={1} fill="white" opacity="0.7" />
            {/* Sparkles */}
            <rect x={bodyX + bodyW + 8} y={bodyY - 3}  width={1} height={1} fill="#EAA624" />
            <rect x={bodyX + bodyW + 2} y={bodyY - 4}  width={1} height={1} fill="#F2D091" />
            <rect x={bodyX + bodyW + 9} y={bodyY + 1}  width={1} height={1} fill="#8BC34A" />
          </>
        )}

        {/* ═══ DRAGON PET (small, bottom-left) ═══ */}
        {traits.accessories.includes("Dragon") && (
          <>
            {/* Wing */}
            <rect x={0} y={bodyY + 1}  width={9} height={8}  fill="#1a9a50" opacity="0.85" />
            <rect x={0} y={bodyY + 1}  width={9} height={1}  fill="#2ECC71" />
            <rect x={0} y={bodyY + 1}  width={1} height={8}  fill="#2ECC71" opacity="0.5" />
            {/* Body */}
            <rect x={0} y={bodyY + 8}  width={13} height={7} fill="#27AE60" />
            <rect x={0} y={bodyY + 8}  width={13} height={1} fill="#2ECC71" />
            <rect x={11} y={bodyY + 9} width={2}  height={5} fill="#1a9a50" />
            {/* Head */}
            <rect x={3} y={bodyY + 3}  width={10} height={6} fill="#2ECC71" />
            <rect x={2} y={bodyY + 4}  width={12} height={4} fill="#2ECC71" />
            {/* Eye */}
            <rect x={9} y={bodyY + 5}  width={2} height={2}  fill="#F4D03F" />
            <rect x={10} y={bodyY + 5} width={1} height={1}  fill="white" />
            {/* Snout */}
            <rect x={12} y={bodyY + 6} width={3} height={2}  fill="#27AE60" />
            {/* Flame */}
            <rect x={14} y={bodyY + 5} width={2} height={2}  fill="#E67E22" />
            <rect x={15} y={bodyY + 4} width={1} height={2}  fill="#F4D03F" />
            {/* Tail */}
            <rect x={11} y={bodyY + 13} width={5} height={2} fill="#27AE60" />
            <rect x={15} y={bodyY + 14} width={3} height={2} fill="#1a9a50" />
          </>
        )}

        {/* ═══ LEGS / BOTTOM ═══ */}
        {traits.top === "Dress" ? (
          /* Dress — legs peek out below */
          <>
            <rect x={bodyX + 4} y={bodyY + bodyH + 4} width={4} height={7} fill={skin} />
            <rect x={bodyX + bodyW - 8} y={bodyY + bodyH + 4} width={4} height={7} fill={skin} />
          </>
        ) : traits.bottom === "Skirt" ? (
          <>
            {/* Skirt — flared */}
            <rect x={bodyX - 1} y={bodyY + bodyH} width={bodyW + 2} height={3} fill={bottomCol} />
            <rect x={bodyX - 2} y={bodyY + bodyH + 3} width={bodyW + 4} height={2} fill={bottomCol} />
            {/* Hem */}
            <rect x={bodyX - 2} y={bodyY + bodyH + 4} width={bodyW + 4} height={1} fill="#00000012" />
            {/* Legs */}
            <rect x={bodyX + 4} y={bodyY + bodyH + 5} width={4} height={6} fill={skin} />
            <rect x={bodyX + bodyW - 8} y={bodyY + bodyH + 5} width={4} height={6} fill={skin} />
          </>
        ) : traits.bottom === "Shorts" ? (
          <>
            {/* Short pants */}
            <rect x={bodyX + 3} y={bodyY + bodyH} width={5} height={4} fill={bottomCol} />
            <rect x={bodyX + bodyW - 8} y={bodyY + bodyH} width={5} height={4} fill={bottomCol} />
            {/* Hem */}
            <rect x={bodyX + 3} y={bodyY + bodyH + 3} width={5} height={1} fill="#00000015" />
            <rect x={bodyX + bodyW - 8} y={bodyY + bodyH + 3} width={5} height={1} fill="#00000015" />
            {/* Exposed legs */}
            <rect x={bodyX + 3} y={bodyY + bodyH + 4} width={5} height={4} fill={skin} />
            <rect x={bodyX + bodyW - 8} y={bodyY + bodyH + 4} width={5} height={4} fill={skin} />
          </>
        ) : traits.bottom === "Overalls" ? (
          <>
            {/* Overall pants */}
            <rect x={bodyX + 3} y={bodyY + bodyH} width={5} height={8} fill={bottomCol} />
            <rect x={bodyX + bodyW - 8} y={bodyY + bodyH} width={5} height={8} fill={bottomCol} />
            {/* Bib over top */}
            <rect x={bodyX + 4} y={bodyY + 2} width={12} height={bodyH - 2} fill={bottomCol} />
            {/* Straps */}
            <rect x={bodyX + 5} y={bodyY} width={2} height={bodyH} fill={bottomCol} />
            <rect x={bodyX + 13} y={bodyY} width={2} height={bodyH} fill={bottomCol} />
            {/* Pocket on bib */}
            <rect x={bodyX + 7} y={bodyY + 5} width={6} height={4} fill="#00000010" />
            <rect x={bodyX + 7} y={bodyY + 5} width={6} height={1} fill="#00000018" />
            {/* Buttons at strap tops */}
            <rect x={bodyX + 5} y={bodyY + 1} width={2} height={1} fill="#D4A017" />
            <rect x={bodyX + 13} y={bodyY + 1} width={2} height={1} fill="#D4A017" />
          </>
        ) : traits.bottom === "Sweatpants" ? (
          <>
            {/* Loose sweatpants */}
            <rect x={bodyX + 2} y={bodyY + bodyH} width={6} height={8} fill={bottomCol} />
            <rect x={bodyX + bodyW - 8} y={bodyY + bodyH} width={6} height={8} fill={bottomCol} />
            {/* Elastic cuffs */}
            <rect x={bodyX + 2} y={bodyY + bodyH + 7} width={6} height={1} fill="#00000015" />
            <rect x={bodyX + bodyW - 8} y={bodyY + bodyH + 7} width={6} height={1} fill="#00000015" />
            {/* Waistband */}
            <rect x={bodyX} y={bodyY + bodyH} width={bodyW} height={1} fill="#00000015" />
          </>
        ) : traits.bottom === "Leggings" ? (
          <>
            {/* Tight leggings */}
            <rect x={bodyX + 4} y={bodyY + bodyH} width={4} height={8} fill={bottomCol} />
            <rect x={bodyX + bodyW - 8} y={bodyY + bodyH} width={4} height={8} fill={bottomCol} />
          </>
        ) : (
          <>
            {/* Jeans (default) */}
            <rect x={bodyX + 3} y={bodyY + bodyH} width={5} height={8} fill={bottomCol} />
            <rect x={bodyX + bodyW - 8} y={bodyY + bodyH} width={5} height={8} fill={bottomCol} />
            {/* Center seam */}
            <rect x={bodyX + 5} y={bodyY + bodyH} width={1} height={8} fill="#00000008" />
            <rect x={bodyX + bodyW - 6} y={bodyY + bodyH} width={1} height={8} fill="#00000008" />
          </>
        )}

        {/* ═══ SHOES ═══ */}
        {(() => {
          // Foot Y position depends on bottom type
          const legExposed = traits.top === "Dress" || traits.bottom === "Skirt";
          const footY = legExposed ? bodyY + bodyH + 11 : bodyY + bodyH + 8;
          const footLX = legExposed ? bodyX + 3 : bodyX + 2;
          const footRX = legExposed ? bodyX + bodyW - 9 : bodyX + bodyW - 8;

          if (traits.shoes === "Barefoot" || !traits.shoes) {
            return (
              <>
                <rect x={footLX + 1} y={footY} width={4} height={2} fill={skin} />
                <rect x={footRX + 1} y={footY} width={4} height={2} fill={skin} />
              </>
            );
          }
          if (traits.shoes === "Boots") {
            // Taller boots — extend up over lower leg
            return (
              <>
                <rect x={footLX} y={footY - 3} width={6} height={6} fill={shoeCol} />
                <rect x={footRX} y={footY - 3} width={6} height={6} fill={shoeCol} />
                {/* Boot top edge */}
                <rect x={footLX} y={footY - 3} width={6} height={1} fill="#00000018" />
                <rect x={footRX} y={footY - 3} width={6} height={1} fill="#00000018" />
                {/* Sole */}
                <rect x={footLX} y={footY + 2} width={6} height={1} fill="#2C1A0E" />
                <rect x={footRX} y={footY + 2} width={6} height={1} fill="#2C1A0E" />
              </>
            );
          }
          if (traits.shoes === "Rain boots") {
            // Tall bright yellow boots
            return (
              <>
                <rect x={footLX} y={footY - 4} width={6} height={7} fill={shoeCol} />
                <rect x={footRX} y={footY - 4} width={6} height={7} fill={shoeCol} />
                {/* Boot top band */}
                <rect x={footLX} y={footY - 4} width={6} height={1} fill="#00000015" />
                <rect x={footRX} y={footY - 4} width={6} height={1} fill="#00000015" />
                {/* Sole */}
                <rect x={footLX} y={footY + 2} width={6} height={1} fill="#8B7500" />
                <rect x={footRX} y={footY + 2} width={6} height={1} fill="#8B7500" />
              </>
            );
          }
          if (traits.shoes === "Sandals") {
            // Minimal sandals — show skin with straps
            return (
              <>
                <rect x={footLX + 1} y={footY} width={4} height={3} fill={skin} />
                <rect x={footRX + 1} y={footY} width={4} height={3} fill={skin} />
                {/* Straps */}
                <rect x={footLX} y={footY} width={6} height={1} fill={shoeCol} />
                <rect x={footRX} y={footY} width={6} height={1} fill={shoeCol} />
                <rect x={footLX} y={footY + 2} width={6} height={1} fill={shoeCol} />
                <rect x={footRX} y={footY + 2} width={6} height={1} fill={shoeCol} />
              </>
            );
          }
          // Sneakers (default)
          return (
            <>
              <rect x={footLX} y={footY} width={6} height={3} fill={shoeCol} />
              <rect x={footRX} y={footY} width={6} height={3} fill={shoeCol} />
              {/* Accent stripe */}
              <rect x={footLX} y={footY + 1} width={6} height={1} fill="#E74C3C" opacity="0.6" />
              <rect x={footRX} y={footY + 1} width={6} height={1} fill="#E74C3C" opacity="0.6" />
              {/* Sole */}
              <rect x={footLX} y={footY + 2} width={6} height={1} fill="#CCCCCC" />
              <rect x={footRX} y={footY + 2} width={6} height={1} fill="#CCCCCC" />
            </>
          );
        })()}
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

export default function StoryForm({ onSubmit, loading, prefillTopic = "", language, onLanguageChange }: StoryFormProps) {
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

  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [showDesigner, setShowDesigner] = useState(false);
  const [traits, setTraits] = useState<CharacterTraits>({ ...INITIAL_TRAITS });

  // Shop unlocked items — loaded after mount, refreshed on purchase
  const [ownedShopItems, setOwnedShopItems] = useState<ShopItem[]>([]);
  // Track the most recently purchased item for highlight animation
  const [newlyPurchased, setNewlyPurchased] = useState<string | null>(null);
  useEffect(() => {
    setOwnedShopItems(getOwnedItems());
    const refresh = (e: Event) => {
      setOwnedShopItems(getOwnedItems());
      // Auto-open designer and auto-equip the purchased item
      const detail = (e as CustomEvent).detail;
      if (detail?.id) {
        const item = SHOP_ITEMS.find((i) => i.id === detail.id);
        if (item) {
          setShowDesigner(true);
          setNewlyPurchased(item.value);
          setTimeout(() => setNewlyPurchased(null), 3000);
          // Auto-equip the purchased item
          if (item.category === "hair_color") {
            setTraits((prev) => ({ ...prev, hairColor: item.value }));
          } else if (item.category === "hair_style") {
            setTraits((prev) => ({ ...prev, hairStyle: item.value }));
          } else if (item.category === "accessory") {
            setTraits((prev) => ({
              ...prev,
              accessories: prev.accessories.includes(item.value)
                ? prev.accessories
                : [...prev.accessories, item.value],
            }));
          }
        }
      }
    };
    window.addEventListener("datafables:shop_purchase", refresh);
    return () => window.removeEventListener("datafables:shop_purchase", refresh);
  }, []);

  // Merge base lists with shop-unlocked items
  const allHairColors = [
    ...HAIR_COLORS,
    ...ownedShopItems
      .filter((i) => i.category === "hair_color")
      .map((i) => ({ label: i.value, color: i.color ?? "#FF69B4" })),
  ];
  const allHairStyles = [
    ...HAIR_STYLES,
    ...ownedShopItems
      .filter((i) => i.category === "hair_style")
      .map((i) => i.value),
  ];
  const allAccessories = [
    ...ACCESSORIES,
    ...ownedShopItems
      .filter((i) => i.category === "accessory")
      .map((i) => i.value),
  ];

  // Sets of shop-unlocked values for visual indicators
  const shopHairColorLabels = new Set(
    ownedShopItems.filter((i) => i.category === "hair_color").map((i) => i.value)
  );
  const shopHairStyleValues = new Set(
    ownedShopItems.filter((i) => i.category === "hair_style").map((i) => i.value)
  );
  const shopAccessoryValues = new Set(
    ownedShopItems.filter((i) => i.category === "accessory").map((i) => i.value)
  );

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
          onClick={() => {
            if (!showDesigner) unlockAchievement("character_designer");
            setShowDesigner((s) => !s);
          }}
          className="flex items-center gap-2 font-pixel disabled:opacity-60 transition"
          style={{ fontSize: "1rem", fontWeight: 700, color: "var(--pixel-dark)", letterSpacing: "0.02em" }}
        >
          <span className={`transition-transform duration-200 ${showDesigner ? "rotate-90" : ""}`}>
            &#9654;
          </span>
          <span>{t.designYourCharacter}</span>
          <span className="font-pixel" style={{ fontSize: "0.7rem", fontWeight: 400, color: "var(--pixel-mid)", marginLeft: "4px" }}>{t.optional}</span>
        </button>

        {showDesigner && (
          <div
            className="pixel-card p-5 flex flex-col gap-5"
          >
            {/* Character Preview */}
            <div className="flex flex-col items-center gap-1">
              <CharacterPreview traits={traits} hairColorOptions={allHairColors} />
              <span className="font-pixel" style={{ fontSize: "0.65rem", color: "var(--pixel-mid)", letterSpacing: "0.1em" }}>{t.preview}</span>
            </div>
            <div style={{ height: "2px", background: "var(--pixel-mid)", opacity: 0.3 }} />

            {/* Gender */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>{t.gender}</span>
              <div className="flex gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g.label}
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      if (traits.gender === g.label) {
                        updateTrait("gender", null);
                      } else {
                        setTraits((prev) => ({ ...prev, gender: g.label, ...GENDER_PRESETS[g.label] }));
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-60"
                    style={{
                      background: traits.gender === g.label ? "var(--pixel-card-alt)" : "var(--pixel-card)",
                      border: `3px solid ${traits.gender === g.label ? "var(--pixel-dark)" : "var(--pixel-mid)"}`,
                      borderRadius: "10px",
                      boxShadow: traits.gender === g.label ? "3px 3px 0 var(--pixel-dark)" : "2px 2px 0 var(--pixel-mid)",
                      color: "var(--pixel-dark)",
                    }}
                  >
                    <span className="font-pixel" style={{ fontSize: "0.8rem" }}>{g.label === "Boy" ? t.boy : t.girl}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Skin Tone */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>{t.skinTone}</span>
              <ColorSwatch
                options={SKIN_TONES}
                selected={traits.skinTone}
                onSelect={(v) => updateTrait("skinTone", v)}
                disabled={loading}
              />
            </div>

            {/* Hair Color */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>{t.hairColor}</span>
              <ColorSwatch
                options={allHairColors}
                selected={traits.hairColor}
                onSelect={(v) => updateTrait("hairColor", v)}
                disabled={loading}
                shopLabels={shopHairColorLabels}
                newlyPurchased={newlyPurchased}
              />
            </div>

            {/* Hair Style */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>{t.hairStyle}</span>
              <StyledSelect
                value={traits.hairStyle}
                options={allHairStyles}
                onChange={(v) => updateTrait("hairStyle", v)}
                placeholder={t.pickHairStyle}
                disabled={loading}
                shopValues={shopHairStyleValues}
              />
            </div>

            {/* Eye Color */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>{t.eyeColor}</span>
              <ColorSwatch
                options={EYE_COLORS}
                selected={traits.eyeColor}
                onSelect={(v) => updateTrait("eyeColor", v)}
                disabled={loading}
              />
            </div>

            {/* Clothing Top + Color */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>{t.clothingTop}</span>
              <StyledSelect
                value={traits.top}
                options={TOPS}
                onChange={(v) => updateTrait("top", v)}
                placeholder={t.pickTop}
                disabled={loading}
              />
              {traits.top && (
                <div className="flex flex-col gap-1">
                  <span className="font-pixel" style={{ fontSize: "0.7rem", color: "var(--pixel-mid)" }}>{t.topColor}</span>
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
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>{t.clothingBottom}</span>
              <StyledSelect
                value={traits.bottom}
                options={BOTTOMS}
                onChange={(v) => updateTrait("bottom", v)}
                placeholder={t.pickBottom}
                disabled={loading}
              />
            </div>

            {/* Shoes */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>{t.shoes}</span>
              <StyledSelect
                value={traits.shoes}
                options={SHOES}
                onChange={(v) => updateTrait("shoes", v)}
                placeholder={t.pickShoes}
                disabled={loading}
              />
            </div>

            {/* Accessories (multi-select toggle buttons) */}
            <div className="flex flex-col gap-2">
              <span className="font-pixel" style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--pixel-dark)" }}>{t.accessories}</span>
              <div className="flex flex-wrap gap-2">
                {allAccessories.map((acc) => {
                  const isShop = shopAccessoryValues.has(acc);
                  const isActive = traits.accessories.includes(acc);
                  const isNew = newlyPurchased === acc;
                  return (
                    <button
                      key={acc}
                      type="button"
                      disabled={loading}
                      onClick={() => toggleAccessory(acc)}
                      className={`relative px-3 py-1.5 text-xs font-semibold transition active:scale-95 disabled:opacity-60${isNew ? " animate-pixel-glow" : ""}`}
                      style={{
                        background: isActive
                          ? isShop ? "linear-gradient(135deg, #1a6a3a 0%, #2ECC71 100%)" : "var(--pixel-card-alt)"
                          : isShop ? "rgba(46,204,113,0.08)" : "var(--pixel-card)",
                        border: isActive
                          ? `3px solid ${isShop ? "#2ECC71" : "var(--pixel-dark)"}`
                          : `2px solid ${isShop ? "#2ECC71" : "var(--pixel-mid)"}`,
                        borderRadius: "8px",
                        boxShadow: isActive
                          ? `2px 2px 0 ${isShop ? "#1a6a3a" : "var(--pixel-dark)"}`
                          : `1px 1px 0 ${isShop ? "#1a6a3a" : "var(--pixel-mid)"}`,
                        color: isActive && isShop ? "#fff" : "var(--pixel-dark)",
                      }}
                    >
                      {isShop && (
                        <span
                          className="font-pixel"
                          style={{
                            position: "absolute",
                            top: "-6px",
                            right: "-6px",
                            fontSize: "0.5rem",
                            lineHeight: 1,
                            background: "#2ECC71",
                            color: "#1a1428",
                            padding: "1px 3px",
                            border: "1.5px solid #1a6a3a",
                            pointerEvents: "none",
                          }}
                        >
                          ★
                        </span>
                      )}
                      {EMOJI[acc] ? `${EMOJI[acc]} ` : ""}{acc}
                    </button>
                  );
                })}
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
              {t.resetCharacter}
            </button>
          </div>
        )}
      </div>

      {/* Language selector */}
      <div className="flex flex-col gap-4">
        <h3
          className="font-pixel text-center"
          style={{ fontSize: "1.3rem", color: "var(--pixel-dark)", fontWeight: 700, letterSpacing: "0.1em" }}
        >
          ✦ {t.languageLabel} ✦
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LANGUAGES.map((lang, i) => (
            <button
              key={lang.value}
              type="button"
              disabled={loading}
              onClick={() => onLanguageChange(lang.value)}
              className={`flex items-center gap-3 px-6 py-5 font-semibold disabled:opacity-60 transition-transform active:scale-95${i === LANGUAGES.length - 1 && LANGUAGES.length % 3 === 1 ? " sm:col-start-2" : ""}`}
              style={{
                background: language === lang.value ? "var(--pixel-card-alt)" : "#EAE0DF",
                border: "3px solid var(--pixel-dark)",
                borderRadius: "12px",
                boxShadow: language === lang.value
                  ? "3px 3px 0 var(--pixel-dark)"
                  : "2px 2px 0 var(--pixel-dark)",
                color: "var(--pixel-dark)",
              }}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-pixel" style={{ fontSize: "0.75rem" }}>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Age group selector */}
      <div className="flex flex-col gap-3">
        <h3
          className="font-pixel text-center"
          style={{ fontSize: "1.3rem", color: "var(--pixel-dark)", fontWeight: 700, letterSpacing: "0.1em" }}
        >
          ✦ {t.readingLevel} ✦
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {AGE_GROUPS.map((group) => (
            <label key={group.id} className="cursor-pointer group">
              <input
                type="radio"
                name="ageGroup"
                value={group.id}
                checked={selectedAge === group.id}
                onChange={() => setSelectedAge(group.id)}
                disabled={loading}
                className="sr-only peer"
              />
              <div
                className="flex flex-col items-center gap-1 py-6 px-3 text-center transition active:scale-95"
                style={{
                  background: selectedAge === group.id ? "var(--pixel-card-alt)" : "#EAE0DF",
                  border: "3px solid var(--pixel-dark)",
                  borderRadius: "12px",
                  boxShadow: selectedAge === group.id
                    ? "3px 3px 0 var(--pixel-dark)"
                    : "2px 2px 0 var(--pixel-dark)",
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
