"use client";

import { useEffect, useRef, useState } from "react";

interface WordTiming {
  word: string;
  start: number;
  end: number;
}

interface HighlightInfo {
  word: string;
  charStart: number;
}

interface AudioPlayerProps {
  storyText: string;
  onWordChange?: (info: HighlightInfo | null) => void;
}

export default function AudioPlayer({ storyText, onWordChange }: AudioPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number>(0);
  // Use refs so RAF callback always sees latest values without re-attaching listeners
  const wordsRef = useRef<WordTiming[]>([]);
  const onWordChangeRef = useRef(onWordChange);

  useEffect(() => { onWordChangeRef.current = onWordChange; }, [onWordChange]);

  // Fetch audio + word timings
  useEffect(() => {
    let blobUrl: string;

    const fetchAudio = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: storyText }),
        });

        if (!res.ok) throw new Error("Failed to load audio");

        const data = await res.json();
        const byteArray = Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0));
        const blob = new Blob([byteArray], { type: "audio/mpeg" });
        blobUrl = URL.createObjectURL(blob);
        wordsRef.current = data.words ?? [];
        setAudioUrl(blobUrl);
      } catch (err) {
        setError("Could not load narration.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudio();
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [storyText]);

  // RAF-based polling for accurate word highlighting
  const startRAF = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const tick = () => {
      const t = audio.currentTime;
      setProgress(t);

      const words = wordsRef.current;
      if (words.length > 0 && onWordChangeRef.current) {
        // Find the last word whose start time is <= current time
        let active: WordTiming | null = null;
        for (const w of words) {
          if (w.start <= t) active = w;
          else break;
        }
        // Clear highlight if we've moved well past the word's end
        if (active && t > active.end + 0.08) active = null;
        onWordChangeRef.current(
          active ? { word: active.word, charStart: active.charStart } : null
        );
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const stopRAF = () => {
    cancelAnimationFrame(rafRef.current);
    onWordChangeRef.current?.(null);
  };

  // Wire up audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    audio.src = audioUrl;

    const onPlay = () => startRAF();
    const onPause = () => stopRAF();
    const onEnded = () => { setPlaying(false); stopRAF(); };
    const onDurationChange = () => setDuration(audio.duration);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("durationchange", onDurationChange);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("durationchange", onDurationChange);
      cancelAnimationFrame(rafRef.current);
    };
  }, [audioUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (error) return null;

  return (
    <div className="w-full rounded-2xl bg-sky-50 border border-sky-200 p-4 flex flex-col gap-3">
      {loading ? (
        <div className="flex items-center gap-2 text-sky-500 text-sm">
          <span className="animate-pulse">🎵</span>
          <span>Preparing narration…</span>
        </div>
      ) : (
        <>
          <audio ref={audioRef} className="hidden" />
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              disabled={!audioUrl}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-sky-500 text-white shadow hover:bg-sky-600 active:scale-95 transition disabled:opacity-50"
            >
              {playing ? "⏸" : "▶"}
            </button>

            <div className="flex-1 flex flex-col gap-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={progress}
                onChange={(e) => {
                  const t = Number(e.target.value);
                  if (audioRef.current) audioRef.current.currentTime = t;
                  setProgress(t);
                }}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-sky-400">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
