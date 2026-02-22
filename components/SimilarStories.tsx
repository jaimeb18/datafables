"use client";

import { useEffect, useState } from "react";

interface StorySuggestion {
  id: string;
  title: string;
  topic: string;
  age_group: string;
  score: number;
}

interface Props {
  storyTitle: string;
  onTopicSelect: (topic: string) => void;
}

export default function SimilarStories({ storyTitle, onTopicSelect }: Props) {
  const [suggestions, setSuggestions] = useState<StorySuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: storyTitle, topK: 3 }),
    })
      .then((r) => {
        if (!r.ok) throw new Error("unavailable");
        return r.json();
      })
      .then((data) => {
        setSuggestions(data.suggestions ?? []);
        setLoading(false);
      })
      .catch(() => {
        setAvailable(false);
        setLoading(false);
      });
  }, [storyTitle]);

  if (!available || (!loading && suggestions.length === 0)) return null;

  return (
    <div
      style={{
        marginTop: "16px",
        padding: "16px",
        background: "linear-gradient(135deg, #1a1428 0%, #221638 100%)",
        border: "2px solid rgba(138,99,210,0.35)",
        boxShadow: "4px 4px 0 rgba(0,0,0,0.4)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "1rem" }}>🔮</span>
        <p
          className="font-pixel"
          style={{
            fontSize: "0.7rem",
            color: "#C09FD8",
            letterSpacing: "0.12em",
          }}
        >
          YOU MIGHT ALSO LIKE
        </p>
        <span
          className="font-pixel"
          style={{
            fontSize: "0.48rem",
            color: "#5a4870",
            marginLeft: "auto",
            letterSpacing: "0.06em",
          }}
        >
          POWERED BY ACTIAN VECTORAI
        </span>
      </div>

      {loading ? (
        <div style={{ display: "flex", gap: "8px" }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: "60px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {suggestions.map((s) => (
            <button
              key={s.id}
              onClick={() => onTopicSelect(s.topic)}
              className="font-pixel"
              style={{
                flex: "1 1 140px",
                padding: "10px 12px",
                background: "rgba(138,99,210,0.1)",
                border: "1.5px solid rgba(138,99,210,0.3)",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(138,99,210,0.22)";
                e.currentTarget.style.borderColor = "#8A63D2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(138,99,210,0.1)";
                e.currentTarget.style.borderColor = "rgba(138,99,210,0.3)";
              }}
            >
              <p style={{ fontSize: "0.65rem", color: "#C09FD8", fontWeight: 700, marginBottom: "3px", lineHeight: 1.3 }}>
                {s.title}
              </p>
              <p style={{ fontSize: "0.52rem", color: "#6a5888" }}>
                {s.topic} · {s.age_group}
              </p>
              <p style={{ fontSize: "0.48rem", color: "rgba(138,99,210,0.6)", marginTop: "4px" }}>
                {Math.round(s.score * 100)}% match → click to generate
              </p>
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
