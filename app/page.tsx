"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import StoryForm from "@/components/StoryForm";
import StoryDisplay from "@/components/StoryDisplay";
import GenreCard from "@/components/GenreCard";

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

interface BookResult {
  title: string;
  branchPointIndex: number;
  commonPages: BookPage[];
  branchPointPage: BookPage;
  choiceA: BranchChoice;
  choiceB: BranchChoice;
  facts: string[];
}

const GENRES = [
  {
    genre: "Fantasy",
    description: "Dragons, magic & adventure",
    image: "/genres/fantasy.png",
  },
  {
    genre: "Sci-Fi",
    description: "Space, robots & the future",
    image: "/genres/sci-fi.png",
  },
  {
    genre: "Mystery",
    description: "Clues, secrets & suspense",
    image: "/genres/mystery.png",
  },
  {
    genre: "Poem",
    description: "Rhythm, rhyme & beauty",
    image: "/genres/poem.png",
  },
  {
    genre: "Realistic Fiction",
    description: "Real life, real feelings",
    image: "/genres/realistic-fiction.png",
  },
  {
    genre: "Historical Fiction",
    description: "Stories from the past",
    image: "/genres/historical-fiction.png",
  },
];

// ── Small inline pixel-art book icon ─────────────────────────────────────────
function PixelBookIcon() {
  return (
    <svg
      width={36}
      height={36}
      viewBox="0 0 32 32"
      style={{ imageRendering: "pixelated" }}
      shapeRendering="crispEdges"
    >
      <rect x={4} y={6} width={24} height={20} fill="#AADCF2" />
      <rect x={4} y={6} width={24} height={20} fill="none" stroke="#3a3e14" strokeWidth={2} />
      <rect x={4} y={6} width={4} height={20} fill="#C85555" />
      <rect x={4} y={6} width={4} height={20} fill="none" stroke="#3a3e14" strokeWidth={2} />
      <rect x={10} y={12} width={14} height={2} fill="#767B39" />
      <rect x={10} y={16} width={14} height={2} fill="#767B39" />
      <rect x={10} y={20} width={10} height={2} fill="#767B39" />
      <rect x={2}  y={2}  width={2}  height={2} fill="#EAA624" />
      <rect x={28} y={4}  width={2}  height={2} fill="#EAA624" />
    </svg>
  );
}

export default function Home() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<BookResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState("English");
  const [prefillTopic, setPrefillTopic] = useState<string>("");
  const section2Ref = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (topic: string, ageGroup: string, lang: string) => {
    setLanguage(lang);
    const language = lang;
    setState("loading");
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, ageGroup, language }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      setResult(data);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("idle");
    }
  };

  const handleReset = () => {
    setState("idle");
    setResult(null);
    setError(null);
    setPrefillTopic("");
  };

  const handleGenreClick = (genre: string) => {
    setPrefillTopic(genre);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToCreate = () => {
    section2Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (state === "done" && result) {
    return (
      <div
        className="min-h-screen flex flex-col items-center"
        style={{ background: "var(--pixel-bg)", position: "relative", zIndex: 1 }}
      >
        <main className="flex-1 w-full flex flex-col items-center px-6 sm:px-10 pb-16 pt-10">
          <StoryDisplay
            title={result.title}
            branchPointIndex={result.branchPointIndex}
            commonPages={result.commonPages}
            branchPointPage={result.branchPointPage}
            choiceA={result.choiceA}
            choiceB={result.choiceB}
            facts={result.facts}
            language={language}
            onReset={handleReset}
          />
        </main>
        <footer
          className="py-5 text-center font-pixel"
          style={{ fontSize: "0.8rem", color: "var(--pixel-mid)", letterSpacing: "0.05em" }}
        >
          ♥ Powered by Gemini · ElevenLabs · Snowflake ♥
        </footer>
      </div>
    );
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          Fixed landscape height; image scaled to show full left↔right
          width with vertical center-crop. Leaves Customization visible.
      ══════════════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", height: "85vh", minHeight: "480px", overflow: "hidden" }}>
        {/* Background image — fill + cover scales to container width,
            so left/right edges of the square image are always visible */}
        <Image
          src="/bedroom_background.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center bottom",
            imageRendering: "pixelated",
          }}
        />

        {/* Midnight purple overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(56, 54, 89, 0.30)",
            pointerEvents: "none",
          }}
        />
        {/* Deep Wood warm overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(82, 58, 62, 0.20)",
            pointerEvents: "none",
          }}
        />

        {/* Hero content — centered over the image */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            padding: "2rem 1.5rem",
            textAlign: "center",
          }}
        >
          {/* Decorative star row */}
          <p
            className="font-stardew"
            style={{ fontSize: "1.1rem", color: "#F2D091", letterSpacing: "0.5em", opacity: 0.85 }}
          >
            ★ ★ ★
          </p>

          {/* Main title */}
          <h1
            className="font-stardew"
            style={{
              fontSize: "clamp(2.8rem, 9vw, 5.5rem)",
              color: "#F2D091",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "0.06em",
              textShadow: "3px 3px 0 rgba(56,54,89,0.9), 6px 6px 0 rgba(56,54,89,0.4)",
            }}
          >
            DATAFABLES
          </h1>

          {/* Tagline */}
          <p
            className="font-pixel"
            style={{
              fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)",
              color: "#EAE0DF",
              letterSpacing: "0.06em",
              lineHeight: 1.6,
            }}
          >
            AI stories that teach
          </p>

          {/* Body copy */}
          <p
            style={{
              fontSize: "clamp(0.9rem, 2.2vw, 1.05rem)",
              color: "#D899B1",
              fontWeight: 600,
              lineHeight: 1.7,
              maxWidth: "480px",
            }}
          >
            Pick a genre or tell us what you&apos;re curious about —
            we&apos;ll craft a magical, educational story just for you!
          </p>

          {/* Scroll-down indicator */}
          <button
            onClick={scrollToCreate}
            type="button"
            aria-label="Scroll to story creator"
            style={{
              marginTop: "0.75rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
            }}
            className="animate-bounce-slow"
          >
            <span
              className="font-pixel"
              style={{ fontSize: "1.8rem", color: "#EAE0DF", display: "block" }}
            >
              ▼
            </span>
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          SECTION 2 — CUSTOMIZATION
      ══════════════════════════════════════════════════════════════════ */}
      <section
        ref={section2Ref}
        style={{
          background: "var(--pixel-bg)",
          backgroundImage: "radial-gradient(circle, rgba(122,104,148,0.14) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          position: "relative",
        }}
      >
        <div className="flex flex-col items-center px-6 sm:px-10 pb-20 pt-12 gap-12">

          {/* Section heading */}
          <header className="flex flex-col items-center gap-2 pt-2">
            <h2
              className="font-pixel"
              style={{
                fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                color: "var(--pixel-dark)",
                fontWeight: 700,
                letterSpacing: "0.12em",
              }}
            >
              ✦ CUSTOMIZATION ✦
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--pixel-mid)",
                fontWeight: 600,
                letterSpacing: "0.03em",
              }}
            >
              Pick a genre, choose your settings, and create your story
            </p>
          </header>

          {/* Genres */}
          <section className="w-full max-w-5xl flex flex-col items-center gap-6">
            <h3
              className="font-pixel"
              style={{ fontSize: "1.6rem", color: "var(--pixel-dark)", fontWeight: 700, letterSpacing: "0.1em" }}
            >
              ★ GENRES ★
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full">
              {GENRES.map((g) => (
                <GenreCard
                  key={g.genre}
                  genre={g.genre}
                  description={g.description}
                  sprite={
                    <Image
                      src={g.image}
                      alt={g.genre}
                      width={160}
                      height={160}
                      style={{
                        imageRendering: "pixelated",
                        width: "auto",
                        height: "100%",
                        maxHeight: "160px",
                        objectFit: "contain",
                      }}
                    />
                  }
                  onClick={() => handleGenreClick(g.genre)}
                />
              ))}
            </div>
          </section>

          {/* Story Form */}
          <div ref={formRef} className="w-full max-w-2xl flex flex-col items-center gap-6">
            {error && (
              <div
                className="w-full px-5 py-4 text-sm font-semibold"
                style={{
                  background: "#f5e8ec",
                  border: "3px solid #9E6459",
                  borderRadius: "12px",
                  boxShadow: "3px 3px 0 #523A3E",
                  color: "#523A3E",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <StoryForm
              onSubmit={handleSubmit}
              loading={state === "loading"}
              prefillTopic={prefillTopic}
            />

            {state === "loading" && (
              <div className="flex flex-col items-center gap-3 py-4">
                <div
                  className="animate-bounce text-center"
                  style={{ fontSize: "2.5rem" }}
                >
                  🔮
                </div>
                <p
                  className="text-sm text-center font-semibold"
                  style={{ color: "var(--pixel-mid)" }}
                >
                  Gathering facts, crafting your story,
                  <br />
                  and painting illustrations…
                  <br />
                  <span style={{ color: "var(--pixel-dark)" }}>
                    This may take about 30 seconds.
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer
          className="py-5 text-center font-pixel"
          style={{ fontSize: "0.8rem", color: "var(--pixel-mid)", letterSpacing: "0.05em" }}
        >
          ♥ Powered by Gemini · ElevenLabs · Snowflake ♥
        </footer>
      </section>
    </>
  );
}
