// src/lib/useDailyRandomVerse.js
import { useEffect, useState } from "react";

const STORAGE_KEY = "daily_random_verse_v1";

// local date key so it stays the same all day
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

// Primary: bible-api.com (WEB). Fallback: OurManna (random verse)
async function fetchRandomVersePrimary() {
  const res = await fetch("https://bible-api.com/data/web/random");
  if (!res.ok) throw new Error(`bible-api status ${res.status}`);
  const data = await res.json();
  const v = Array.isArray(data.verses) ? data.verses[0] : data;
  const text = (v?.text || "").trim();
  const reference = v?.book_name
    ? `${v.book_name} ${v.chapter}:${v.verse}`
    : v?.reference || "";
  if (!text || !reference) throw new Error("bible-api missing fields");
  return { text, reference, translation: "WEB" };
}

async function fetchRandomVerseFallback() {
  const res = await fetch("https://beta.ourmanna.com/api/v1/get/?format=json&order=random");
  if (!res.ok) throw new Error(`ourmanna status ${res.status}`);
  const data = await res.json();
  const text = (data?.verse?.details?.text || "").trim();
  const ref = data?.verse?.details?.reference || "";
  if (!text || !ref) throw new Error("ourmanna missing fields");
  return { text, reference: ref, translation: "KJV/varies" };
}

async function fetchRandomVerse() {
  try {
    return await fetchRandomVersePrimary();
  } catch (e) {
    console.warn("[DailyVerse] primary failed, using fallback:", e);
    return await fetchRandomVerseFallback();
  }
}

export function useDailyRandomVerse() {
  const [state, setState] = useState({
    text: "",
    reference: "",
    translation: "WEB",
    loading: true,
    error: "",
  });

  useEffect(() => {
    const key = todayKey();

    // Use cache if today’s verse already exists
    const cachedRaw = localStorage.getItem(STORAGE_KEY);
    if (cachedRaw) {
      try {
        const cached = JSON.parse(cachedRaw);
        if (cached.key === key && cached.text) {
          setState({
            text: cached.text,
            reference: cached.reference,
            translation: cached.translation || "WEB",
            loading: false,
            error: "",
          });
          return; // don’t fetch again
        }
      } catch (_) {}
    }

    let cancelled = false;
    (async () => {
      try {
        setState((s) => ({ ...s, loading: true, error: "" }));
        const verse = await fetchRandomVerse();
        if (cancelled) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ key, ...verse }));
        setState({ ...verse, loading: false, error: "" });
      } catch (e) {
        console.error("[DailyVerse] fetch failed:", e);
        if (!cancelled) {
          setState((s) => ({
            ...s,
            loading: false,
            error: "Could not load verse. Check console/network.",
          }));
        }
      }
    })();

    const t = setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY); // new day -> new verse
    }, msUntilNextMidnight());

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return state;
}
