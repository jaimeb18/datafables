import { spendCoins } from "./achievements";

export interface ShopItem {
  id: string;
  name: string;
  category: "hair_color" | "hair_style" | "accessory";
  price: number;
  /** The string value added to character designer options when owned */
  value: string;
  emoji?: string;
  /** Hex color for hair color items */
  color?: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  // ── Unlockable Hair Colors ───────────────────────────────────────────────
  { id: "hair_pink",    name: "Pink",     category: "hair_color", price: 30, value: "Pink",     color: "#FF69B4" },
  { id: "hair_blue",    name: "Sky Blue", category: "hair_color", price: 30, value: "Sky Blue", color: "#4A90D9" },
  { id: "hair_emerald", name: "Emerald",  category: "hair_color", price: 30, value: "Emerald",  color: "#27AE60" },
  { id: "hair_violet",  name: "Violet",   category: "hair_color", price: 30, value: "Violet",   color: "#9B59B6" },
  { id: "hair_silver",  name: "Silver",   category: "hair_color", price: 40, value: "Silver",   color: "#A0A0B8" },
  { id: "hair_rainbow", name: "Rainbow",  category: "hair_color", price: 80, value: "Rainbow",  color: "#FF69B4" },
  // ── Unlockable Hair Styles ───────────────────────────────────────────────
  { id: "style_undercut",   name: "Undercut",   category: "hair_style", price: 35, value: "Undercut",   emoji: "✂️" },
  { id: "style_dreadlocks", name: "Dreadlocks", category: "hair_style", price: 35, value: "Dreadlocks", emoji: "🌿" },
  { id: "style_spacebuns",  name: "Space Buns", category: "hair_style", price: 40, value: "Space Buns", emoji: "🪐" },
  { id: "style_cornrows",   name: "Cornrows",   category: "hair_style", price: 35, value: "Cornrows",   emoji: "🪢" },
  // ── Unlockable Accessories ───────────────────────────────────────────────
  { id: "acc_sword",  name: "Sword",      category: "accessory", price: 50,  value: "Sword",  emoji: "⚔️" },
  { id: "acc_shield", name: "Shield",     category: "accessory", price: 50,  value: "Shield", emoji: "🛡️" },
  { id: "acc_wings",  name: "Wings",      category: "accessory", price: 60,  value: "Wings",  emoji: "🪽" },
  { id: "acc_crown",  name: "Crown",      category: "accessory", price: 70,  value: "Crown",  emoji: "👑" },
  { id: "acc_wand",   name: "Magic Wand", category: "accessory", price: 45,  value: "Wand",   emoji: "🪄" },
  { id: "acc_dragon", name: "Dragon Pet", category: "accessory", price: 100, value: "Dragon", emoji: "🐉" },
];

const KEY_OWNED = "datafables_shop_owned";

function loadOwned(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(KEY_OWNED);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch { return new Set(); }
}

function saveOwned(owned: Set<string>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY_OWNED, JSON.stringify([...owned]));
}

export function getOwnedItemIds(): Set<string> {
  return loadOwned();
}

export function isOwned(id: string): boolean {
  return loadOwned().has(id);
}

export function getOwnedItems(): ShopItem[] {
  const owned = loadOwned();
  return SHOP_ITEMS.filter((item) => owned.has(item.id));
}

/**
 * Attempt to purchase a shop item. Deducts coins if successful.
 * Returns { success: true } or { success: false, reason: string }.
 */
export function purchaseItem(id: string): { success: boolean; reason?: string } {
  const item = SHOP_ITEMS.find((i) => i.id === id);
  if (!item) return { success: false, reason: "Item not found" };

  const owned = loadOwned();
  if (owned.has(id)) return { success: false, reason: "Already owned" };

  const spent = spendCoins(item.price);
  if (!spent) return { success: false, reason: "Not enough coins" };

  owned.add(id);
  saveOwned(owned);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("datafables:coins"));
    window.dispatchEvent(new CustomEvent("datafables:shop_purchase", { detail: { id } }));
  }
  return { success: true };
}
