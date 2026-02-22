"use client";

import { useEffect, useState } from "react";
import { ACHIEVEMENTS, Achievement } from "@/lib/achievements";
import AchievementIcon from "./AchievementIcon";

interface ToastItem {
  achievement: Achievement;
  key: number;
}

let _key = 0;

export default function AchievementToast() {
  const [queue, setQueue] = useState<ToastItem[]>([]);
  const [current, setCurrent] = useState<ToastItem | null>(null);
  const [leaving, setLeaving] = useState(false);

  // Listen for achievement unlock events
  useEffect(() => {
    const handler = (e: Event) => {
      const { id } = (e as CustomEvent<{ id: string }>).detail;
      const achievement = ACHIEVEMENTS.find((a) => a.id === id);
      if (!achievement) return;
      setQueue((q) => [...q, { achievement, key: _key++ }]);
    };
    window.addEventListener("datafables:achievement", handler);
    return () => window.removeEventListener("datafables:achievement", handler);
  }, []);

  // Dequeue: when nothing is showing and queue has items, show next
  useEffect(() => {
    if (current !== null || queue.length === 0) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    setLeaving(false);
    setCurrent(next);
  }, [current, queue]);

  // Auto-dismiss: set up timers whenever a new toast becomes current
  // Keyed on current.key so the effect only re-runs when a genuinely new
  // toast arrives — not when other state changes happen.
  const currentKey = current?.key;
  useEffect(() => {
    if (currentKey === undefined) return;
    const leaveTimer = setTimeout(() => setLeaving(true), 4600);
    const hideTimer  = setTimeout(() => setCurrent(null), 5200);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
    };
  }, [currentKey]);

  if (!current) return null;

  return (
    <>
      <div
        key={current.key}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          animation: leaving
            ? "achOut 0.5s cubic-bezier(0.55, 0, 1, 0.45) forwards"
            : "achIn 0.45s cubic-bezier(0, 0.55, 0.45, 1) forwards",
          imageRendering: "pixelated",
          pointerEvents: "none",
        }}
      >
        {/* Outer shadow layer for extra pixel-art depth */}
        <div
          style={{
            background: "#000",
            position: "absolute",
            inset: 0,
            transform: "translate(4px, 4px)",
          }}
        />

        {/* Main toast card */}
        <div
          style={{
            position: "relative",
            background: "linear-gradient(135deg, #1a1428 0%, #261b3e 100%)",
            border: "3px solid #EAA624",
            width: "420px",
            display: "flex",
            gap: "14px",
            padding: "14px 16px 16px",
            overflow: "hidden",
          }}
        >
          {/* Shimmer bar at top */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background:
                "linear-gradient(90deg, transparent 0%, #EAA624 30%, #F2D091 50%, #EAA624 70%, transparent 100%)",
            }}
          />

          {/* Icon box */}
          <div
            style={{
              width: "70px",
              height: "70px",
              flexShrink: 0,
              marginTop: "4px",
              background: "linear-gradient(135deg, #BF8010 0%, #EAA624 50%, #F2D091 100%)",
              border: "2px solid #EAA624",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AchievementIcon id={current.achievement.id} size={60} />
          </div>

          {/* Text content */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "5px", paddingTop: "4px" }}>
            <p
              className="font-pixel"
              style={{ fontSize: "0.72rem", color: "#EAA624", letterSpacing: "0.14em", textTransform: "uppercase" }}
            >
              ★ Achievement Unlocked ★
            </p>
            <p
              className="font-pixel"
              style={{ fontSize: "1rem", color: "#F2D091", fontWeight: 700, letterSpacing: "0.03em", lineHeight: 1.2 }}
            >
              {current.achievement.title}
            </p>
            <p style={{ fontSize: "0.82rem", color: "#b8a4cc", lineHeight: 1.4, fontWeight: 500 }}>
              {current.achievement.description}
            </p>
            <p className="font-pixel" style={{ fontSize: "0.75rem", color: "#EAA624", marginTop: "2px" }}>
              +{current.achievement.xp} XP
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes achIn {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes achOut {
          from { transform: translateX(0);    opacity: 1; }
          to   { transform: translateX(120%); opacity: 0; }
        }
      `}</style>
    </>
  );
}
