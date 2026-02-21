"use client";

import { useEffect, useState } from "react";
import { getTranslations } from "@/lib/translations";

interface StoryFormProps {
  onSubmit: (topic: string, ageGroup: string, language: string) => void;
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const ageGroup = data.get("ageGroup") as string;
        if (topic.trim() && ageGroup) onSubmit(topic.trim(), ageGroup, language);
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
