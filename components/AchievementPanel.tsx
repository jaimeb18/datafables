"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAllAchievements,
  ACHIEVEMENTS,
  getXP,
  getCoins,
  getLevelInfo,
  getXPProgress,
} from "@/lib/achievements";
import AchievementIcon from "./AchievementIcon";

interface Stats {
  xp: number;
  coins: number;
  levelInfo: ReturnType<typeof getLevelInfo>;
  xpProgress: ReturnType<typeof getXPProgress>;
}

const EMPTY_STATS: Stats = {
  xp: 0,
  coins: 0,
  levelInfo: { level: 1, label: "Beginner", minXp: 0, maxXp: 50, coinBoost: 1.0, baseCoins: 10 },
  xpProgress: { current: 0, needed: 50 },
};

export default function AchievementPanel() {
  const [open, setOpen] = useState(false);
  const [achievements, setAchievements] = useState(() =>
    ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false }))
  );
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);

  const refresh = useCallback(() => {
    setAchievements(getAllAchievements());
    setStats({
      xp: getXP(),
      coins: getCoins(),
      levelInfo: getLevelInfo(),
      xpProgress: getXPProgress(),
    });
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const events = ["datafables:achievement", "datafables:xp", "datafables:coins"];
    events.forEach((e) => window.addEventListener(e, refresh));
    return () => events.forEach((e) => window.removeEventListener(e, refresh));
  }, [refresh]);

  useEffect(() => { if (open) refresh(); }, [open, refresh]);

  const unlocked = achievements.filter((a) => a.unlocked).length;
  const total = achievements.length;
  const { levelInfo, xpProgress } = stats;
  const xpPct = xpProgress.needed === 0
    ? 100
    : Math.min(100, (xpProgress.current / xpProgress.needed) * 100);

  return (
    <>
      {/* ── Floating button ───────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="View achievements"
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          zIndex: 9000,
          width: "64px",
          height: "64px",
          background: "linear-gradient(135deg, #BF8010 0%, #EAA624 60%, #F2D091 100%)",
          border: "3px solid #383659",
          boxShadow: "3px 3px 0 #383659",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "transform 0.1s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.93)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/trophy.png" alt="trophy" style={{ width: "78px", height: "78px", imageRendering: "pixelated" }} />
        <span
          className="font-pixel"
          style={{
            position: "absolute",
            bottom: "-6px",
            right: "-6px",
            background: "#383659",
            color: "#F2D091",
            fontSize: "0.62rem",
            lineHeight: 1,
            padding: "3px 5px",
            border: "1.5px solid #EAA624",
            minWidth: "20px",
            textAlign: "center",
          }}
        >
          {unlocked}/{total}
        </span>
      </button>

      {/* ── Modal ─────────────────────────────────────────────────────── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9100,
            background: "rgba(20,16,36,0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(160deg, #1a1428 0%, #261b3e 100%)",
              border: "3px solid #EAA624",
              boxShadow: "6px 6px 0 #000",
              width: "100%",
              maxWidth: "740px",
              maxHeight: "88vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              animation: "panelIn 0.3s cubic-bezier(0,0.55,0.45,1)",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(90deg, #BF8010 0%, #EAA624 50%, #BF8010 100%)",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/trophy.png" alt="trophy" style={{ width: "72px", height: "72px", imageRendering: "pixelated" }} />
                <h2 className="font-pixel" style={{ fontSize: "1.1rem", color: "#1a1428", letterSpacing: "0.1em", fontWeight: 700 }}>
                  ACHIEVEMENTS
                </h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="font-pixel" style={{ fontSize: "0.8rem", color: "#1a1428", background: "rgba(0,0,0,0.2)", padding: "4px 10px", border: "1.5px solid rgba(0,0,0,0.3)" }}>
                  {unlocked} / {total}
                </span>
                <button
                  onClick={() => setOpen(false)}
                  style={{ background: "rgba(0,0,0,0.25)", border: "2px solid rgba(0,0,0,0.35)", color: "#1a1428", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontWeight: 700, fontSize: "1rem" }}
                >✕</button>
              </div>
            </div>

            {/* ── XP / Level / Coins strip ─────────────────────────────── */}
            <div
              style={{
                background: "#0f0b1e",
                borderBottom: "2px solid rgba(234,166,36,0.25)",
                padding: "10px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              {/* Level + coins row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {/* Level badge */}
                  <div
                    className="font-pixel"
                    style={{
                      background: "linear-gradient(135deg, #BF8010, #EAA624)",
                      border: "2px solid #F2D091",
                      padding: "4px 10px",
                      fontSize: "0.88rem",
                      color: "#1a1428",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                    }}
                  >
                    LVL {levelInfo.level}
                  </div>
                  <span className="font-pixel" style={{ fontSize: "0.88rem", color: "#F2D091", letterSpacing: "0.06em" }}>
                    {levelInfo.label.toUpperCase()}
                  </span>
                </div>

                {/* Coins */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "1.1rem" }}>🪙</span>
                  <span className="font-pixel" style={{ fontSize: "0.92rem", color: "#F2D091", fontWeight: 700 }}>
                    {stats.coins}
                  </span>
                  <span className="font-pixel" style={{ fontSize: "0.68rem", color: "#8070a0" }}>COINS</span>
                </div>
              </div>

              {/* XP bar */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span className="font-pixel" style={{ fontSize: "0.7rem", color: "#8070a0", letterSpacing: "0.08em" }}>XP</span>
                  <span className="font-pixel" style={{ fontSize: "0.7rem", color: "#8070a0" }}>
                    {xpProgress.needed === 0
                      ? `${stats.xp} XP — MAX LEVEL`
                      : `${xpProgress.current} / ${xpProgress.needed}`}
                  </span>
                </div>
                <div style={{ height: "12px", background: "#1e1630", border: "1px solid rgba(234,166,36,0.2)" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${xpPct}%`,
                      background: "linear-gradient(90deg, #EAA624, #F2D091)",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>

              {/* Coin boost info */}
              <p className="font-pixel" style={{ fontSize: "0.65rem", color: "#6a5888", letterSpacing: "0.06em" }}>
                COIN BOOST: {levelInfo.coinBoost}x · {levelInfo.baseCoins} BASE COINS PER STORY
                {levelInfo.level < 5 && ` · NEXT LEVEL AT ${levelInfo.maxXp} XP`}
              </p>
            </div>

            {/* Achievement list */}
            <div style={{ overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {achievements.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 16px",
                    background: a.unlocked
                      ? "linear-gradient(90deg, rgba(234,166,36,0.12) 0%, rgba(38,27,62,0.6) 100%)"
                      : "rgba(255,255,255,0.04)",
                    border: `2px solid ${a.unlocked ? "#EAA624" : "rgba(255,255,255,0.08)"}`,
                    opacity: a.unlocked ? 1 : 0.55,
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      flexShrink: 0,
                      background: a.unlocked
                        ? "linear-gradient(135deg, #BF8010 0%, #EAA624 60%, #F2D091 100%)"
                        : "#2a2040",
                      border: `2px solid ${a.unlocked ? "#EAA624" : "rgba(255,255,255,0.15)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AchievementIcon id={a.id} size={52} dim={!a.unlocked} />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="font-pixel" style={{ fontSize: "0.9rem", color: a.unlocked ? "#F2D091" : "#8070a0", fontWeight: 700, letterSpacing: "0.04em", lineHeight: 1.2, marginBottom: "4px" }}>
                      {a.title}
                    </p>
                    <p style={{ fontSize: "0.8rem", color: a.unlocked ? "#b8a4cc" : "#5a4870", lineHeight: 1.4, fontWeight: 500 }}>
                      {a.description}
                    </p>
                  </div>

                  {/* XP badge */}
                  <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "3px" }}>
                    <span className="font-pixel" style={{ fontSize: "0.82rem", color: a.unlocked ? "#F2D091" : "#4a3860", fontWeight: 700 }}>
                      +{a.xp}
                    </span>
                    <span className="font-pixel" style={{ fontSize: "0.58rem", color: a.unlocked ? "#8070a0" : "#3a2850", letterSpacing: "0.06em" }}>
                      XP
                    </span>
                    {a.unlocked && (
                      <div style={{ width: "24px", height: "24px", background: "#EAA624", border: "2px solid #F2D091", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "#1a1428", fontWeight: 900, marginTop: "2px" }}>
                        ✓
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding: "10px 20px", borderTop: "2px solid rgba(234,166,36,0.2)", flexShrink: 0 }}>
              <p className="font-pixel" style={{ fontSize: "0.65rem", color: "#6a5888", textAlign: "center", letterSpacing: "0.08em" }}>
                {unlocked === total
                  ? "★ ALL ACHIEVEMENTS UNLOCKED — YOU ARE A TRUE DATAFABLE LEGEND ★"
                  : `${total - unlocked} MORE TO DISCOVER · KEEP READING & EXPLORING!`}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes panelIn {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
