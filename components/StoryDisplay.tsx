"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import AudioPlayer from "./AudioPlayer";
import { getTranslations } from "@/lib/translations";
import { unlockAchievement, incrementCounter } from "@/lib/achievements";
import SimilarStories from "./SimilarStories";

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

interface SafetyResult {
  safe: boolean;
  score: number;
  flags: string[];
  provider: "safetykit" | "gemini_fallback";
  decisionId?: string;
}

interface StoryDisplayProps {
  title: string;
  branchPointIndex: number;
  commonPages: BookPage[];
  branchPointPage: BookPage;
  choiceA: BranchChoice;
  choiceB: BranchChoice;
  facts: string[];
  safety?: SafetyResult;
  storyId?: string;
  language: string;
  onReset: () => void;
  onTopicSelect?: (topic: string) => void;
}

// Apple-style frosted glass vocab sheet — slides up from the bottom
function DictionaryModal({
  vocab,
  onClose,
  gotIt,
  language,
}: {
  vocab: VocabWord;
  onClose: () => void;
  gotIt: string;
  language: string;
}) {
  const [recording, setRecording] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; feedback: string } | null>(null);
  const [checking, setChecking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setFeedback(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const mimeType = mr.mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(",")[1];
          setChecking(true);
          try {
            const res = await fetch("/api/pronounce", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ word: vocab.word, audioBase64: base64, mimeType, definition: vocab.definition, language }),
            });
            const data = await res.json();
            setFeedback(data);
            if (data.correct) {
              unlockAchievement("pronunciation_star");
              const count = incrementCounter("correct_pronunciations");
              if (count >= 3) unlockAchievement("pronunciation_trio");
            }
          } catch {
            setFeedback({ correct: false, feedback: "Something went wrong. Try again!" });
          } finally {
            setChecking(false);
          }
        };
        reader.readAsDataURL(blob);
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch {
      setFeedback({ correct: false, feedback: "Microphone access denied. Please allow mic access and try again." });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "appleSlideUp 0.32s cubic-bezier(0.32,0.72,0,1)",
          background: "#EEF4FF",
          boxShadow: "0 -8px 32px rgba(99,149,255,0.12), 0 24px 48px rgba(0,0,0,0.13)",
          border: "1.5px solid #D6E4FF",
        }}
        className="w-full max-w-lg mx-3 mb-4 rounded-[2rem] overflow-hidden"
      >
        {/* Blue top accent bar */}
        <div style={{ background: "linear-gradient(90deg, #5B9EFF 0%, #7BB8FF 100%)", height: "5px" }} />

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(91,158,255,0.25)" }} />
        </div>

        {/* Content */}
        <div className="px-6 pt-3 pb-7 flex flex-col gap-4">

          {/* Word + phonetic */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2
                className="text-4xl font-bold break-words tracking-tight"
                style={{ color: "#1a2e5a", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}
              >
                {vocab.word}
              </h2>
              {vocab.phonetic && (
                <p className="text-sm mt-1 font-medium" style={{ color: "#5B9EFF" }}>
                  {vocab.phonetic}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              style={{ background: "#D6E4FF", color: "#5B9EFF" }}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mt-1 transition hover:brightness-95 active:scale-90"
            >
              ✕
            </button>
          </div>

          {/* Divider */}
          <div style={{ height: "1.5px", background: "#D6E4FF", borderRadius: "2px" }} />

          {/* Part of speech */}
          {vocab.partOfSpeech && (
            <span
              className="self-start text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: "#D6E4FF", color: "#3a7bd5" }}
            >
              {vocab.partOfSpeech}
            </span>
          )}

          {/* Definition */}
          <p
            className="text-base leading-relaxed font-medium"
            style={{ color: "#1a2e5a", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}
          >
            {vocab.definition}
          </p>

          {/* Example */}
          {vocab.example && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#4a6fa5", fontStyle: "italic", paddingLeft: "12px", borderLeft: "3px solid #7BB8FF" }}
            >
              &ldquo;{vocab.example}&rdquo;
            </p>
          )}

          {/* Pronunciation practice */}
          <div className="rounded-xl p-3 flex flex-col gap-2" style={{ background: "#E0ECFF", border: "1px solid #C8DBFF" }}>
            <p className="text-xs font-medium" style={{ color: "#3a7bd5" }}>Practice saying it:</p>
            <button
              onClick={recording ? stopRecording : startRecording}
              disabled={checking}
              style={recording
                ? { background: "#ef4444" }
                : { background: "linear-gradient(135deg, #5B9EFF 0%, #3a7bd5 100%)" }
              }
              className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-medium text-white transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${recording ? "animate-pulse" : ""}`}
            >
              {checking ? "Checking..." : recording ? "⏹ Stop Recording" : "🎤 Record"}
            </button>
            {feedback && (
              <div className={`rounded-lg px-3 py-2 text-sm leading-snug ${
                feedback.correct ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"
              }`}>
                {feedback.feedback}
              </div>
            )}
          </div>

          {/* Button */}
          <button
            onClick={onClose}
            style={{
              background: "linear-gradient(135deg, #5B9EFF 0%, #3a7bd5 100%)",
              boxShadow: "0 4px 14px rgba(91,158,255,0.35)",
              fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
            }}
            className="mt-1 w-full py-3.5 rounded-2xl text-white font-bold text-base transition active:scale-95 hover:brightness-105"
          >
            {gotIt}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes appleSlideUp {
          from { transform: translateY(110%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function PageText({
  text,
  vocabulary,
  onWordClick,
  highlightedWord,
}: {
  text: string;
  vocabulary: VocabWord[];
  onWordClick: (vocab: VocabWord) => void;
  highlightedWord?: { word: string; charStart: number } | null;
}) {
  // Build a list of character ranges to highlight, sorted by start position.
  type Range = { start: number; end: number; vocab?: VocabWord; spoken?: boolean };
  const ranges: Range[] = [];

  // Vocab word ranges — find every occurrence in the text
  for (const v of vocabulary) {
    const escaped = v.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(escaped, "gi");
    let m;
    while ((m = re.exec(text)) !== null) {
      ranges.push({ start: m.index, end: m.index + m[0].length, vocab: v });
    }
  }

  // Spoken word range — strip punctuation then find the occurrence
  // closest to charStart so we highlight the right "the", not all of them.
  if (highlightedWord) {
    const clean = highlightedWord.word.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
    if (clean.length > 0) {
      const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(escaped, "gi");
      let m;
      let best: RegExpExecArray | null = null;
      let bestDist = Infinity;
      while ((m = re.exec(text)) !== null) {
        const dist = Math.abs(m.index - highlightedWord.charStart);
        if (dist < bestDist) { bestDist = dist; best = m; }
      }
      if (best && bestDist < 80) {
        // If this overlaps an existing vocab range, mark that range as spoken
        // instead of adding a duplicate — so the vocab word gets both styles.
        const overlap = ranges.find(
          (r) => r.vocab && r.start <= best!.index && best!.index < r.end
        );
        if (overlap) {
          overlap.spoken = true;
        } else {
          ranges.push({ start: best.index, end: best.index + best[0].length, spoken: true });
        }
      }
    }
  }

  // Sort by start; on overlap prefer vocab (it came first)
  ranges.sort((a, b) => a.start - b.start);

  // Render text as segments between ranges
  const segments: React.ReactNode[] = [];
  let pos = 0;
  for (const r of ranges) {
    if (r.start < pos) continue; // skip overlapping ranges
    if (r.start > pos) {
      segments.push(<span key={`t${pos}`}>{text.slice(pos, r.start)}</span>);
    }
    const content = text.slice(r.start, r.end);
    if (r.vocab) {
      segments.push(
        <span
          key={`v${r.start}`}
          className="underline decoration-[#1a73e8] decoration-[2px] underline-offset-2 cursor-pointer font-bold text-[#1a73e8] hover:text-[#1557b0] transition-colors"
          style={r.spoken ? { background: "rgba(255, 220, 50, 0.55)", borderRadius: "3px", padding: "0 2px" } : undefined}
          onClick={() => onWordClick(r.vocab!)}
        >{content}</span>
      );
    } else if (r.spoken) {
      segments.push(
        <mark
          key={`s${r.start}`}
          style={{ background: "rgba(255, 220, 50, 0.55)", borderRadius: "3px", padding: "0 2px", color: "inherit" }}
        >{content}</mark>
      );
    }
    pos = r.end;
  }
  if (pos < text.length) {
    segments.push(<span key={`t${pos}`}>{text.slice(pos)}</span>);
  }

  return (
    <p className="text-lg sm:text-xl leading-relaxed text-stone-800" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {segments}
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
  safety,
  storyId,
  language,
  onReset,
  onTopicSelect,
}: StoryDisplayProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [chosenBranch, setChosenBranch] = useState<"none" | "A" | "B">("none");
  const [showChoiceScreen, setShowChoiceScreen] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [activeVocab, setActiveVocab] = useState<VocabWord | null>(null);
  const [highlightedWord, setHighlightedWord] = useState<{ word: string; charStart: number } | null>(null);
  // Per-story tracking
  const [sessionVocabCount, setSessionVocabCount] = useState(0);
  const [visitedBranches, setVisitedBranches] = useState<Set<"A" | "B">>(new Set());
  const t = getTranslations(language);

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
    setHighlightedWord(null);
  }, [currentPage]);

  useEffect(() => {
    if (isLast) {
      unlockAchievement("bookworm");
      if (facts.length > 0) unlockAchievement("fact_finder");
    }
  }, [isLast, facts.length]);

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
    setVisitedBranches((prev) => {
      const next = new Set(prev);
      next.add(choice);
      if (next.size === 2) unlockAchievement("both_paths");
      return next;
    });
  };

  const handleTryOtherPath = () => {
    setChosenBranch("none");
    setShowChoiceScreen(false);
    setCurrentPage(branchPointIndex);
    unlockAchievement("path_explorer");
  };

  // Determine if the next button should be disabled
  // Allow clicking next on branch point (it opens the choice screen).
  // Only disable if already showing the choice screen, or on the actual last page.
  const nextDisabled = showChoiceScreen || (isLast && !needsChoice);

  return (
    <div className="w-full max-w-6xl flex flex-col gap-6">
      {activeVocab && (
        <DictionaryModal vocab={activeVocab} onClose={() => setActiveVocab(null)} gotIt={t.gotIt} language={language} />
      )}

      {/* Title */}
      <h1
        className="text-2xl sm:text-4xl font-bold text-amber-950 text-center leading-tight px-4 mt-2 tracking-wide"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        {title}
      </h1>

      {/* SafetyKit badge */}
      {safety && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="font-pixel"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              background: safety.safe
                ? "linear-gradient(90deg, #0a3d1e, #164d2a)"
                : "linear-gradient(90deg, #3d0a0a, #4d1616)",
              border: `2px solid ${safety.safe ? "#2ECC71" : "#E74C3C"}`,
              boxShadow: `0 0 8px ${safety.safe ? "rgba(46,204,113,0.3)" : "rgba(231,76,60,0.3)"}`,
              fontSize: "0.6rem",
              color: safety.safe ? "#7FE8A0" : "#FF9999",
              letterSpacing: "0.08em",
            }}
          >
            <span style={{ fontSize: "0.85rem" }}>{safety.safe ? "🛡️" : "⚠️"}</span>
            {safety.safe
              ? `CHILD SAFE · SCORE ${safety.score}/100`
              : `REVIEW NEEDED · SCORE ${safety.score}/100`}
            <span style={{ opacity: 0.6, fontSize: "0.5rem" }}>
              {safety.provider === "safetykit" ? "· SAFETYKIT" : "· AI VERIFIED"}
            </span>
          </div>
        </div>
      )}

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
                  onClick={() => {
                    setShowAudio((s) => {
                      if (!s) {
                        unlockAchievement("listener");
                        const pages = incrementCounter("audio_pages");
                        if (pages >= 5) unlockAchievement("audio_fan");
                      }
                      return !s;
                    });
                  }}
                  className={`absolute top-4 right-4 text-xs px-3 py-1.5 rounded-full border transition active:scale-95 ${
                    showAudio
                      ? "border-sky-400 bg-sky-50 text-sky-700"
                      : "border-stone-300 bg-white/60 text-stone-500 hover:bg-white"
                  }`}
                >
                  {showAudio ? t.hide : t.listen}
                </button>

                {/* Chapter rule */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-stone-300/70" />
                  <span
                    className="text-stone-400 text-[10px] tracking-[0.2em] uppercase select-none"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {t.pageOf(currentPage + 1, activePages.length)}
                  </span>
                  <div className="h-px flex-1 bg-stone-300/70" />
                </div>

                {/* Story text */}
                <PageText
                  key={currentPage}
                  text={page.text}
                  vocabulary={page.vocabulary ?? []}
                  onWordClick={(v) => {
                    setActiveVocab(v);
                    unlockAchievement("word_wizard");
                    // Global vocab counter
                    const total = incrementCounter("vocab_clicks");
                    if (total >= 10) unlockAchievement("vocab_master");
                    // Per-story vocab counter
                    setSessionVocabCount((n) => {
                      const next = n + 1;
                      if (next >= 5) unlockAchievement("deep_reader");
                      return next;
                    });
                  }}
                  highlightedWord={highlightedWord}
                />

                {page.vocabulary && page.vocabulary.length > 0 && (
                  <p className="text-xs text-[#1a73e8] opacity-60" style={{ fontFamily: "Georgia, serif" }}>
                    {t.tapBlueWords}
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
      {showAudio && !showChoiceScreen && (
        <AudioPlayer
          key={currentPage}
          storyText={page.text}
          onWordChange={setHighlightedWord}
        />
      )}


      {/* Similar Stories — powered by Actian VectorAI */}
      {isLast && onTopicSelect && (
        <SimilarStories
          storyTitle={title}
          onTopicSelect={onTopicSelect}
        />
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
            {t.createAnother}
          </button>
        </div>
      )}
    </div>
  );
}
