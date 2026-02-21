"use client";

import { useState, useEffect, useMemo } from "react";
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

interface BranchChoice {
  label: string;
  pages: BookPage[];
}

interface StoryDisplayProps {
  title: string;
  branchPointIndex: number;
  commonPages: BookPage[];
  branchPointPage: BookPage;
  choiceA: BranchChoice;
  choiceB: BranchChoice;
  facts: string[];
  onReset: () => void;
}

function DictionaryModal({ vocab, onClose }: { vocab: VocabWord; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl font-normal text-gray-900 break-words">{vocab.word}</h2>
              {vocab.phonetic && (
                <p className="text-base text-[#1a73e8] mt-1">{vocab.phonetic}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition text-lg mt-0.5"
            >&#x2715;</button>
          </div>
        </div>
        <div className="h-px bg-gray-200 mx-6" />
        <div className="px-6 py-4 flex flex-col gap-3">
          {vocab.partOfSpeech && (
            <p className="text-sm text-gray-500 italic">{vocab.partOfSpeech}</p>
          )}
          <div className="flex gap-3">
            <span className="text-[#1a73e8] font-medium text-sm mt-0.5 flex-shrink-0">1</span>
            <p className="text-gray-800 text-base leading-snug">{vocab.definition}</p>
          </div>
          {vocab.example && (
            <p className="text-gray-500 text-sm italic ml-6 leading-snug">&ldquo;{vocab.example}&rdquo;</p>
          )}
        </div>
        <div className="px-6 pb-5 pt-1">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#1a73e8] text-white text-sm font-medium hover:bg-[#1557b0] transition active:scale-95"
          >Got it!</button>
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
      <p className="text-lg sm:text-xl leading-relaxed text-stone-800" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
        {text}
      </p>
    );
  }

  const escaped = vocabulary.map((v) => v.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <p className="text-lg sm:text-xl leading-relaxed text-stone-800" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {parts.map((part, i) => {
        const vocabEntry = vocabulary.find((v) => v.word.toLowerCase() === part.toLowerCase());
        if (vocabEntry) {
          return (
            <span
              key={i}
              className="underline decoration-[#1a73e8] decoration-[2px] underline-offset-2 cursor-pointer font-bold text-[#1a73e8] hover:text-[#1557b0] transition-colors"
              onClick={() => onWordClick(vocabEntry)}
            >{part}</span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

function ChoiceScreen({
  choiceA,
  choiceB,
  onChoose,
}: {
  choiceA: BranchChoice;
  choiceB: BranchChoice;
  onChoose: (choice: "A" | "B") => void;
}) {
  const parchmentBg = {
    background: "linear-gradient(135deg, #ede5d0 0%, #f5edd8 50%, #faf3e4 100%)",
  };

  return (
    <div
      className="flex-1 min-w-0 rounded-sm overflow-hidden"
      style={{
        boxShadow: "0 30px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.15)",
      }}
    >
      <div className="flex flex-col items-center gap-6 p-8 sm:p-12" style={parchmentBg}>
        <h2
          className="text-2xl sm:text-3xl font-bold text-amber-900 text-center"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          What happens next? You decide!
        </h2>
        <p className="text-stone-500 text-sm text-center" style={{ fontFamily: "Georgia, serif" }}>
          Choose a path to continue the story
        </p>
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-3xl">
          {([
            { choice: "A" as const, data: choiceA },
            { choice: "B" as const, data: choiceB },
          ]).map(({ choice, data }) => (
            <button
              key={choice}
              onClick={() => onChoose(choice)}
              className="flex-1 rounded-xl border-2 border-amber-300 bg-white/80 hover:border-amber-500 hover:shadow-xl transition-all duration-200 p-5 flex flex-col items-center gap-4 group active:scale-[0.98]"
            >
              {data.pages[0]?.imageDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.pages[0].imageDataUrl}
                  alt={`Preview: ${data.label}`}
                  className="w-full h-48 sm:h-56 object-contain rounded-lg"
                />
              ) : (
                <div className="w-full h-48 sm:h-56 flex items-center justify-center bg-amber-50 rounded-lg">
                  <span className="text-5xl opacity-30">🎨</span>
                </div>
              )}
              <p
                className="text-base sm:text-lg font-medium text-amber-800 group-hover:text-amber-950 transition-colors leading-snug text-center"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {data.label}
              </p>
              <span className="text-xs text-amber-500 font-semibold uppercase tracking-wider">
                Choose this path
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StoryDisplay({
  title,
  branchPointIndex,
  commonPages,
  branchPointPage,
  choiceA,
  choiceB,
  facts,
  onReset,
}: StoryDisplayProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [chosenBranch, setChosenBranch] = useState<"none" | "A" | "B">("none");
  const [showChoiceScreen, setShowChoiceScreen] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [activeVocab, setActiveVocab] = useState<VocabWord | null>(null);

  // Always build the full 10-page array so all dots render.
  // Before a choice is made, use choiceA pages as placeholders for the dot count.
  const activePages = useMemo(() => {
    const base = [...commonPages, branchPointPage];
    const branchPages =
      chosenBranch === "B" ? choiceB.pages : choiceA.pages;
    return [...base, ...branchPages];
  }, [commonPages, branchPointPage, choiceA, choiceB, chosenBranch]);

  const page = activePages[currentPage];
  const isFirst = currentPage === 0;
  const isLast = currentPage === activePages.length - 1;
  const isBranchPoint = currentPage === branchPointIndex;
  const needsChoice = isBranchPoint && chosenBranch === "none";

  useEffect(() => {
    setShowAudio(false);
    setActiveVocab(null);
  }, [currentPage]);

  const goNext = () => {
    if (needsChoice) {
      setShowChoiceScreen(true);
      return;
    }
    if (!isLast) setCurrentPage((p) => p + 1);
  };

  const goPrev = () => {
    if (!isFirst) setCurrentPage((p) => p - 1);
  };

  const handleChoose = (choice: "A" | "B") => {
    setChosenBranch(choice);
    setShowChoiceScreen(false);
    setCurrentPage(branchPointIndex + 1);
  };

  const handleTryOtherPath = () => {
    setChosenBranch("none");
    setShowChoiceScreen(false);
    setCurrentPage(branchPointIndex);
  };

  // Determine if the next button should be disabled
  // Allow clicking next on branch point (it opens the choice screen).
  // Only disable if already showing the choice screen, or on the actual last page.
  const nextDisabled = showChoiceScreen || (isLast && !needsChoice);

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6">
      {activeVocab && <DictionaryModal vocab={activeVocab} onClose={() => setActiveVocab(null)} />}

      {/* Title */}
      <h1
        className="text-2xl sm:text-4xl font-bold text-amber-950 text-center leading-tight px-4 mt-2 tracking-wide"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {title}
      </h1>

      {/* Page dots */}
      <div className="flex items-center justify-center gap-2 flex-wrap px-4">
        {activePages.map((_, i) => {
          const isBranchDot = i === branchPointIndex;
          const isBeyondBranch = i > branchPointIndex && chosenBranch === "none";
          const isUnreachable = isBeyondBranch && !showChoiceScreen;
          return (
            <button
              key={i}
              onClick={() => {
                if (!isUnreachable) {
                  setShowChoiceScreen(false);
                  setCurrentPage(i);
                }
              }}
              disabled={isUnreachable}
              className={`rounded-full transition-all duration-200 ${
                i === currentPage && !showChoiceScreen
                  ? "w-4 h-4 bg-amber-700 scale-110"
                  : isBranchDot
                  ? "w-3.5 h-3.5 bg-amber-500 ring-2 ring-amber-300"
                  : "w-2.5 h-2.5 bg-amber-300 hover:bg-amber-400"
              } ${isUnreachable ? "opacity-30 cursor-not-allowed" : ""}`}
              aria-label={`Go to page ${i + 1}${isBranchDot ? " (choice point)" : ""}`}
            />
          );
        })}
      </div>

      {/* Book + side arrows */}
      <div className="flex items-center gap-2 sm:gap-5">

        {/* Left arrow */}
        <button
          onClick={() => {
            if (showChoiceScreen) {
              setShowChoiceScreen(false);
            } else {
              goPrev();
            }
          }}
          disabled={isFirst && !showChoiceScreen}
          className="flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-amber-900 text-amber-50 text-3xl font-light flex items-center justify-center shadow-xl transition hover:bg-amber-800 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed select-none"
        >&#x2039;</button>

        {/* Choice screen or book */}
        {showChoiceScreen ? (
          <ChoiceScreen
            choiceA={choiceA}
            choiceB={choiceB}
            onChoose={handleChoose}
          />
        ) : (
          /* Open book */
          <div
            className="flex-1 min-w-0 rounded-sm overflow-hidden"
            style={{
              boxShadow: "0 30px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.15)",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:h-[580px]">

              {/* Left page — illustration */}
              <div
                className="relative w-full sm:w-1/2 flex-shrink-0 min-h-[300px] sm:min-h-0 flex items-center justify-center"
                style={{
                  background: "linear-gradient(105deg, #ede5d0 0%, #f5edd8 50%, #ede0c4 100%)",
                  boxShadow: "inset -8px 0 20px rgba(0,0,0,0.15)",
                }}
              >
                {page.imageDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={page.imageDataUrl}
                    alt={`Page ${currentPage + 1} illustration`}
                    className="w-full h-full object-contain p-6"
                  />
                ) : (
                  <span className="text-7xl opacity-20 animate-pulse">🎨</span>
                )}
                {/* Left page number */}
                <span
                  className="absolute bottom-4 left-5 text-xs text-stone-400 italic select-none"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {currentPage * 2 + 1}
                </span>
              </div>

              {/* Spine */}
              <div
                className="hidden sm:block w-5 flex-shrink-0"
                style={{
                  background: "linear-gradient(to right, #3d2b1a 0%, #6b4c2a 30%, #8c6a3f 50%, #6b4c2a 70%, #3d2b1a 100%)",
                  boxShadow: "inset 0 0 8px rgba(0,0,0,0.4)",
                }}
              />

              {/* Right page — text */}
              <div
                className="relative flex-1 flex flex-col justify-center gap-5 p-8 sm:p-14"
                style={{
                  background: "linear-gradient(255deg, #ede5d0 0%, #f5edd8 50%, #faf3e4 100%)",
                  boxShadow: "inset 8px 0 20px rgba(0,0,0,0.07)",
                }}
              >
                {/* Listen button — top right of page */}
                <button
                  onClick={() => setShowAudio((s) => !s)}
                  className={`absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full border transition active:scale-95 ${
                    showAudio
                      ? "border-sky-400 bg-sky-50 text-sky-700"
                      : "border-stone-300 bg-white/60 text-stone-500 hover:bg-white"
                  }`}
                >
                  🎧 {showAudio ? "Hide" : "Listen"}
                </button>

                {/* Chapter rule */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-stone-300/70" />
                  <span
                    className="text-stone-400 text-[10px] tracking-[0.2em] uppercase select-none"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    Page {currentPage + 1} of {activePages.length}
                  </span>
                  <div className="h-px flex-1 bg-stone-300/70" />
                </div>

                {/* Story text */}
                <PageText
                  key={currentPage}
                  text={page.text}
                  vocabulary={page.vocabulary ?? []}
                  onWordClick={setActiveVocab}
                />

                {page.vocabulary && page.vocabulary.length > 0 && (
                  <p className="text-xs text-[#1a73e8] opacity-60" style={{ fontFamily: "Georgia, serif" }}>
                    Tap the <span className="underline font-semibold">blue words</span> to look them up.
                  </p>
                )}

                {/* Branch point hint */}
                {needsChoice && (
                  <p
                    className="text-sm text-amber-600 font-semibold text-center animate-pulse"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    A choice awaits... tap next to decide!
                  </p>
                )}

                {/* Right page number */}
                <span
                  className="absolute bottom-4 right-5 text-xs text-stone-400 italic select-none"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {currentPage * 2 + 2}
                </span>
              </div>

            </div>
          </div>
        )}

        {/* Right arrow */}
        <button
          onClick={goNext}
          disabled={nextDisabled}
          className="flex-shrink-0 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-amber-900 text-amber-50 text-3xl font-light flex items-center justify-center shadow-xl transition hover:bg-amber-800 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed select-none"
        >&#x203a;</button>
      </div>

      {/* Audio player */}
      {showAudio && !showChoiceScreen && <AudioPlayer key={currentPage} storyText={page.text} />}

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

      {/* End-of-story actions */}
      {isLast && (
        <div className="flex flex-col gap-3">
          <button
            onClick={handleTryOtherPath}
            className="w-full rounded-2xl border-2 border-purple-300 bg-white py-4 text-base font-bold text-purple-700 shadow-sm transition hover:bg-purple-50 active:scale-95"
          >
            🔀 Try the Other Path
          </button>
          <button
            onClick={onReset}
            className="w-full rounded-2xl border-2 border-amber-300 bg-white py-4 text-base font-bold text-amber-700 shadow-sm transition hover:bg-amber-50 active:scale-95"
          >
            📖 Create Another Story
          </button>
        </div>
      )}
    </div>
  );
}
