"use client";

import { useState, useEffect, useCallback } from "react";
import { getCoins } from "@/lib/achievements";
import { SHOP_ITEMS, purchaseItem, getOwnedItemIds, type ShopItem } from "@/lib/shop";

const CATEGORY_LABELS: Record<string, string> = {
  hair_color: "Hair Colors",
  hair_style: "Hair Styles",
  accessory:  "Accessories",
};

const CATEGORIES = ["hair_color", "hair_style", "accessory"] as const;

export default function ShopPanel() {
  const [open, setOpen]           = useState(false);
  const [coins, setCoins]         = useState(0);
  const [owned, setOwned]         = useState<Set<string>>(new Set());
  const [buyError, setBuyError]   = useState<string | null>(null);
  const [justBought, setJustBought] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setCoins(getCoins());
    setOwned(getOwnedItemIds());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const events = ["datafables:coins", "datafables:shop_purchase"];
    events.forEach((e) => window.addEventListener(e, refresh));
    return () => events.forEach((e) => window.removeEventListener(e, refresh));
  }, [refresh]);

  useEffect(() => { if (open) refresh(); }, [open, refresh]);

  function handleBuy(item: ShopItem) {
    setBuyError(null);
    const result = purchaseItem(item.id);
    if (result.success) {
      setJustBought(item.id);
      setTimeout(() => setJustBought(null), 2000);
      refresh();
    } else {
      setBuyError(result.reason ?? "Purchase failed");
      setTimeout(() => setBuyError(null), 2500);
    }
  }

  return (
    <>
      {/* ── Floating shop button ───────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open shop"
        style={{
          position: "fixed",
          top: "92px",
          right: "16px",
          zIndex: 9000,
          width: "64px",
          height: "64px",
          background: "linear-gradient(135deg, #1a6a3a 0%, #2ECC71 60%, #7FE8A0 100%)",
          border: "3px solid #383659",
          boxShadow: "3px 3px 0 #383659",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "1.6rem",
          transition: "transform 0.1s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.93)")}
        onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
      >
        🛒
        <span
          className="font-pixel"
          style={{
            position: "absolute",
            bottom: "-6px",
            right: "-6px",
            background: "#383659",
            color: "#7FE8A0",
            fontSize: "0.62rem",
            lineHeight: 1,
            padding: "3px 5px",
            border: "1.5px solid #2ECC71",
            minWidth: "20px",
            textAlign: "center",
          }}
        >
          🪙{coins}
        </span>
      </button>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
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
              border: "3px solid #2ECC71",
              boxShadow: "6px 6px 0 #000",
              width: "100%",
              maxWidth: "740px",
              maxHeight: "88vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              animation: "shopPanelIn 0.3s cubic-bezier(0,0.55,0.45,1)",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "linear-gradient(90deg, #1a6a3a 0%, #2ECC71 50%, #1a6a3a 100%)",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.2rem" }}>🛒</span>
                <h2 className="font-pixel" style={{ fontSize: "1.1rem", color: "#1a1428", letterSpacing: "0.1em", fontWeight: 700 }}>
                  COIN SHOP
                </h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="font-pixel" style={{ fontSize: "0.8rem", color: "#1a1428", background: "rgba(0,0,0,0.2)", padding: "4px 10px", border: "1.5px solid rgba(0,0,0,0.3)" }}>
                  🪙 {coins} COINS
                </span>
                <button
                  onClick={() => setOpen(false)}
                  style={{ background: "rgba(0,0,0,0.25)", border: "2px solid rgba(0,0,0,0.35)", color: "#1a1428", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontWeight: 700, fontSize: "1rem" }}
                >✕</button>
              </div>
            </div>

            {/* Info / error strip */}
            <div style={{ background: "#0f0b1e", borderBottom: "2px solid rgba(46,204,113,0.2)", padding: "8px 16px", flexShrink: 0 }}>
              <p className="font-pixel" style={{ fontSize: "0.65rem", color: "#6a5888", letterSpacing: "0.06em" }}>
                EARN COINS BY COMPLETING STORIES · UNLOCK EXCLUSIVE STYLES FOR YOUR CHARACTER
              </p>
              {buyError && (
                <p className="font-pixel" style={{ fontSize: "0.68rem", color: "#E87777", marginTop: "5px", letterSpacing: "0.06em" }}>
                  ✗ {buyError}
                </p>
              )}
            </div>

            {/* Item list by category */}
            <div style={{ overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {CATEGORIES.map((cat) => {
                const items = SHOP_ITEMS.filter((i) => i.category === cat);
                return (
                  <div key={cat}>
                    <p className="font-pixel" style={{ fontSize: "0.8rem", color: "#2ECC71", letterSpacing: "0.12em", marginBottom: "10px", borderBottom: "1px solid rgba(46,204,113,0.2)", paddingBottom: "5px" }}>
                      {CATEGORY_LABELS[cat].toUpperCase()}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {items.map((item) => {
                        const isItemOwned = owned.has(item.id);
                        const bought      = justBought === item.id;
                        const canAfford   = coins >= item.price;
                        return (
                          <div
                            key={item.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                              padding: "14px 16px",
                              background: isItemOwned
                                ? "linear-gradient(90deg, rgba(46,204,113,0.12) 0%, rgba(38,27,62,0.6) 100%)"
                                : "rgba(255,255,255,0.04)",
                              border: `2px solid ${isItemOwned ? "#2ECC71" : "rgba(255,255,255,0.08)"}`,
                            }}
                          >
                            {/* Swatch or emoji */}
                            {item.color ? (
                              <div style={{
                                width: "38px", height: "38px", flexShrink: 0,
                                background: item.id === "hair_rainbow"
                                  ? "linear-gradient(135deg, #FF69B4, #A855F7, #4A90D9, #27AE60, #F59E0B)"
                                  : item.color,
                                border: `2px solid ${isItemOwned ? "#2ECC71" : "rgba(255,255,255,0.2)"}`,
                              }} />
                            ) : (
                              <span style={{ fontSize: "1.7rem", flexShrink: 0, width: "38px", textAlign: "center" }}>
                                {item.emoji}
                              </span>
                            )}

                            {/* Name + price */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p className="font-pixel" style={{ fontSize: "0.82rem", color: isItemOwned ? "#7FE8A0" : "#F2D091", fontWeight: 700 }}>
                                {item.name}
                              </p>
                              <p className="font-pixel" style={{ fontSize: "0.65rem", color: "#6a5888" }}>
                                🪙 {item.price} coins
                              </p>
                            </div>

                            {/* Buy / Owned */}
                            {isItemOwned ? (
                              <div style={{ flexShrink: 0, width: "26px", height: "26px", background: "#2ECC71", border: "2px solid #7FE8A0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "#1a1428", fontWeight: 900 }}>
                                ✓
                              </div>
                            ) : (
                              <button
                                onClick={() => handleBuy(item)}
                                disabled={!canAfford}
                                className="font-pixel"
                                style={{
                                  flexShrink: 0,
                                  background: bought
                                    ? "#2ECC71"
                                    : canAfford
                                      ? "linear-gradient(135deg, #1a6a3a, #2ECC71)"
                                      : "rgba(255,255,255,0.06)",
                                  border: `2px solid ${canAfford ? "#2ECC71" : "rgba(255,255,255,0.1)"}`,
                                  color: canAfford ? "#1a1428" : "#4a3860",
                                  fontSize: "0.65rem",
                                  padding: "6px 12px",
                                  cursor: canAfford ? "pointer" : "not-allowed",
                                  letterSpacing: "0.06em",
                                  fontWeight: 700,
                                  transition: "transform 0.1s",
                                  transform: bought ? "scale(1.05)" : undefined,
                                }}
                              >
                                {bought ? "BOUGHT!" : "BUY"}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{ padding: "10px 20px", borderTop: "2px solid rgba(46,204,113,0.2)", flexShrink: 0 }}>
              <p className="font-pixel" style={{ fontSize: "0.65rem", color: "#6a5888", textAlign: "center", letterSpacing: "0.08em" }}>
                {owned.size >= SHOP_ITEMS.length
                  ? "★ ALL ITEMS UNLOCKED — YOUR CHARACTER IS LEGENDARY ★"
                  : `${SHOP_ITEMS.length - owned.size} ITEMS TO UNLOCK · COMPLETE STORIES TO EARN COINS!`}
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shopPanelIn {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
