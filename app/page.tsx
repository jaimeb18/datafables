"use client";

import { useState } from "react";
import StoryForm from "@/components/StoryForm";
import StoryDisplay from "@/components/StoryDisplay";

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

export default function Home() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<BookResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (topic: string, ageGroup: string, language: string) => {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-sky-50 flex flex-col items-center">
      {/* Header */}
      <header className="w-full flex items-center justify-center py-8 px-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">📚</span>
          <div>
            <h1 className="text-3xl font-extrabold text-amber-800 leading-none">DataFables</h1>
            <p className="text-sm text-amber-600 font-medium">AI stories that teach</p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col items-center px-4 pb-16">
        {state === "done" && result ? (
          <StoryDisplay
            title={result.title}
            branchPointIndex={result.branchPointIndex}
            commonPages={result.commonPages}
            branchPointPage={result.branchPointPage}
            choiceA={result.choiceA}
            choiceB={result.choiceB}
            facts={result.facts}
            onReset={handleReset}
          />
        ) : (
          <div className="w-full max-w-xl flex flex-col items-center gap-8">
            {/* Hero text */}
            <div className="text-center flex flex-col gap-2">
              <h2 className="text-2xl font-extrabold text-gray-800">
                Your next adventure starts here
              </h2>
              <p className="text-gray-500 text-base">
                Tell us what you&apos;re curious about and we&apos;ll create a magical, educational
                story just for you.
              </p>
            </div>

            {error && (
              <div className="w-full rounded-2xl bg-red-50 border border-red-200 px-5 py-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <StoryForm onSubmit={handleSubmit} loading={state === "loading"} />

            {state === "loading" && (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="text-5xl animate-bounce">🔮</div>
                <p className="text-sm text-gray-500 text-center">
                  Gathering facts, crafting your interactive story, and painting illustrations…
                  <br />
                  <span className="font-medium">This may take about a minute.</span>
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="py-4 text-xs text-gray-400 text-center">
        Powered by Gemini · ElevenLabs · Snowflake
      </footer>
    </div>
  );
}
