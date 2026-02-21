"use client";

import { useState } from "react";

interface StoryFormProps {
  onSubmit: (topic: string, ageGroup: string, language: string) => void;
  loading: boolean;
}

const AGE_GROUPS = [
  { id: "5-7", label: "Little Reader", emoji: "🌱", desc: "Ages 5–7" },
  { id: "8-10", label: "Explorer", emoji: "🔭", desc: "Ages 8–10" },
  { id: "11-13", label: "Adventurer", emoji: "⚡", desc: "Ages 11–13" },
];

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

export default function StoryForm({ onSubmit, loading }: StoryFormProps) {
  const [language, setLanguage] = useState("English");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const topic = data.get("topic") as string;
        const ageGroup = data.get("ageGroup") as string;
        if (topic.trim() && ageGroup) onSubmit(topic.trim(), ageGroup, language);
      }}
      className="flex flex-col gap-8 w-full max-w-xl"
    >
      {/* Topic input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="topic" className="text-lg font-bold text-amber-800">
          What should your story be about?
        </label>
        <input
          id="topic"
          name="topic"
          type="text"
          required
          placeholder="e.g. dolphins, ancient Egypt, volcanoes..."
          disabled={loading}
          className="w-full rounded-2xl border-2 border-amber-200 bg-white px-5 py-4 text-base text-gray-800 placeholder-gray-400 shadow-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200 disabled:opacity-60 transition"
        />
      </div>

      {/* Language selector */}
      <div className="flex flex-col gap-3">
        <span className="text-lg font-bold text-amber-800">🌍 Story Language</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              type="button"
              disabled={loading}
              onClick={() => setLanguage(lang.value)}
              className={`flex items-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-sm font-semibold transition active:scale-95 disabled:opacity-60 ${
                language === lang.value
                  ? "border-amber-500 bg-amber-50 text-amber-900 shadow-md"
                  : "border-amber-200 bg-white text-gray-700 hover:border-amber-300"
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Age group selector */}
      <div className="flex flex-col gap-3">
        <span className="text-lg font-bold text-amber-800">Reading level</span>
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
              <div className="flex flex-col items-center gap-1 rounded-2xl border-2 border-amber-200 bg-white py-4 px-2 text-center shadow-sm transition peer-checked:border-amber-500 peer-checked:bg-amber-50 peer-checked:shadow-md group-hover:border-amber-300">
                <span className="text-3xl">{group.emoji}</span>
                <span className="font-bold text-gray-800 text-sm">{group.label}</span>
                <span className="text-xs text-gray-500">{group.desc}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-amber-400 py-4 text-lg font-bold text-amber-900 shadow-md transition hover:bg-amber-500 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-3">
            <span className="inline-block animate-bounce">📖</span>
            <span>Creating your story…</span>
          </span>
        ) : (
          "✨ Create My Story"
        )}
      </button>
    </form>
  );
}
