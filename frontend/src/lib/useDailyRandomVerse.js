// src/lib/useDailyRandomVerse.js
import { useEffect, useState } from "react";

const STORAGE_KEY = "daily_random_verse_v1_server"; // new key to avoid old cache

export function useDailyRandomVerse() {
  const [state, setState] = useState({
    text: "",
    reference: "",
    translation: "",
    loading: true,
    error: "",
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setState((s) => ({ ...s, loading: true, error: "" }));

        // If you have an env like VITE_API_URL, use it. Otherwise hardcode localhost:4000
        const base = import.meta.env?.VITE_API_URL || "http://localhost:4000";
        const res = await fetch(`${base}/api/devotion/today`, { credentials: "include" });
        const data = await res.json();

        if (cancelled) return;
        const payload = {
          text: data.text || "",
          reference: data.reference || "",
          translation: data.translation || "",
        };

        setState({ ...payload, loading: false, error: "" });
        // Optional: cache to avoid re-requesting during the day
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ key: data.key, ...payload }));
      } catch (e) {
        console.error("[DailyVerse] server fetch failed:", e);
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: "Could not load verse." }));
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return state;
}
