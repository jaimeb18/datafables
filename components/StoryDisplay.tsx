"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import AudioPlayer from "./AudioPlayer";

interface VocabWord {
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  definition: string;
  example?: string;
}

interface BookPage {
  text: string;
  vocabulary: VocabWord[];
  imageDataUrl: string | null;
}

interface StoryDisplayProps {
  title: string;
  pages: BookPage[];
  facts: string[];
  onReset: () => void;
}

// Google-style dictionary popup modal
function DictionaryModal({
  vocab,
  onClose,
}: {
  vocab: VocabWord;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-normal text-gray-900 break-words">
                {vocab.word}
              </h2>
              {vocab.phonetic && (
                <p className="text-base text-[#1a73e8] mt-1 font-normal">
                  {vocab.phonetic}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition text-lg mt-0.5"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mx-6" />

        {/* Body */}
        <div className="px-6 py-4 flex flex-col gap-3">
          {/* Part of speech */}
          {vocab.partOfSpeech && (
            <p className="text-sm text-gray-500 italic">{vocab.partOfSpeech}</p>
          )}

          {/* Definition */}
          <div className="flex gap-3">
            <span className="text-[#1a73e8] font-medium text-sm mt-0.5 flex-shrink-0">1</span>
            <p className="text-gray-800 text-base leading-snug">{vocab.definition}</p>
          </div>

          {/* Example sentence */}
          {vocab.example && (
            <p className="text-gray-500 text-sm italic ml-6 leading-snug">
              &ldquo;{vocab.example}&rdquo;
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#1a73e8] text-white text-sm font-medium hover:bg-[#1557b0] transition active:scale-95"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

function PageText({
  text,
  vocabulary,
  onWordClick,
}: {
  text: string;
  vocabulary: VocabWord[];
  onWordClick: (vocab: VocabWord) => void;
}) {
  if (!vocabulary || vocabulary.length === 0) {
    return (
      <p className="text-xl sm:text-2xl leading-relaxed text-stone-800 font-medium text-center">
        {text}
      </p>
    );
  }

  const escaped = vocabulary.map((v) =>
    v.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <p className="text-xl sm:text-2xl leading-relaxed text-stone-800 font-medium text-center">
      {parts.map((part, i) => {
        const vocabEntry = vocabulary.find(
          (v) => v.word.toLowerCase() === part.toLowerCase()
        );
        if (vocabEntry) {
          return (
            <span
              key={i}
              className="underline decoration-[#1a73e8] decoration-[2.5px] underline-offset-2 cursor-pointer font-bold text-[#1a73e8] hover:text-[#1557b0] transition-colors"
              onClick={() => onWordClick(vocabEntry)}
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

export default function StoryDisplay({
  title,
  pages,
  facts,
  onReset,
}: StoryDisplayProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showAudio, setShowAudio] = useState(false);
  const [activeVocab, setActiveVocab] = useState<VocabWord | null>(null);

  const page = pages[currentPage];
  const isFirst = currentPage === 0;
  const isLast = currentPage === pages.length - 1;

  useEffect(() => {
    setShowAudio(false);
    setActiveVocab(null);
  }, [currentPage]);

  const goNext = () => { if (!isLast) setCurrentPage((p) => p + 1); };
  const goPrev = () => { if (!isFirst) setCurrentPage((p) => p - 1); };

  return (
    <div className="w-full max-w-2xl flex flex-col gap-5">
      {/* Dictionary modal */}
      {activeVocab && (
        <DictionaryModal vocab={activeVocab} onClose={() => setActiveVocab(null)} />
      )}

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-amber-900 text-center leading-tight px-4 mt-2">
        {title}
      </h1>

      {/* Page dots */}
      <div className="flex items-center justify-center gap-2 flex-wrap px-4">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`rounded-full transition-all duration-200 ${
              i === currentPage
                ? "w-4 h-4 bg-amber-500 scale-110"
                : "w-2.5 h-2.5 bg-amber-200 hover:bg-amber-300"
            }`}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>

      {/* Book card — image left, text right */}
      <div className="rounded-3xl bg-white shadow-xl overflow-hidden border border-amber-100 flex flex-col sm:flex-row">
        {/* Illustration */}
        {page.imageDataUrl ? (
          <div className="relative w-full sm:w-2/5 h-64 sm:h-auto sm:min-h-[320px] bg-amber-50 flex-shrink-0">
            <Image
              src={page.imageDataUrl}
              alt={`Page ${currentPage + 1} illustration`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-full sm:w-2/5 sm:min-h-[320px] h-44 bg-gradient-to-br from-amber-50 to-sky-50 flex items-center justify-center flex-shrink-0">
            <span className="text-6xl opacity-30 animate-pulse">🎨</span>
          </div>
        )}

        {/* Page content */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center gap-5">
          <p className="text-xs font-bold text-amber-400 text-center tracking-widest uppercase">
            Page {currentPage + 1} of {pages.length}
          </p>

          <PageText
            key={currentPage}
            text={page.text}
            vocabulary={page.vocabulary ?? []}
            onWordClick={setActiveVocab}
          />

          {page.vocabulary && page.vocabulary.length > 0 && (
            <p className="text-xs text-[#1a73e8] text-center opacity-70">
              Tap the{" "}
              <span className="underline font-semibold">blue words</span>{" "}
              to look them up!
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 px-1">
        <button
          onClick={goPrev}
          disabled={isFirst}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-amber-200 bg-white font-bold text-amber-700 shadow-sm transition hover:bg-amber-50 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        <button
          onClick={() => setShowAudio((s) => !s)}
          className={`px-4 py-3 rounded-2xl border-2 font-bold text-sm transition active:scale-95 ${
            showAudio
              ? "border-sky-400 bg-sky-50 text-sky-700"
              : "border-sky-200 bg-white text-sky-500 hover:bg-sky-50"
          }`}
        >
          🎧 {showAudio ? "Hide" : "Listen"}
        </button>

        <button
          onClick={goNext}
          disabled={isLast}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-amber-200 bg-white font-bold text-amber-700 shadow-sm transition hover:bg-amber-50 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {showAudio && <AudioPlayer key={currentPage} storyText={page.text} />}

      {/* Did You Know? — last page */}
      {isLast && facts.length > 0 && (
        <div className="rounded-3xl bg-sky-50 border border-sky-200 p-6 flex flex-col gap-4">
          <h2 className="text-lg font-extrabold text-sky-800">💡 Did You Know?</h2>
          <ul className="flex flex-col gap-3">
            {facts.map((fact, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-sky-200 text-sky-700 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-gray-700 text-sm leading-relaxed">{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLast && (
        <button
          onClick={onReset}
          className="w-full rounded-2xl border-2 border-amber-300 bg-white py-4 text-base font-bold text-amber-700 shadow-sm transition hover:bg-amber-50 active:scale-95"
        >
          📖 Create Another Story
        </button>
      )}
    </div>
  );
}
