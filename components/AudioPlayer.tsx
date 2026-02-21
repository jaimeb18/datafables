"use client";

import { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  storyText: string;
}

export default function AudioPlayer({ storyText }: AudioPlayerProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

        const blob = await res.blob();
        blobUrl = URL.createObjectURL(blob);
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    audio.src = audioUrl;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioUrl]);

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
      <div className="flex items-center gap-3">
        <span className="text-sky-700 font-bold text-sm">🎧 Listen to your story</span>
      </div>

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

            {/* Progress bar */}
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
