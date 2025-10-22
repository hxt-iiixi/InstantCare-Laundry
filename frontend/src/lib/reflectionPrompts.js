// src/lib/reflectionPrompts.js
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "devotion_reflection_prompts_v1";

export const DEFAULT_PROMPTS = [
  "How does Philippians 4:13 resonate with your current life challenges?",
  "What specific areas of your life do you need Christ’s strength today?",
  "How can you practically apply this verse to overcome a difficulty this week?",
  "Consider a time when you felt God’s strength. How can you carry that experience forward?",
];

// Local (non-UTC) date -> YYYY-MM-DD
function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function msUntilNextMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next - now;
}

// --- READ-ONLY (member side) ---
export function useReflectionPrompts() {
  const [prompts, setPrompts] = useState(DEFAULT_PROMPTS);

  useEffect(() => {
    const key = todayKey();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (data?.key === key && Array.isArray(data.items) && data.items.length) {
        setPrompts(data.items);
      }
    } catch {}
  }, []);

  // Make sure UI doesn’t carry yesterday’s prompts after midnight
  useEffect(() => {
    const t = setTimeout(() => {
      setPrompts(DEFAULT_PROMPTS);
    }, msUntilNextMidnight());
    return () => clearTimeout(t);
  }, []);

  return { prompts };
}

// --- EDITABLE (admin side) ---
export function useReflectionPromptsAdmin() {
  const [items, setItems] = useState(DEFAULT_PROMPTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = todayKey();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data?.key === key && Array.isArray(data.items) && data.items.length) {
          setItems(data.items);
        }
      } catch {}
    }
    setLoading(false);

    // Clear at midnight so next day starts fresh (defaults)
    const t = setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY);
    }, msUntilNextMidnight());
    return () => clearTimeout(t);
  }, []);

  const save = () => {
    const key = todayKey();
    const clean = items.map((s) => String(s ?? "").trim()).filter(Boolean);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ key, items: clean }));
  };

  const discard = () => {
    const key = todayKey();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data?.key === key && Array.isArray(data.items)) {
          setItems(data.items);
          return;
        }
      } catch {}
    }
    setItems(DEFAULT_PROMPTS);
  };

  const add = () => setItems((arr) => [...arr, ""]);
  const remove = (idx) => setItems((arr) => arr.filter((_, i) => i !== idx));
  const update = (idx, value) =>
    setItems((arr) => arr.map((q, i) => (i === idx ? value : q)));

  const dirty = useMemo(() => {
    const key = todayKey();
    const raw = localStorage.getItem(STORAGE_KEY);
    const current = JSON.stringify(items.map((s) => String(s ?? "").trim()));
    if (!raw) return current !== JSON.stringify(DEFAULT_PROMPTS);
    try {
      const data = JSON.parse(raw);
      const saved = JSON.stringify((data?.key === key ? data.items : DEFAULT_PROMPTS).map((s) => String(s ?? "").trim()));
      return current !== saved;
    } catch {
      return current !== JSON.stringify(DEFAULT_PROMPTS);
    }
  }, [items]);

  return { items, setItems, add, remove, update, save, discard, dirty, loading };
}
