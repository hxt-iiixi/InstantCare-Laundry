import { useEffect, useState } from "react";

const STORAGE_KEY = "daily_random_verse_v1";

// local (non-UTC) date so it doesn’t flip early
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

// Use ONE API/translation for both pages (WEB via bible-api.com)
async function fetchRandomVerse() {
  const url = "https://bible-api.com/data/web/random";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Verse fetch failed: ${res.status}`);
  const data = await res.json();

  const v = Array.isArray(data.verses) ? data.verses[0] : data;
  const text = (v?.text || "").trim();
  const reference = v?.book_name
    ? `${v.book_name} ${v.chapter}:${v.verse}`
    : v?.reference || "";

  return { text, reference, translation: "WEB" };
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
    const cachedRaw = localStorage.getItem(STORAGE_KEY);

    // Use cache for today and DON'T fetch again
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
          return; // important: prevents re-fetch on refresh/mount
        }
      } catch {
        // fall through
      }
    }

    let cancelled = false;
    (async () => {
      try {
        setState((s) => ({ ...s, loading: true, error: "" }));
        const verse = await fetchRandomVerse();
        if (cancelled) return;

        localStorage.setItem(STORAGE_KEY, JSON.stringify({ key, ...verse }));
        setState({ ...verse, loading: false, error: "" });
      } catch {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: "Unable to load verse right now." }));
        }
      }
    })();

    const t = setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY); // new day → new verse
    }, msUntilNextMidnight());

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  return state;
}
