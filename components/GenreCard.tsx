"use client";

import React from "react";

interface GenreCardProps {
  genre: string;
  description: string;
  sprite: React.ReactNode;
  onClick: () => void;
  selected?: boolean;
}

export default function GenreCard({ genre, description, sprite, onClick, selected = false }: GenreCardProps) {
  return (
    <button
      onClick={onClick}
      className="pixel-card genre-card flex flex-col items-center gap-3 p-4 pb-6 w-full text-left"
      type="button"
      style={selected ? { background: "var(--pixel-card-alt)" } : undefined}
    >
      {/* Pixel art sprite — fixed-height box so all images align */}
      <div
        className="flex items-center justify-center w-full pt-1"
        style={{ height: "160px" }}
      >
        {sprite}
      </div>

      {/* Genre name */}
      <p className="font-pixel text-center" style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--pixel-dark)", lineHeight: 1.3 }}>
        {genre}
      </p>

      {/* Description with heart bullet */}
      <p className="text-sm text-center font-semibold" style={{ color: "var(--pixel-dark)", opacity: 0.75, lineHeight: 1.5 }}>
        <span style={{ color: "var(--pixel-btn-shadow)" }}>♥ </span>
        {description}
      </p>
    </button>
  );
}
