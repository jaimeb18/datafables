// Achievement icons — "Pixel Quest" style
// 16×16 viewBox · bold dark outline · highlight top-left · shadow bottom-right
// All icons are SVG — no external images needed

// ── Shared palette ──────────────────────────────────────────────────────────
const D   = "#1a1428"; // dark outline
// Gold
const GL  = "#F5E094"; const GM  = "#EAA624"; const GD  = "#9B6B0A";
// Blue
const BL  = "#8ECFFF"; const BM  = "#3A8FD9"; const BD  = "#1A4A8A";
// Red
const RL  = "#FF9999"; const RM  = "#D94040"; const RD  = "#8B1A1A";
// Emerald / green
const EL  = "#88E0A8"; const EM  = "#27AE60"; const ED  = "#0A5E28";
// Purple
const PL  = "#C09FD8"; const PM  = "#8E44AD"; const PD  = "#4A1060";
// Parchment / brown
const PRL = "#F0DBA0"; const PRM = "#C8A06A"; const PRD = "#7B5020";
// Stone / grey
const SL  = "#D8D8E8"; const SM  = "#9090A8"; const SD  = "#50506A";
// Orange
const OL  = "#FFD080"; const OM  = "#E88020"; const OD  = "#904010";

// ── first_story — open book, gold spine ─────────────────────────────────────
function BookOpenIcon() {
  return <>
    {/* Left page */}
    <rect x={1}  y={2}  width={6}  height={12} fill={PRL}/>
    <rect x={1}  y={2}  width={2}  height={12} fill={BM}/>   {/* blue cover strip */}
    <rect x={1}  y={2}  width={6}  height={1}  fill="#FFFAEE" opacity="0.8"/>
    {/* Lines */}
    <rect x={4}  y={4}  width={3}  height={1}  fill={PRD}/>
    <rect x={4}  y={6}  width={3}  height={1}  fill={PRD}/>
    <rect x={4}  y={8}  width={3}  height={1}  fill={PRD}/>
    <rect x={4}  y={10} width={2}  height={1}  fill={PRD}/>
    {/* Right page */}
    <rect x={9}  y={2}  width={6}  height={12} fill={PRL}/>
    <rect x={14} y={3}  width={1}  height={11} fill={PRM} opacity="0.5"/>
    <rect x={9}  y={2}  width={6}  height={1}  fill="#FFFAEE" opacity="0.5"/>
    {/* Lines */}
    <rect x={9}  y={4}  width={3}  height={1}  fill={PRD}/>
    <rect x={9}  y={6}  width={3}  height={1}  fill={PRD}/>
    <rect x={9}  y={8}  width={3}  height={1}  fill={PRD}/>
    <rect x={9}  y={10} width={2}  height={1}  fill={PRD}/>
    {/* Spine */}
    <rect x={7}  y={1}  width={2}  height={14} fill={GM}/>
    <rect x={7}  y={1}  width={1}  height={14} fill={GL}/>
    <rect x={8}  y={2}  width={1}  height={12} fill={GD}/>
    {/* Outline */}
    <rect x={0}  y={1}  width={16} height={1}  fill={D}/>
    <rect x={0}  y={14} width={16} height={1}  fill={D}/>
    <rect x={0}  y={1}  width={1}  height={13} fill={D}/>
    <rect x={15} y={1}  width={1}  height={13} fill={D}/>
    <rect x={7}  y={0}  width={2}  height={1}  fill={D}/>
    <rect x={7}  y={15} width={2}  height={1}  fill={D}/>
  </>;
}

// ── story_collector — three stacked books ────────────────────────────────────
function StackBooksIcon() {
  return <>
    {/* Bottom book — blue */}
    <rect x={0}  y={11} width={16} height={4}  fill={BM}/>
    <rect x={0}  y={11} width={3}  height={4}  fill={BD}/>
    <rect x={0}  y={11} width={16} height={1}  fill={BL}/>
    <rect x={0}  y={11} width={1}  height={3}  fill={BL} opacity="0.5"/>
    <rect x={14} y={12} width={2}  height={3}  fill={BD}/>
    <rect x={0}  y={11} width={16} height={1}  fill={D}/>
    <rect x={0}  y={15} width={16} height={1}  fill={D}/>
    <rect x={0}  y={11} width={1}  height={4}  fill={D}/>
    <rect x={15} y={11} width={1}  height={4}  fill={D}/>
    {/* Middle book — red */}
    <rect x={1}  y={6}  width={14} height={5}  fill={RM}/>
    <rect x={1}  y={6}  width={3}  height={5}  fill={RD}/>
    <rect x={1}  y={6}  width={14} height={1}  fill={RL}/>
    <rect x={1}  y={6}  width={1}  height={4}  fill={RL} opacity="0.5"/>
    <rect x={13} y={7}  width={2}  height={4}  fill={RD}/>
    <rect x={1}  y={6}  width={14} height={1}  fill={D}/>
    <rect x={1}  y={11} width={14} height={1}  fill={D}/>
    <rect x={1}  y={6}  width={1}  height={5}  fill={D}/>
    <rect x={14} y={6}  width={1}  height={5}  fill={D}/>
    {/* Top book — gold */}
    <rect x={3}  y={1}  width={10} height={5}  fill={GM}/>
    <rect x={3}  y={1}  width={2}  height={5}  fill={GD}/>
    <rect x={3}  y={1}  width={10} height={1}  fill={GL}/>
    <rect x={3}  y={1}  width={1}  height={4}  fill={GL} opacity="0.5"/>
    <rect x={11} y={2}  width={2}  height={4}  fill={GD}/>
    <rect x={3}  y={0}  width={10} height={1}  fill={D}/>
    <rect x={3}  y={6}  width={10} height={1}  fill={D}/>
    <rect x={3}  y={0}  width={1}  height={6}  fill={D}/>
    <rect x={12} y={0}  width={1}  height={6}  fill={D}/>
  </>;
}

// ── story_marathon — gold trophy ─────────────────────────────────────────────
function TrophyIcon() {
  return <>
    {/* Cup body */}
    <rect x={3}  y={0}  width={10} height={10} fill={GM}/>
    <rect x={2}  y={1}  width={12} height={8}  fill={GM}/>
    {/* Highlight */}
    <rect x={3}  y={0}  width={5}  height={6}  fill={GL}/>
    <rect x={2}  y={1}  width={3}  height={5}  fill={GL}/>
    {/* Shadow */}
    <rect x={10} y={2}  width={4}  height={8}  fill={GD}/>
    <rect x={8}  y={8}  width={4}  height={2}  fill={GD}/>
    {/* Handles */}
    <rect x={0}  y={2}  width={3}  height={6}  fill={GM}/>
    <rect x={0}  y={2}  width={1}  height={6}  fill={GL}/>
    <rect x={2}  y={7}  width={1}  height={1}  fill={GD}/>
    <rect x={13} y={2}  width={3}  height={6}  fill={GM}/>
    <rect x={15} y={3}  width={1}  height={5}  fill={GD}/>
    {/* Star emblem */}
    <rect x={7}  y={2}  width={2}  height={6}  fill="#FFF5CC"/>
    <rect x={5}  y={4}  width={6}  height={2}  fill="#FFF5CC"/>
    {/* Stem */}
    <rect x={7}  y={10} width={2}  height={3}  fill={PRM}/>
    {/* Base */}
    <rect x={4}  y={13} width={8}  height={2}  fill={PRM}/>
    <rect x={4}  y={13} width={8}  height={1}  fill={PRL}/>
    <rect x={3}  y={15} width={10} height={1}  fill={PRD}/>
    {/* Outline */}
    <rect x={2}  y={0}  width={12} height={1}  fill={D}/>
    <rect x={2}  y={10} width={12} height={1}  fill={D}/>
    <rect x={2}  y={0}  width={1}  height={10} fill={D}/>
    <rect x={13} y={0}  width={1}  height={10} fill={D}/>
    <rect x={0}  y={2}  width={3}  height={1}  fill={D}/>
    <rect x={0}  y={8}  width={3}  height={1}  fill={D}/>
    <rect x={0}  y={2}  width={1}  height={6}  fill={D}/>
    <rect x={13} y={2}  width={3}  height={1}  fill={D}/>
    <rect x={13} y={8}  width={3}  height={1}  fill={D}/>
    <rect x={15} y={2}  width={1}  height={6}  fill={D}/>
    <rect x={4}  y={13} width={8}  height={1}  fill={D}/>
    <rect x={3}  y={15} width={10} height={1}  fill={D}/>
    <rect x={4}  y={13} width={1}  height={2}  fill={D}/>
    <rect x={11} y={13} width={1}  height={2}  fill={D}/>
  </>;
}

// ── bookworm — friendly worm reading a book ──────────────────────────────────
function BookwormIcon() {
  return <>
    {/* Book */}
    <rect x={1}  y={8}  width={14} height={7}  fill={PRL}/>
    <rect x={1}  y={8}  width={2}  height={7}  fill={BM}/>
    <rect x={12} y={9}  width={2}  height={6}  fill={PRM} opacity="0.5"/>
    <rect x={1}  y={8}  width={14} height={1}  fill="#FFFAEE" opacity="0.7"/>
    {/* Book lines */}
    <rect x={4}  y={10} width={8}  height={1}  fill={PRD}/>
    <rect x={4}  y={12} width={8}  height={1}  fill={PRD}/>
    <rect x={4}  y={14} width={6}  height={1}  fill={PRD}/>
    {/* Book outline */}
    <rect x={0}  y={7}  width={16} height={1}  fill={D}/>
    <rect x={0}  y={15} width={16} height={1}  fill={D}/>
    <rect x={0}  y={7}  width={1}  height={8}  fill={D}/>
    <rect x={15} y={7}  width={1}  height={8}  fill={D}/>
    {/* Spine top */}
    <rect x={7}  y={7}  width={2}  height={9}  fill={GM}/>
    {/* Worm body */}
    <rect x={3}  y={2}  width={10} height={6}  fill={EM}/>
    <rect x={2}  y={3}  width={12} height={4}  fill={EM}/>
    <rect x={3}  y={2}  width={6}  height={3}  fill={EL}/>
    <rect x={2}  y={3}  width={4}  height={2}  fill={EL}/>
    <rect x={10} y={5}  width={4}  height={3}  fill={ED}/>
    {/* Worm eye */}
    <rect x={11} y={3}  width={2}  height={2}  fill={D}/>
    <rect x={11} y={3}  width={1}  height={1}  fill="#fff" opacity="0.8"/>
    {/* Worm smile */}
    <rect x={10} y={6}  width={1}  height={1}  fill={D}/>
    <rect x={11} y={7}  width={2}  height={1}  fill={D}/>
    <rect x={13} y={6}  width={1}  height={1}  fill={D}/>
    {/* Antennae */}
    <rect x={12} y={0}  width={1}  height={3}  fill={EM}/>
    <rect x={14} y={1}  width={1}  height={3}  fill={EM}/>
    <rect x={12} y={0}  width={2}  height={1}  fill={EL}/>
    {/* Worm outline */}
    <rect x={2}  y={2}  width={12} height={1}  fill={D}/>
    <rect x={2}  y={7}  width={7}  height={1}  fill={D}/>
    <rect x={9}  y={7}  width={5}  height={1}  fill={D}/>
    <rect x={2}  y={2}  width={1}  height={5}  fill={D}/>
    <rect x={13} y={2}  width={1}  height={5}  fill={D}/>
  </>;
}

// ── both_paths — glowing Y fork ──────────────────────────────────────────────
function ForkPathIcon() {
  return <>
    {/* Stem */}
    <rect x={6}  y={10} width={4}  height={6}  fill={GM}/>
    <rect x={6}  y={10} width={1}  height={6}  fill={GL}/>
    <rect x={9}  y={11} width={1}  height={5}  fill={GD}/>
    <rect x={6}  y={10} width={4}  height={1}  fill={D}/>
    <rect x={6}  y={15} width={4}  height={1}  fill={D}/>
    <rect x={6}  y={10} width={1}  height={6}  fill={D}/>
    <rect x={9}  y={10} width={1}  height={6}  fill={D}/>
    {/* Connector left */}
    <rect x={4}  y={5}  width={3}  height={6}  fill={GM}/>
    <rect x={4}  y={5}  width={1}  height={6}  fill={GL}/>
    <rect x={4}  y={5}  width={1}  height={1}  fill={D}/>
    <rect x={4}  y={10} width={3}  height={1}  fill={D}/>
    {/* Left branch */}
    <rect x={0}  y={1}  width={6}  height={5}  fill={GM}/>
    <rect x={0}  y={1}  width={3}  height={3}  fill={GL}/>
    <rect x={4}  y={4}  width={2}  height={2}  fill={GD}/>
    <rect x={0}  y={0}  width={7}  height={1}  fill={D}/>
    <rect x={0}  y={5}  width={5}  height={1}  fill={D}/>
    <rect x={0}  y={0}  width={1}  height={5}  fill={D}/>
    {/* Connector right */}
    <rect x={9}  y={5}  width={3}  height={6}  fill={GM}/>
    <rect x={9}  y={5}  width={1}  height={6}  fill={GL}/>
    <rect x={11} y={5}  width={1}  height={6}  fill={GD}/>
    <rect x={9}  y={5}  width={1}  height={1}  fill={D}/>
    <rect x={9}  y={10} width={3}  height={1}  fill={D}/>
    {/* Right branch */}
    <rect x={10} y={1}  width={6}  height={5}  fill={GM}/>
    <rect x={10} y={1}  width={3}  height={3}  fill={GL}/>
    <rect x={13} y={4}  width={3}  height={2}  fill={GD}/>
    <rect x={9}  y={0}  width={7}  height={1}  fill={D}/>
    <rect x={10} y={5}  width={5}  height={1}  fill={D}/>
    <rect x={15} y={0}  width={1}  height={5}  fill={D}/>
    {/* Checkmarks on tips */}
    <rect x={1}  y={3}  width={1}  height={1}  fill={D}/>
    <rect x={2}  y={4}  width={1}  height={1}  fill={D}/>
    <rect x={3}  y={3}  width={2}  height={1}  fill={D}/>
    <rect x={11} y={3}  width={1}  height={1}  fill={D}/>
    <rect x={12} y={4}  width={1}  height={1}  fill={D}/>
    <rect x={13} y={3}  width={2}  height={1}  fill={D}/>
  </>;
}

// ── path_explorer — compass ──────────────────────────────────────────────────
function CompassIcon() {
  return <>
    {/* Compass body */}
    <rect x={2}  y={2}  width={12} height={12} fill={SL}/>
    <rect x={3}  y={1}  width={10} height={14} fill={SL}/>
    <rect x={1}  y={3}  width={14} height={10} fill={SL}/>
    {/* Highlight */}
    <rect x={2}  y={2}  width={4}  height={5}  fill="#EEEEFF"/>
    <rect x={3}  y={1}  width={5}  height={4}  fill="#EEEEFF"/>
    {/* Shadow */}
    <rect x={11} y={6}  width={4}  height={8}  fill={SM}/>
    <rect x={7}  y={11} width={7}  height={4}  fill={SM}/>
    {/* Needle north — gold */}
    <rect x={7}  y={2}  width={2}  height={7}  fill={GM}/>
    <rect x={7}  y={2}  width={1}  height={4}  fill={GL}/>
    <rect x={8}  y={5}  width={1}  height={4}  fill={GD}/>
    {/* Needle south — dark */}
    <rect x={7}  y={9}  width={2}  height={5}  fill={SD}/>
    {/* Center pin */}
    <rect x={7}  y={7}  width={2}  height={2}  fill={D}/>
    {/* Cardinal marks */}
    <rect x={7}  y={1}  width={2}  height={1}  fill={GM}/>   {/* N */}
    <rect x={7}  y={14} width={2}  height={1}  fill={SD}/>   {/* S */}
    <rect x={1}  y={7}  width={1}  height={2}  fill={SM}/>   {/* W */}
    <rect x={14} y={7}  width={1}  height={2}  fill={SM}/>   {/* E */}
    {/* Outline */}
    <rect x={3}  y={1}  width={10} height={1}  fill={D}/>
    <rect x={3}  y={14} width={10} height={1}  fill={D}/>
    <rect x={1}  y={3}  width={1}  height={10} fill={D}/>
    <rect x={14} y={3}  width={1}  height={10} fill={D}/>
    <rect x={2}  y={2}  width={1}  height={1}  fill={D}/>
    <rect x={13} y={2}  width={1}  height={1}  fill={D}/>
    <rect x={2}  y={13} width={1}  height={1}  fill={D}/>
    <rect x={13} y={13} width={1}  height={1}  fill={D}/>
  </>;
}

// ── word_wizard — magic wand with star burst ─────────────────────────────────
function WandIcon() {
  return <>
    {/* Wand stick */}
    <rect x={8}  y={7}  width={2}  height={9}  fill={PRD}/>
    <rect x={8}  y={7}  width={1}  height={9}  fill={PRM}/>
    <rect x={9}  y={14} width={1}  height={2}  fill="#2a1a08"/>
    {/* Star burst — gold */}
    <rect x={5}  y={2}  width={6}  height={6}  fill={GM}/>
    <rect x={4}  y={3}  width={8}  height={4}  fill={GM}/>
    <rect x={6}  y={0}  width={4}  height={2}  fill={GM}/>
    <rect x={6}  y={8}  width={4}  height={2}  fill={GM}/>
    <rect x={3}  y={4}  width={2}  height={2}  fill={GM}/>
    <rect x={11} y={4}  width={2}  height={2}  fill={GM}/>
    {/* Star highlight */}
    <rect x={5}  y={2}  width={3}  height={3}  fill={GL}/>
    <rect x={6}  y={0}  width={2}  height={2}  fill={GL}/>
    <rect x={4}  y={3}  width={3}  height={2}  fill={GL}/>
    {/* Star shadow */}
    <rect x={9}  y={5}  width={3}  height={3}  fill={GD}/>
    <rect x={8}  y={8}  width={3}  height={2}  fill={GD}/>
    {/* Center shine */}
    <rect x={7}  y={3}  width={2}  height={2}  fill="#FFF8CC"/>
    {/* Sparkles */}
    <rect x={1}  y={1}  width={1}  height={1}  fill={GL}/>
    <rect x={14} y={2}  width={1}  height={1}  fill={GL}/>
    <rect x={0}  y={5}  width={1}  height={1}  fill={GM}/>
    <rect x={15} y={7}  width={1}  height={1}  fill={GM}/>
    <rect x={2}  y={9}  width={1}  height={1}  fill={GL}/>
    {/* Outline */}
    <rect x={6}  y={0}  width={4}  height={1}  fill={D}/>
    <rect x={4}  y={2}  width={2}  height={1}  fill={D}/>
    <rect x={10} y={2}  width={2}  height={1}  fill={D}/>
    <rect x={3}  y={4}  width={2}  height={1}  fill={D}/>
    <rect x={11} y={4}  width={2}  height={1}  fill={D}/>
    <rect x={3}  y={6}  width={2}  height={1}  fill={D}/>
    <rect x={11} y={6}  width={2}  height={1}  fill={D}/>
    <rect x={4}  y={8}  width={2}  height={1}  fill={D}/>
    <rect x={10} y={8}  width={2}  height={1}  fill={D}/>
    <rect x={6}  y={10} width={2}  height={1}  fill={D}/>
    <rect x={8}  y={10} width={2}  height={1}  fill={D}/>
    <rect x={3}  y={4}  width={1}  height={2}  fill={D}/>
    <rect x={12} y={4}  width={1}  height={2}  fill={D}/>
    <rect x={4}  y={2}  width={1}  height={2}  fill={D}/>
    <rect x={11} y={2}  width={1}  height={2}  fill={D}/>
    <rect x={4}  y={8}  width={1}  height={2}  fill={D}/>
    <rect x={11} y={8}  width={1}  height={2}  fill={D}/>
    <rect x={8}  y={15} width={2}  height={1}  fill={D}/>
    <rect x={8}  y={7}  width={1}  height={1}  fill={D}/>
    <rect x={9}  y={7}  width={1}  height={1}  fill={D}/>
  </>;
}

// ── vocab_master — graduation cap ────────────────────────────────────────────
function GradCapIcon() {
  return <>
    {/* Board brim */}
    <rect x={0}  y={6}  width={16} height={3}  fill={D}/>
    <rect x={0}  y={6}  width={16} height={1}  fill={SM}/>
    {/* Cap top */}
    <rect x={3}  y={1}  width={10} height={5}  fill={BM}/>
    <rect x={5}  y={0}  width={6}  height={2}  fill={BM}/>
    {/* Cap highlight */}
    <rect x={3}  y={1}  width={10} height={1}  fill={BL}/>
    <rect x={3}  y={1}  width={2}  height={4}  fill={BL}/>
    <rect x={5}  y={0}  width={6}  height={1}  fill={BL}/>
    {/* Cap shadow */}
    <rect x={11} y={2}  width={2}  height={4}  fill={BD}/>
    <rect x={3}  y={5}  width={10} height={1}  fill={BD}/>
    {/* Cap outline */}
    <rect x={3}  y={1}  width={10} height={1}  fill={D}/>
    <rect x={3}  y={6}  width={10} height={1}  fill={D}/>
    <rect x={3}  y={1}  width={1}  height={5}  fill={D}/>
    <rect x={12} y={1}  width={1}  height={5}  fill={D}/>
    <rect x={5}  y={0}  width={6}  height={1}  fill={D}/>
    {/* Diploma scroll */}
    <rect x={3}  y={9}  width={8}  height={5}  fill={GL}/>
    <rect x={3}  y={9}  width={8}  height={1}  fill="#FFFAEE"/>
    <rect x={3}  y={9}  width={1}  height={5}  fill="#FFFAEE"/>
    <rect x={10} y={10} width={1}  height={4}  fill={GD}/>
    <rect x={3}  y={13} width={8}  height={1}  fill={GD}/>
    {/* Red ribbon */}
    <rect x={6}  y={9}  width={2}  height={5}  fill={RM}/>
    <rect x={6}  y={9}  width={1}  height={5}  fill={RL}/>
    {/* Diploma outline */}
    <rect x={3}  y={9}  width={8}  height={1}  fill={D}/>
    <rect x={3}  y={14} width={8}  height={1}  fill={D}/>
    <rect x={3}  y={9}  width={1}  height={5}  fill={D}/>
    <rect x={10} y={9}  width={1}  height={5}  fill={D}/>
    {/* Tassel */}
    <rect x={13} y={6}  width={2}  height={6}  fill={GM}/>
    <rect x={13} y={12} width={3}  height={1}  fill={GM}/>
    <rect x={13} y={13} width={1}  height={3}  fill={GM}/>
    <rect x={15} y={13} width={1}  height={2}  fill={GD}/>
    <rect x={13} y={12} width={3}  height={1}  fill={GD}/>
  </>;
}

// ── deep_reader — book with magnifying glass ─────────────────────────────────
function BookMagIcon() {
  return <>
    {/* Book body */}
    <rect x={0}  y={3}  width={12} height={12} fill={PRL}/>
    <rect x={0}  y={3}  width={2}  height={12} fill={RM}/>
    <rect x={0}  y={3}  width={12} height={1}  fill="#FFFAEE" opacity="0.7"/>
    {/* Book lines */}
    <rect x={3}  y={5}  width={7}  height={1}  fill={PRD}/>
    <rect x={3}  y={7}  width={7}  height={1}  fill={PRD}/>
    <rect x={3}  y={9}  width={5}  height={1}  fill={PRD}/>
    <rect x={3}  y={11} width={7}  height={1}  fill={PRD}/>
    <rect x={3}  y={13} width={4}  height={1}  fill={PRD}/>
    {/* Book outline */}
    <rect x={0}  y={3}  width={12} height={1}  fill={D}/>
    <rect x={0}  y={15} width={12} height={1}  fill={D}/>
    <rect x={0}  y={3}  width={1}  height={12} fill={D}/>
    <rect x={11} y={3}  width={1}  height={12} fill={D}/>
    {/* Magnifying glass lens */}
    <rect x={7}  y={0}  width={7}  height={7}  fill={BM}/>
    <rect x={8}  y={0}  width={6}  height={6}  fill={BM}/>
    <rect x={6}  y={1}  width={9}  height={5}  fill={BM}/>
    <rect x={7}  y={0}  width={3}  height={3}  fill={BL}/>
    <rect x={7}  y={1}  width={2}  height={2}  fill="#D0EEFF"/>
    <rect x={11} y={3}  width={3}  height={4}  fill={BD}/>
    <rect x={9}  y={5}  width={4}  height={3}  fill={BD}/>
    {/* Lens outline */}
    <rect x={7}  y={0}  width={7}  height={1}  fill={D}/>
    <rect x={7}  y={7}  width={7}  height={1}  fill={D}/>
    <rect x={6}  y={1}  width={1}  height={6}  fill={D}/>
    <rect x={13} y={1}  width={1}  height={6}  fill={D}/>
    <rect x={7}  y={0}  width={1}  height={1}  fill={D}/>
    <rect x={13} y={0}  width={1}  height={1}  fill={D}/>
    {/* Handle */}
    <rect x={11} y={7}  width={2}  height={2}  fill={PRM}/>
    <rect x={12} y={8}  width={2}  height={2}  fill={PRM}/>
    <rect x={13} y={9}  width={2}  height={2}  fill={PRD}/>
    <rect x={14} y={10} width={2}  height={2}  fill={PRD}/>
    <rect x={13} y={9}  width={1}  height={1}  fill={D}/>
    <rect x={15} y={9}  width={1}  height={3}  fill={D}/>
    <rect x={13} y={11} width={3}  height={1}  fill={D}/>
  </>;
}

// ── fact_finder — glowing lightbulb ─────────────────────────────────────────
function BulbIcon() {
  return <>
    {/* Outer glow */}
    <rect x={4}  y={0}  width={8}  height={1}  fill={GL} opacity="0.4"/>
    <rect x={2}  y={1}  width={12} height={1}  fill={GL} opacity="0.3"/>
    <rect x={1}  y={2}  width={14} height={1}  fill={GL} opacity="0.2"/>
    {/* Dome fill */}
    <rect x={4}  y={1}  width={8}  height={1}  fill={GM}/>
    <rect x={2}  y={2}  width={12} height={8}  fill={GM}/>
    <rect x={3}  y={1}  width={10} height={9}  fill={GM}/>
    {/* Dome glow center */}
    <rect x={5}  y={2}  width={6}  height={6}  fill="#FFFDE0"/>
    <rect x={4}  y={3}  width={8}  height={5}  fill="#FFFDE0"/>
    <rect x={4}  y={2}  width={3}  height={3}  fill="#FFFFFF"/>
    {/* Dome highlight */}
    <rect x={4}  y={1}  width={4}  height={1}  fill={GL}/>
    {/* Dome shadow */}
    <rect x={11} y={3}  width={3}  height={7}  fill={GD}/>
    <rect x={9}  y={8}  width={4}  height={2}  fill={GD}/>
    {/* Filament */}
    <rect x={6}  y={4}  width={4}  height={1}  fill={GD}/>
    <rect x={7}  y={5}  width={2}  height={2}  fill={GD}/>
    {/* Dome outline */}
    <rect x={3}  y={0}  width={10} height={1}  fill={D}/>
    <rect x={2}  y={1}  width={1}  height={1}  fill={D}/>
    <rect x={13} y={1}  width={1}  height={1}  fill={D}/>
    <rect x={1}  y={2}  width={1}  height={8}  fill={D}/>
    <rect x={14} y={2}  width={1}  height={8}  fill={D}/>
    <rect x={2}  y={10} width={2}  height={1}  fill={D}/>
    <rect x={12} y={10} width={2}  height={1}  fill={D}/>
    <rect x={3}  y={11} width={1}  height={1}  fill={D}/>
    <rect x={12} y={11} width={1}  height={1}  fill={D}/>
    {/* Base stripes */}
    <rect x={4}  y={11} width={8}  height={1}  fill={SM}/>
    <rect x={4}  y={12} width={8}  height={1}  fill={SL}/>
    <rect x={4}  y={13} width={8}  height={1}  fill={SM}/>
    <rect x={4}  y={10} width={8}  height={1}  fill={D}/>
    <rect x={4}  y={14} width={8}  height={1}  fill={D}/>
    <rect x={4}  y={10} width={1}  height={4}  fill={D}/>
    <rect x={11} y={10} width={1}  height={4}  fill={D}/>
    {/* Cap */}
    <rect x={5}  y={14} width={6}  height={2}  fill={SD}/>
    <rect x={5}  y={14} width={6}  height={1}  fill={SM}/>
    <rect x={5}  y={14} width={1}  height={2}  fill={D}/>
    <rect x={10} y={14} width={1}  height={2}  fill={D}/>
    <rect x={5}  y={15} width={6}  height={1}  fill={D}/>
  </>;
}

// ── listener — headphones ────────────────────────────────────────────────────
function HeadphonesIcon() {
  return <>
    {/* Band */}
    <rect x={3}  y={0}  width={10} height={2}  fill={SD}/>
    <rect x={3}  y={0}  width={10} height={1}  fill={SM}/>
    <rect x={3}  y={0}  width={1}  height={1}  fill={SL}/>
    <rect x={1}  y={1}  width={2}  height={5}  fill={SD}/>
    <rect x={13} y={1}  width={2}  height={5}  fill={SD}/>
    <rect x={1}  y={1}  width={1}  height={5}  fill={SM}/>
    <rect x={14} y={2}  width={1}  height={4}  fill="#3a3a50"/>
    {/* Band outline */}
    <rect x={2}  y={0}  width={12} height={1}  fill={D}/>
    <rect x={1}  y={1}  width={1}  height={1}  fill={D}/>
    <rect x={14} y={1}  width={1}  height={1}  fill={D}/>
    <rect x={0}  y={2}  width={2}  height={5}  fill={D}/>
    <rect x={14} y={2}  width={2}  height={5}  fill={D}/>
    {/* Left cup */}
    <rect x={0}  y={6}  width={6}  height={8}  fill={BM}/>
    <rect x={0}  y={6}  width={3}  height={5}  fill={BL}/>
    <rect x={0}  y={6}  width={1}  height={8}  fill={BL}/>
    <rect x={4}  y={9}  width={2}  height={5}  fill={BD}/>
    <rect x={1}  y={12} width={5}  height={2}  fill={BD}/>
    {/* Grille lines */}
    <rect x={1}  y={9}  width={3}  height={1}  fill={BD}/>
    <rect x={1}  y={11} width={3}  height={1}  fill={BD}/>
    {/* Left cup outline */}
    <rect x={0}  y={6}  width={6}  height={1}  fill={D}/>
    <rect x={0}  y={14} width={6}  height={1}  fill={D}/>
    <rect x={0}  y={6}  width={1}  height={8}  fill={D}/>
    <rect x={5}  y={6}  width={1}  height={8}  fill={D}/>
    {/* Right cup */}
    <rect x={10} y={6}  width={6}  height={8}  fill={BM}/>
    <rect x={10} y={6}  width={3}  height={5}  fill={BL}/>
    <rect x={10} y={6}  width={1}  height={8}  fill={BL}/>
    <rect x={14} y={9}  width={2}  height={5}  fill={BD}/>
    <rect x={10} y={12} width={5}  height={2}  fill={BD}/>
    {/* Grille lines */}
    <rect x={11} y={9}  width={3}  height={1}  fill={BD}/>
    <rect x={11} y={11} width={3}  height={1}  fill={BD}/>
    {/* Right cup outline */}
    <rect x={10} y={6}  width={6}  height={1}  fill={D}/>
    <rect x={10} y={14} width={6}  height={1}  fill={D}/>
    <rect x={10} y={6}  width={1}  height={8}  fill={D}/>
    <rect x={15} y={6}  width={1}  height={8}  fill={D}/>
  </>;
}

// ── audio_fan — speaker with waves ───────────────────────────────────────────
function SpeakerIcon() {
  return <>
    {/* Speaker body */}
    <rect x={0}  y={5}  width={5}  height={6}  fill={SM}/>
    <rect x={0}  y={5}  width={2}  height={6}  fill={SL}/>
    <rect x={4}  y={6}  width={1}  height={4}  fill={SD}/>
    {/* Speaker cone */}
    <rect x={5}  y={3}  width={3}  height={10} fill={SD}/>
    <rect x={5}  y={4}  width={3}  height={8}  fill={SM}/>
    <rect x={5}  y={4}  width={1}  height={8}  fill={SL}/>
    {/* Speaker outline */}
    <rect x={0}  y={5}  width={5}  height={1}  fill={D}/>
    <rect x={0}  y={11} width={5}  height={1}  fill={D}/>
    <rect x={0}  y={5}  width={1}  height={6}  fill={D}/>
    <rect x={4}  y={5}  width={1}  height={1}  fill={D}/>
    <rect x={4}  y={11} width={1}  height={1}  fill={D}/>
    <rect x={5}  y={3}  width={3}  height={1}  fill={D}/>
    <rect x={5}  y={13} width={3}  height={1}  fill={D}/>
    <rect x={7}  y={4}  width={1}  height={9}  fill={D}/>
    {/* Wave 1 — close, small */}
    <rect x={9}  y={6}  width={1}  height={4}  fill={GM}/>
    <rect x={9}  y={5}  width={1}  height={1}  fill={GD}/>
    <rect x={9}  y={10} width={1}  height={1}  fill={GD}/>
    {/* Wave 2 — medium */}
    <rect x={11} y={5}  width={1}  height={6}  fill={GM}/>
    <rect x={11} y={4}  width={1}  height={1}  fill={GD}/>
    <rect x={11} y={11} width={1}  height={1}  fill={GD}/>
    {/* Wave 3 — large */}
    <rect x={13} y={3}  width={1}  height={10} fill={GM}/>
    <rect x={13} y={2}  width={1}  height={1}  fill={GD}/>
    <rect x={13} y={13} width={1}  height={1}  fill={GD}/>
    {/* Wave 4 — largest */}
    <rect x={15} y={2}  width={1}  height={12} fill={GL}/>
    <rect x={15} y={1}  width={1}  height={1}  fill={GD}/>
    <rect x={15} y={14} width={1}  height={1}  fill={GD}/>
  </>;
}

// ── pronunciation_star — big 5-point star ────────────────────────────────────
function StarIcon() {
  return <>
    {/* Star fill — five-point shape from rects */}
    <rect x={6}  y={0}  width={4}  height={6}  fill={GM}/>
    <rect x={0}  y={5}  width={16} height={5}  fill={GM}/>
    <rect x={2}  y={3}  width={4}  height={7}  fill={GM}/>
    <rect x={10} y={3}  width={4}  height={7}  fill={GM}/>
    <rect x={4}  y={9}  width={3}  height={6}  fill={GM}/>
    <rect x={9}  y={9}  width={3}  height={6}  fill={GM}/>
    {/* Highlights top-left quadrant */}
    <rect x={6}  y={0}  width={3}  height={4}  fill={GL}/>
    <rect x={0}  y={5}  width={5}  height={3}  fill={GL}/>
    <rect x={2}  y={3}  width={4}  height={4}  fill={GL}/>
    <rect x={4}  y={4}  width={5}  height={3}  fill={GL}/>
    {/* Shadow bottom-right */}
    <rect x={10} y={6}  width={5}  height={4}  fill={GD}/>
    <rect x={12} y={9}  width={3}  height={3}  fill={GD}/>
    <rect x={9}  y={11} width={2}  height={4}  fill={GD}/>
    {/* Inner shine */}
    <rect x={7}  y={5}  width={3}  height={3}  fill="#FFF8CC"/>
    {/* Smile detail */}
    <rect x={6}  y={7}  width={1}  height={1}  fill={D}/>
    <rect x={7}  y={8}  width={2}  height={1}  fill={D}/>
    <rect x={9}  y={7}  width={1}  height={1}  fill={D}/>
    {/* Outline */}
    <rect x={6}  y={0}  width={4}  height={1}  fill={D}/>
    <rect x={4}  y={1}  width={2}  height={1}  fill={D}/>
    <rect x={10} y={1}  width={2}  height={1}  fill={D}/>
    <rect x={3}  y={2}  width={1}  height={2}  fill={D}/>
    <rect x={12} y={2}  width={1}  height={2}  fill={D}/>
    <rect x={0}  y={5}  width={2}  height={1}  fill={D}/>
    <rect x={14} y={5}  width={2}  height={1}  fill={D}/>
    <rect x={0}  y={9}  width={2}  height={1}  fill={D}/>
    <rect x={14} y={9}  width={2}  height={1}  fill={D}/>
    <rect x={2}  y={10} width={1}  height={2}  fill={D}/>
    <rect x={13} y={10} width={1}  height={2}  fill={D}/>
    <rect x={4}  y={12} width={1}  height={2}  fill={D}/>
    <rect x={11} y={12} width={1}  height={2}  fill={D}/>
    <rect x={4}  y={14} width={3}  height={1}  fill={D}/>
    <rect x={9}  y={14} width={3}  height={1}  fill={D}/>
  </>;
}

// ── pronunciation_trio — three stars ─────────────────────────────────────────
function ThreeStarsIcon() {
  return <>
    {/* Center big star */}
    <rect x={5}  y={3}  width={6}  height={7}  fill={GM}/>
    <rect x={4}  y={5}  width={8}  height={3}  fill={GM}/>
    <rect x={6}  y={1}  width={4}  height={2}  fill={GM}/>
    <rect x={6}  y={10} width={4}  height={3}  fill={GM}/>
    <rect x={4}  y={7}  width={2}  height={3}  fill={GM}/>
    <rect x={10} y={7}  width={2}  height={3}  fill={GM}/>
    {/* Center highlight */}
    <rect x={5}  y={3}  width={3}  height={4}  fill={GL}/>
    <rect x={4}  y={5}  width={4}  height={2}  fill={GL}/>
    <rect x={6}  y={1}  width={2}  height={2}  fill={GL}/>
    {/* Center shadow */}
    <rect x={9}  y={6}  width={3}  height={4}  fill={GD}/>
    <rect x={8}  y={9}  width={3}  height={4}  fill={GD}/>
    {/* Center shine */}
    <rect x={7}  y={5}  width={2}  height={2}  fill="#FFF8CC"/>
    {/* Left small star */}
    <rect x={0}  y={8}  width={4}  height={4}  fill={GM}/>
    <rect x={1}  y={6}  width={2}  height={2}  fill={GM}/>
    <rect x={0}  y={10} width={2}  height={2}  fill={GM}/>
    <rect x={2}  y={12} width={2}  height={2}  fill={GM}/>
    <rect x={0}  y={8}  width={2}  height={2}  fill={GL}/>
    <rect x={1}  y={6}  width={1}  height={2}  fill={GL}/>
    <rect x={3}  y={10} width={1}  height={3}  fill={GD}/>
    {/* Right small star */}
    <rect x={12} y={7}  width={4}  height={4}  fill={GM}/>
    <rect x={13} y={5}  width={2}  height={2}  fill={GM}/>
    <rect x={12} y={9}  width={2}  height={2}  fill={GM}/>
    <rect x={14} y={11} width={2}  height={2}  fill={GM}/>
    <rect x={12} y={7}  width={2}  height={2}  fill={GL}/>
    <rect x={13} y={5}  width={1}  height={2}  fill={GL}/>
    <rect x={15} y={9}  width={1}  height={3}  fill={GD}/>
  </>;
}

// ── genre_picker — comedy mask ───────────────────────────────────────────────
function MaskIcon() {
  return <>
    {/* Mask face */}
    <rect x={1}  y={2}  width={14} height={11} fill={GM}/>
    <rect x={0}  y={3}  width={16} height={9}  fill={GM}/>
    <rect x={2}  y={1}  width={12} height={13} fill={GM}/>
    {/* Highlight */}
    <rect x={1}  y={2}  width={6}  height={6}  fill={GL}/>
    <rect x={2}  y={1}  width={6}  height={5}  fill={GL}/>
    {/* Shadow */}
    <rect x={10} y={5}  width={6}  height={8}  fill={GD}/>
    <rect x={8}  y={11} width={6}  height={3}  fill={GD}/>
    {/* Eyeholes */}
    <rect x={3}  y={5}  width={3}  height={3}  fill={D}/>
    <rect x={3}  y={5}  width={1}  height={1}  fill="#3a3060"/>
    <rect x={10} y={5}  width={3}  height={3}  fill={D}/>
    {/* Big smile */}
    <rect x={3}  y={10} width={1}  height={1}  fill={D}/>
    <rect x={4}  y={11} width={1}  height={1}  fill={D}/>
    <rect x={5}  y={12} width={6}  height={1}  fill={D}/>
    <rect x={11} y={11} width={1}  height={1}  fill={D}/>
    <rect x={12} y={10} width={1}  height={1}  fill={D}/>
    {/* Rosy cheeks */}
    <rect x={2}  y={8}  width={3}  height={2}  fill={RL} opacity="0.6"/>
    <rect x={11} y={8}  width={3}  height={2}  fill={RL} opacity="0.6"/>
    {/* Chin ribbon */}
    <rect x={6}  y={14} width={4}  height={1}  fill={RM}/>
    <rect x={5}  y={15} width={6}  height={1}  fill={RM}/>
    {/* Outline */}
    <rect x={2}  y={1}  width={12} height={1}  fill={D}/>
    <rect x={2}  y={13} width={12} height={1}  fill={D}/>
    <rect x={0}  y={3}  width={1}  height={9}  fill={D}/>
    <rect x={15} y={3}  width={1}  height={9}  fill={D}/>
    <rect x={1}  y={2}  width={1}  height={1}  fill={D}/>
    <rect x={14} y={2}  width={1}  height={1}  fill={D}/>
    <rect x={1}  y={12} width={1}  height={1}  fill={D}/>
    <rect x={14} y={12} width={1}  height={1}  fill={D}/>
  </>;
}

// ── all_genres — colorful film strip ─────────────────────────────────────────
function FilmStripIcon() {
  return <>
    {/* Strip base */}
    <rect x={0}  y={2}  width={16} height={12} fill={D}/>
    {/* Sprocket holes top */}
    <rect x={1}  y={3}  width={2}  height={2}  fill="#333344"/>
    <rect x={5}  y={3}  width={2}  height={2}  fill="#333344"/>
    <rect x={9}  y={3}  width={2}  height={2}  fill="#333344"/>
    <rect x={13} y={3}  width={2}  height={2}  fill="#333344"/>
    {/* Sprocket holes bottom */}
    <rect x={1}  y={11} width={2}  height={2}  fill="#333344"/>
    <rect x={5}  y={11} width={2}  height={2}  fill="#333344"/>
    <rect x={9}  y={11} width={2}  height={2}  fill="#333344"/>
    <rect x={13} y={11} width={2}  height={2}  fill="#333344"/>
    {/* Frame 1 — red/fantasy */}
    <rect x={0}  y={6}  width={4}  height={4}  fill={RM}/>
    <rect x={0}  y={6}  width={2}  height={2}  fill={RL}/>
    <rect x={2}  y={8}  width={2}  height={2}  fill={RD}/>
    {/* Frame 2 — gold/history */}
    <rect x={4}  y={6}  width={4}  height={4}  fill={GM}/>
    <rect x={4}  y={6}  width={2}  height={2}  fill={GL}/>
    <rect x={6}  y={8}  width={2}  height={2}  fill={GD}/>
    {/* Frame 3 — green/realistic */}
    <rect x={8}  y={6}  width={4}  height={4}  fill={EM}/>
    <rect x={8}  y={6}  width={2}  height={2}  fill={EL}/>
    <rect x={10} y={8}  width={2}  height={2}  fill={ED}/>
    {/* Frame 4 — blue/sci-fi */}
    <rect x={12} y={6}  width={4}  height={4}  fill={BM}/>
    <rect x={12} y={6}  width={2}  height={2}  fill={BL}/>
    <rect x={14} y={8}  width={2}  height={2}  fill={BD}/>
    {/* Strip top/bottom edges */}
    <rect x={0}  y={2}  width={16} height={1}  fill="#555566"/>
    <rect x={0}  y={13} width={16} height={1}  fill="#222233"/>
    <rect x={0}  y={0}  width={16} height={2}  fill={SM}/>
    <rect x={0}  y={14} width={16} height={2}  fill={SD}/>
    <rect x={0}  y={0}  width={16} height={1}  fill={SL}/>
  </>;
}

// ── character_designer — color palette ──────────────────────────────────────
function PaletteIcon() {
  return <>
    {/* Palette shape — oval */}
    <rect x={2}  y={1}  width={12} height={13} fill={PM}/>
    <rect x={1}  y={2}  width={14} height={11} fill={PM}/>
    <rect x={3}  y={0}  width={10} height={15} fill={PM}/>
    {/* Highlight */}
    <rect x={2}  y={1}  width={5}  height={7}  fill={PL}/>
    <rect x={3}  y={0}  width={6}  height={5}  fill={PL}/>
    {/* Shadow */}
    <rect x={10} y={6}  width={6}  height={9}  fill={PD}/>
    <rect x={8}  y={12} width={8}  height={4}  fill={PD}/>
    {/* Thumb hole */}
    <rect x={9}  y={9}  width={4}  height={4}  fill={D}/>
    <rect x={8}  y={10} width={6}  height={2}  fill={D}/>
    <rect x={9}  y={9}  width={4}  height={1}  fill="#2a1040"/>
    {/* Color dots — rainbow */}
    <rect x={4}  y={3}  width={3}  height={3}  fill={RM}/>
    <rect x={4}  y={3}  width={1}  height={1}  fill={RL}/>
    <rect x={8}  y={2}  width={3}  height={3}  fill={GM}/>
    <rect x={8}  y={2}  width={1}  height={1}  fill={GL}/>
    <rect x={3}  y={8}  width={3}  height={3}  fill={BM}/>
    <rect x={3}  y={8}  width={1}  height={1}  fill={BL}/>
    <rect x={3}  y={13} width={3}  height={2}  fill={EM}/>
    <rect x={4}  y={6}  width={2}  height={2}  fill={OL}/>
    {/* Dot outlines */}
    <rect x={4}  y={3}  width={3}  height={1}  fill={D}/>
    <rect x={4}  y={5}  width={3}  height={1}  fill={D}/>
    <rect x={4}  y={3}  width={1}  height={2}  fill={D}/>
    <rect x={6}  y={3}  width={1}  height={2}  fill={D}/>
    <rect x={8}  y={2}  width={3}  height={1}  fill={D}/>
    <rect x={8}  y={4}  width={3}  height={1}  fill={D}/>
    <rect x={3}  y={8}  width={3}  height={1}  fill={D}/>
    <rect x={3}  y={10} width={3}  height={1}  fill={D}/>
    <rect x={3}  y={8}  width={1}  height={2}  fill={D}/>
    <rect x={5}  y={8}  width={1}  height={2}  fill={D}/>
    {/* Palette outline */}
    <rect x={3}  y={0}  width={10} height={1}  fill={D}/>
    <rect x={3}  y={14} width={10} height={1}  fill={D}/>
    <rect x={1}  y={2}  width={1}  height={11} fill={D}/>
    <rect x={14} y={2}  width={1}  height={11} fill={D}/>
    <rect x={2}  y={1}  width={1}  height={1}  fill={D}/>
    <rect x={13} y={1}  width={1}  height={1}  fill={D}/>
    <rect x={2}  y={13} width={1}  height={1}  fill={D}/>
    <rect x={13} y={13} width={1}  height={1}  fill={D}/>
  </>;
}

// ── linguist — globe with stand ───────────────────────────────────────────────
function GlobeIcon() {
  return <>
    {/* Globe body */}
    <rect x={2}  y={1}  width={12} height={12} fill={BM}/>
    <rect x={1}  y={2}  width={14} height={10} fill={BM}/>
    <rect x={3}  y={0}  width={10} height={14} fill={BM}/>
    {/* Highlight */}
    <rect x={2}  y={1}  width={5}  height={6}  fill={BL}/>
    <rect x={3}  y={0}  width={5}  height={5}  fill={BL}/>
    <rect x={1}  y={2}  width={4}  height={5}  fill={BL}/>
    {/* Shadow */}
    <rect x={10} y={4}  width={6}  height={9}  fill={BD}/>
    <rect x={8}  y={10} width={6}  height={5}  fill={BD}/>
    {/* Meridian lines */}
    <rect x={7}  y={0}  width={2}  height={14} fill="#D0EEFF"/>
    <rect x={1}  y={6}  width={14} height={2}  fill="#D0EEFF"/>
    <rect x={3}  y={3}  width={10} height={1}  fill="#A8D4FF"/>
    <rect x={3}  y={10} width={10} height={1}  fill="#A8D4FF"/>
    {/* Outline */}
    <rect x={3}  y={0}  width={10} height={1}  fill={D}/>
    <rect x={3}  y={13} width={10} height={1}  fill={D}/>
    <rect x={1}  y={2}  width={1}  height={10} fill={D}/>
    <rect x={14} y={2}  width={1}  height={10} fill={D}/>
    <rect x={2}  y={1}  width={1}  height={1}  fill={D}/>
    <rect x={13} y={1}  width={1}  height={1}  fill={D}/>
    <rect x={2}  y={12} width={1}  height={1}  fill={D}/>
    <rect x={13} y={12} width={1}  height={1}  fill={D}/>
    {/* Stand */}
    <rect x={6}  y={13} width={4}  height={2}  fill={GD}/>
    <rect x={6}  y={13} width={4}  height={1}  fill={GM}/>
    <rect x={4}  y={15} width={8}  height={1}  fill={GD}/>
    <rect x={6}  y={13} width={1}  height={2}  fill={D}/>
    <rect x={9}  y={13} width={1}  height={2}  fill={D}/>
    <rect x={4}  y={15} width={8}  height={1}  fill={D}/>
  </>;
}

// ── world_traveler — suitcase ─────────────────────────────────────────────────
function SuitcaseIcon() {
  return <>
    {/* Handle */}
    <rect x={5}  y={0}  width={6}  height={3}  fill={PRD}/>
    <rect x={5}  y={0}  width={6}  height={1}  fill={PRM}/>
    <rect x={5}  y={0}  width={1}  height={3}  fill={PRM}/>
    <rect x={4}  y={0}  width={8}  height={1}  fill={D}/>
    <rect x={4}  y={3}  width={8}  height={1}  fill={D}/>
    <rect x={4}  y={0}  width={1}  height={3}  fill={D}/>
    <rect x={11} y={0}  width={1}  height={3}  fill={D}/>
    {/* Case body */}
    <rect x={1}  y={3}  width={14} height={12} fill={PRM}/>
    <rect x={1}  y={3}  width={5}  height={8}  fill={PRL}/>
    <rect x={1}  y={3}  width={2}  height={12} fill={PRL}/>
    <rect x={12} y={5}  width={3}  height={10} fill={PRD}/>
    <rect x={5}  y={13} width={10} height={2}  fill={PRD}/>
    {/* Clasp strip */}
    <rect x={1}  y={9}  width={14} height={2}  fill={GM}/>
    <rect x={1}  y={9}  width={14} height={1}  fill={GL}/>
    {/* Clasp buckle */}
    <rect x={6}  y={8}  width={4}  height={4}  fill={GD}/>
    <rect x={7}  y={9}  width={2}  height={2}  fill={GL}/>
    {/* Sticker */}
    <rect x={9}  y={5}  width={5}  height={3}  fill={RM}/>
    <rect x={9}  y={5}  width={5}  height={1}  fill={RL}/>
    <rect x={9}  y={5}  width={1}  height={3}  fill={RL}/>
    {/* Case outline */}
    <rect x={0}  y={3}  width={16} height={1}  fill={D}/>
    <rect x={0}  y={15} width={16} height={1}  fill={D}/>
    <rect x={0}  y={3}  width={1}  height={12} fill={D}/>
    <rect x={15} y={3}  width={1}  height={12} fill={D}/>
    <rect x={1}  y={9}  width={14} height={1}  fill={D}/>
    <rect x={1}  y={11} width={14} height={1}  fill={D}/>
    <rect x={6}  y={8}  width={4}  height={1}  fill={D}/>
    <rect x={6}  y={12} width={4}  height={1}  fill={D}/>
    <rect x={6}  y={8}  width={1}  height={4}  fill={D}/>
    <rect x={9}  y={8}  width={1}  height={4}  fill={D}/>
  </>;
}

// ── fantasy_fan — castle ──────────────────────────────────────────────────────
function CastleIcon() {
  return <>
    {/* Left tower */}
    <rect x={0}  y={5}  width={4}  height={11} fill={SM}/>
    <rect x={0}  y={5}  width={1}  height={11} fill={SL}/>
    <rect x={3}  y={6}  width={1}  height={10} fill={SD}/>
    <rect x={0}  y={3}  width={1}  height={2}  fill={SM}/>
    <rect x={2}  y={3}  width={2}  height={2}  fill={SM}/>
    <rect x={0}  y={3}  width={1}  height={1}  fill={SL}/>
    <rect x={2}  y={3}  width={1}  height={1}  fill={SL}/>
    {/* Left window */}
    <rect x={1}  y={7}  width={2}  height={3}  fill={BD}/>
    <rect x={1}  y={7}  width={1}  height={1}  fill={BL} opacity="0.6"/>
    {/* Right tower */}
    <rect x={12} y={5}  width={4}  height={11} fill={SM}/>
    <rect x={12} y={5}  width={1}  height={11} fill={SL}/>
    <rect x={15} y={6}  width={1}  height={10} fill={SD}/>
    <rect x={12} y={3}  width={2}  height={2}  fill={SM}/>
    <rect x={15} y={3}  width={1}  height={2}  fill={SM}/>
    <rect x={12} y={3}  width={1}  height={1}  fill={SL}/>
    {/* Right window */}
    <rect x={13} y={7}  width={2}  height={3}  fill={BD}/>
    <rect x={13} y={7}  width={1}  height={1}  fill={BL} opacity="0.6"/>
    {/* Main wall */}
    <rect x={4}  y={7}  width={8}  height={9}  fill={SL}/>
    <rect x={4}  y={7}  width={2}  height={9}  fill="#DDDDEF"/>
    <rect x={10} y={8}  width={2}  height={8}  fill={SM}/>
    <rect x={4}  y={5}  width={2}  height={2}  fill={SL}/>
    <rect x={7}  y={5}  width={2}  height={2}  fill={SL}/>
    <rect x={10} y={5}  width={2}  height={2}  fill={SL}/>
    {/* Gate arch */}
    <rect x={6}  y={11} width={4}  height={5}  fill={D}/>
    <rect x={5}  y={12} width={6}  height={4}  fill={D}/>
    <rect x={5}  y={11} width={1}  height={1}  fill={D}/>
    <rect x={10} y={11} width={1}  height={1}  fill={D}/>
    <rect x={6}  y={13} width={1}  height={3}  fill="#2a2a40"/>
    <rect x={9}  y={13} width={1}  height={3}  fill="#2a2a40"/>
    {/* Flag */}
    <rect x={7}  y={0}  width={1}  height={5}  fill={D}/>
    <rect x={8}  y={0}  width={4}  height={3}  fill={RM}/>
    <rect x={8}  y={0}  width={4}  height={1}  fill={RL}/>
    {/* Tower outlines */}
    <rect x={0}  y={3}  width={4}  height={1}  fill={D}/>
    <rect x={0}  y={16} width={4}  height={1}  fill={D}/>
    <rect x={0}  y={3}  width={1}  height={13} fill={D}/>
    <rect x={3}  y={3}  width={1}  height={2}  fill={D}/>
    <rect x={3}  y={5}  width={1}  height={12} fill={D}/>
    <rect x={12} y={3}  width={4}  height={1}  fill={D}/>
    <rect x={12} y={16} width={4}  height={1}  fill={D}/>
    <rect x={15} y={3}  width={1}  height={13} fill={D}/>
    <rect x={12} y={3}  width={1}  height={2}  fill={D}/>
    <rect x={12} y={5}  width={1}  height={12} fill={D}/>
    {/* Wall outline */}
    <rect x={4}  y={7}  width={8}  height={1}  fill={D}/>
    <rect x={4}  y={16} width={8}  height={1}  fill={D}/>
    <rect x={4}  y={7}  width={1}  height={9}  fill={D}/>
    <rect x={11} y={7}  width={1}  height={9}  fill={D}/>
  </>;
}

// ── sci_fi_fan — rocket ────────────────────────────────────────────────────────
function RocketIcon() {
  return <>
    {/* Body */}
    <rect x={5}  y={3}  width={6}  height={9}  fill={SL}/>
    <rect x={4}  y={4}  width={8}  height={7}  fill={SL}/>
    <rect x={4}  y={4}  width={3}  height={6}  fill="#EEEEFF"/>
    <rect x={9}  y={5}  width={3}  height={6}  fill={SM}/>
    {/* Nose cone */}
    <rect x={6}  y={1}  width={4}  height={2}  fill={RM}/>
    <rect x={7}  y={0}  width={2}  height={1}  fill={RM}/>
    <rect x={6}  y={1}  width={2}  height={1}  fill={RL}/>
    <rect x={9}  y={2}  width={1}  height={1}  fill={RD}/>
    {/* Porthole */}
    <rect x={6}  y={5}  width={4}  height={4}  fill={BM}/>
    <rect x={7}  y={4}  width={2}  height={6}  fill={BM}/>
    <rect x={6}  y={5}  width={2}  height={2}  fill={BL}/>
    <rect x={8}  y={7}  width={2}  height={2}  fill={BD}/>
    {/* Fins */}
    <rect x={2}  y={8}  width={3}  height={5}  fill={RM}/>
    <rect x={2}  y={8}  width={1}  height={5}  fill={RL}/>
    <rect x={4}  y={12} width={1}  height={1}  fill={RD}/>
    <rect x={11} y={8}  width={3}  height={5}  fill={RM}/>
    <rect x={13} y={8}  width={1}  height={5}  fill={RD}/>
    {/* Flame */}
    <rect x={5}  y={13} width={6}  height={1}  fill={SM}/>
    <rect x={5}  y={14} width={6}  height={1}  fill={GM}/>
    <rect x={6}  y={15} width={4}  height={1}  fill={GL}/>
    <rect x={7}  y={16} width={2}  height={1}  fill="#FFFACC"/>
    {/* Outline */}
    <rect x={6}  y={0}  width={4}  height={1}  fill={D}/>
    <rect x={5}  y={1}  width={1}  height={1}  fill={D}/>
    <rect x={10} y={1}  width={1}  height={1}  fill={D}/>
    <rect x={4}  y={2}  width={1}  height={11} fill={D}/>
    <rect x={11} y={2}  width={1}  height={11} fill={D}/>
    <rect x={2}  y={8}  width={1}  height={6}  fill={D}/>
    <rect x={13} y={8}  width={1}  height={6}  fill={D}/>
    <rect x={2}  y={13} width={3}  height={1}  fill={D}/>
    <rect x={11} y={13} width={3}  height={1}  fill={D}/>
    <rect x={2}  y={8}  width={3}  height={1}  fill={D}/>
    <rect x={11} y={8}  width={3}  height={1}  fill={D}/>
  </>;
}

// ── mystery_fan — magnifying glass ────────────────────────────────────────────
function MagnifyIcon() {
  return <>
    {/* Lens fill */}
    <rect x={1}  y={1}  width={10} height={10} fill={BM}/>
    <rect x={0}  y={2}  width={12} height={8}  fill={BM}/>
    <rect x={2}  y={0}  width={8}  height={12} fill={BM}/>
    {/* Highlight */}
    <rect x={1}  y={1}  width={4}  height={6}  fill={BL}/>
    <rect x={2}  y={0}  width={5}  height={4}  fill={BL}/>
    <rect x={1}  y={1}  width={2}  height={2}  fill="#D0EEFF"/>
    {/* Shadow */}
    <rect x={8}  y={4}  width={4}  height={8}  fill={BD}/>
    <rect x={5}  y={8}  width={6}  height={4}  fill={BD}/>
    {/* Question mark */}
    <rect x={4}  y={3}  width={4}  height={1}  fill="#FFFAEE"/>
    <rect x={7}  y={4}  width={1}  height={2}  fill="#FFFAEE"/>
    <rect x={5}  y={6}  width={2}  height={1}  fill="#FFFAEE"/>
    <rect x={5}  y={8}  width={2}  height={1}  fill="#FFFAEE"/>
    {/* Lens outline */}
    <rect x={2}  y={0}  width={8}  height={1}  fill={D}/>
    <rect x={2}  y={11} width={8}  height={1}  fill={D}/>
    <rect x={0}  y={2}  width={1}  height={8}  fill={D}/>
    <rect x={11} y={2}  width={1}  height={8}  fill={D}/>
    <rect x={1}  y={1}  width={1}  height={1}  fill={D}/>
    <rect x={10} y={1}  width={1}  height={1}  fill={D}/>
    <rect x={1}  y={10} width={1}  height={1}  fill={D}/>
    <rect x={10} y={10} width={1}  height={1}  fill={D}/>
    {/* Handle */}
    <rect x={10} y={10} width={2}  height={2}  fill={PRD}/>
    <rect x={11} y={11} width={2}  height={2}  fill={PRD}/>
    <rect x={12} y={12} width={2}  height={2}  fill={PRD}/>
    <rect x={13} y={13} width={3}  height={3}  fill={PRM}/>
    <rect x={13} y={13} width={1}  height={1}  fill={PRL}/>
    <rect x={15} y={13} width={1}  height={3}  fill={D}/>
    <rect x={13} y={15} width={3}  height={1}  fill={D}/>
  </>;
}

// ── history_fan — parchment scroll ───────────────────────────────────────────
function ScrollIcon() {
  return <>
    {/* Scroll body */}
    <rect x={2}  y={3}  width={12} height={10} fill={PRL}/>
    <rect x={1}  y={4}  width={14} height={8}  fill={PRL}/>
    {/* Scroll roll top */}
    <rect x={0}  y={1}  width={16} height={3}  fill={PRM}/>
    <rect x={1}  y={0}  width={14} height={1}  fill={PRM}/>
    <rect x={0}  y={1}  width={16} height={1}  fill={PRL}/>
    <rect x={1}  y={0}  width={14} height={1}  fill={PRL}/>
    <rect x={2}  y={3}  width={12} height={1}  fill={PRD}/>
    {/* Scroll roll bottom */}
    <rect x={0}  y={12} width={16} height={3}  fill={PRM}/>
    <rect x={1}  y={15} width={14} height={1}  fill={PRM}/>
    <rect x={0}  y={12} width={16} height={1}  fill={PRL}/>
    <rect x={2}  y={13} width={12} height={1}  fill={PRD}/>
    {/* Text lines */}
    <rect x={3}  y={5}  width={10} height={1}  fill={PRD}/>
    <rect x={3}  y={7}  width={10} height={1}  fill={PRD}/>
    <rect x={3}  y={9}  width={10} height={1}  fill={PRD}/>
    <rect x={3}  y={11} width={6}  height={1}  fill={PRD}/>
    {/* Wax seal */}
    <rect x={10} y={9}  width={4}  height={4}  fill={RM}/>
    <rect x={9}  y={10} width={6}  height={2}  fill={RM}/>
    <rect x={10} y={9}  width={2}  height={1}  fill={RL}/>
    <rect x={10} y={9}  width={1}  height={4}  fill={RL}/>
    <rect x={13} y={10} width={1}  height={3}  fill={RD}/>
    <rect x={11} y={11} width={2}  height={1}  fill={GL}/>
    {/* Outline */}
    <rect x={1}  y={0}  width={14} height={1}  fill={D}/>
    <rect x={1}  y={15} width={14} height={1}  fill={D}/>
    <rect x={0}  y={1}  width={1}  height={14} fill={D}/>
    <rect x={15} y={1}  width={1}  height={14} fill={D}/>
    <rect x={2}  y={3}  width={12} height={1}  fill={D}/>
    <rect x={2}  y={13} width={12} height={1}  fill={D}/>
  </>;
}

// ── poet — feather quill ──────────────────────────────────────────────────────
function QuillIcon() {
  return <>
    {/* Feather shaft diagonal */}
    <rect x={12} y={0}  width={3}  height={3}  fill="#F8F8F0"/>
    <rect x={10} y={1}  width={4}  height={4}  fill="#F0F0E8"/>
    <rect x={8}  y={3}  width={4}  height={4}  fill="#E0E0D0"/>
    <rect x={6}  y={5}  width={4}  height={4}  fill="#D0D0C0"/>
    <rect x={4}  y={7}  width={4}  height={4}  fill="#C0C0A8"/>
    <rect x={2}  y={9}  width={4}  height={4}  fill="#A8A888"/>
    {/* Feather highlight */}
    <rect x={12} y={0}  width={2}  height={2}  fill="#FFFFFF"/>
    <rect x={10} y={2}  width={2}  height={2}  fill="#FAFAF5"/>
    <rect x={8}  y={4}  width={2}  height={2}  fill="#F0F0E8"/>
    {/* Feather barbs */}
    <rect x={11} y={1}  width={3}  height={1}  fill="#D8D8C0"/>
    <rect x={9}  y={3}  width={3}  height={1}  fill="#C8C8B0"/>
    <rect x={7}  y={5}  width={3}  height={1}  fill="#B8B898"/>
    <rect x={5}  y={7}  width={3}  height={1}  fill="#A8A880"/>
    <rect x={9}  y={5}  width={3}  height={1}  fill="#C8C8A8"/>
    <rect x={7}  y={7}  width={3}  height={1}  fill="#B8B890"/>
    {/* Quill tip / nib */}
    <rect x={1}  y={12} width={3}  height={3}  fill={PRD}/>
    <rect x={0}  y={13} width={3}  height={3}  fill={"#5a3010"}/>
    <rect x={1}  y={12} width={1}  height={2}  fill={PRM}/>
    {/* Ink drop & writing */}
    <rect x={0}  y={15} width={2}  height={1}  fill={BM}/>
    <rect x={1}  y={14} width={1}  height={2}  fill={BM}/>
    <rect x={0}  y={11} width={5}  height={1}  fill={BM}/>
    <rect x={0}  y={13} width={4}  height={1}  fill={BL}/>
  </>;
}

// ── realist — warm house ───────────────────────────────────────────────────────
function HouseIcon() {
  return <>
    {/* Chimney */}
    <rect x={10} y={0}  width={3}  height={4}  fill={SM}/>
    <rect x={10} y={0}  width={1}  height={4}  fill={SL}/>
    <rect x={12} y={1}  width={1}  height={3}  fill={SD}/>
    <rect x={9}  y={0}  width={5}  height={1}  fill={D}/>
    {/* Roof */}
    <rect x={7}  y={1}  width={2}  height={1}  fill={RM}/>
    <rect x={5}  y={2}  width={6}  height={1}  fill={RM}/>
    <rect x={3}  y={3}  width={10} height={1}  fill={RM}/>
    <rect x={1}  y={4}  width={14} height={2}  fill={RM}/>
    {/* Roof highlights */}
    <rect x={7}  y={1}  width={1}  height={1}  fill={RL}/>
    <rect x={5}  y={2}  width={2}  height={1}  fill={RL}/>
    <rect x={3}  y={3}  width={4}  height={1}  fill={RL}/>
    <rect x={1}  y={4}  width={5}  height={1}  fill={RL}/>
    {/* Roof shadows */}
    <rect x={12} y={3}  width={1}  height={1}  fill={RD}/>
    <rect x={12} y={4}  width={3}  height={2}  fill={RD}/>
    {/* Wall */}
    <rect x={1}  y={6}  width={14} height={10} fill={OL}/>
    <rect x={1}  y={6}  width={3}  height={10} fill="#FFE0A0"/>
    <rect x={12} y={7}  width={3}  height={9}  fill={OM}/>
    {/* Left window */}
    <rect x={2}  y={8}  width={4}  height={4}  fill={BM}/>
    <rect x={2}  y={8}  width={2}  height={2}  fill={BL}/>
    <rect x={4}  y={10} width={2}  height={2}  fill={BD}/>
    <rect x={4}  y={8}  width={1}  height={4}  fill={D}/>
    <rect x={2}  y={10} width={4}  height={1}  fill={D}/>
    <rect x={2}  y={8}  width={4}  height={1}  fill={D}/>
    <rect x={2}  y={12} width={4}  height={1}  fill={D}/>
    <rect x={2}  y={8}  width={1}  height={4}  fill={D}/>
    <rect x={5}  y={8}  width={1}  height={4}  fill={D}/>
    {/* Right window */}
    <rect x={10} y={8}  width={4}  height={4}  fill={BM}/>
    <rect x={10} y={8}  width={2}  height={2}  fill={BL}/>
    <rect x={12} y={10} width={2}  height={2}  fill={BD}/>
    <rect x={12} y={8}  width={1}  height={4}  fill={D}/>
    <rect x={10} y={10} width={4}  height={1}  fill={D}/>
    <rect x={10} y={8}  width={4}  height={1}  fill={D}/>
    <rect x={10} y={12} width={4}  height={1}  fill={D}/>
    <rect x={10} y={8}  width={1}  height={4}  fill={D}/>
    <rect x={13} y={8}  width={1}  height={4}  fill={D}/>
    {/* Door */}
    <rect x={6}  y={10} width={4}  height={6}  fill={PRD}/>
    <rect x={6}  y={10} width={1}  height={6}  fill={PRM}/>
    <rect x={9}  y={11} width={1}  height={5}  fill="#3a1a08"/>
    <rect x={7}  y={12} width={1}  height={1}  fill={GM}/>
    {/* Wall outline */}
    <rect x={1}  y={6}  width={14} height={1}  fill={D}/>
    <rect x={1}  y={16} width={14} height={1}  fill={D}/>
    <rect x={1}  y={6}  width={1}  height={10} fill={D}/>
    <rect x={14} y={6}  width={1}  height={10} fill={D}/>
    <rect x={6}  y={10} width={4}  height={1}  fill={D}/>
    <rect x={6}  y={10} width={1}  height={6}  fill={D}/>
    <rect x={9}  y={10} width={1}  height={6}  fill={D}/>
  </>;
}

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  first_story:        <BookOpenIcon />,
  bookworm:           <BookwormIcon />,
  story_collector:    <StackBooksIcon />,
  story_marathon:     <TrophyIcon />,
  both_paths:         <ForkPathIcon />,
  path_explorer:      <CompassIcon />,
  word_wizard:        <WandIcon />,
  vocab_master:       <GradCapIcon />,
  deep_reader:        <BookMagIcon />,
  fact_finder:        <BulbIcon />,
  listener:           <HeadphonesIcon />,
  audio_fan:          <SpeakerIcon />,
  pronunciation_star: <StarIcon />,
  pronunciation_trio: <ThreeStarsIcon />,
  genre_picker:       <MaskIcon />,
  all_genres:         <FilmStripIcon />,
  character_designer: <PaletteIcon />,
  linguist:           <GlobeIcon />,
  world_traveler:     <SuitcaseIcon />,
  fantasy_fan:        <CastleIcon />,
  sci_fi_fan:         <RocketIcon />,
  mystery_fan:        <MagnifyIcon />,
  history_fan:        <ScrollIcon />,
  poet:               <QuillIcon />,
  realist:            <HouseIcon />,
};

// ── Main export ───────────────────────────────────────────────────────────────
export default function AchievementIcon({
  id,
  size = 32,
  dim = false,
}: {
  id: string;
  size?: number;
  dim?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      style={{
        imageRendering: "pixelated",
        display: "block",
        filter: dim ? "grayscale(1) brightness(0.4)" : undefined,
      }}
    >
      {ICON_MAP[id] ?? null}
    </svg>
  );
}
