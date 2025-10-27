// src/lib/useDailyRandomVerse.js
import { useEffect, useState } from "react";

const STORAGE_KEY = "daily_random_verse_v1";
const LOCK_KEY = "daily_random_verse_lock_v1";
const LOCK_TTL_MS = 20_000; // lock auto-expires

function todayKey() {
  // Consistent day boundary for everyone
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date()); // e.g., 2025-10-27
}

function msUntilNextMidnight() {
  const now = new Date();
  const next = new Date(now);
  // Midnight in Asia/Manila
  const nowPH = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
  const nextPH = new Date(nowPH);
  nextPH.setHours(24, 0, 0, 0);
  // Convert back to local milliseconds delta
  return nextPH - nowPH;
}

// --------- APIs (same as yours) ----------
async function fetchRandomVersePrimary() {
  const res = await fetch("https://bible-api.com/data/web/random");
  if (!res.ok) throw new Error(`bible-api status ${res.status}`);
  const data = await res.json();
  const v = Array.isArray(data.verses) ? data.verses[0] : data;
  const text = (v?.text || "").trim();
  const reference = v?.book_name ? `${v.book_name} ${v.chapter}:${v.verse}` : v?.reference || "";
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

// --------- Hook with lock + storage sync ----------
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

    // 1) If cached for today, use it
    const readCache = () => {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      try {
        const data = JSON.parse(raw);
        if (data?.key === key && data.text) return data;
      } catch {}
      return null;
    };

    const cached = readCache();
    if (cached) {
      setState({ ...cached, loading: false, error: "" });
    }

    let cancelled = false;

    const finish = (verse) => {
      if (cancelled) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ key, ...verse }));
      setState({ ...verse, loading: false, error: "" });
    };

    // 2) Listen for updates from another tab/page
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      const data = readCache();
      if (data && !cancelled) {
        setState({ ...data, loading: false, error: "" });
      }
    };
    window.addEventListener("storage", onStorage);

    // 3) Acquire a lock to avoid double-randomizing
    const tryAcquireLock = () => {
      const now = Date.now();
      const raw = localStorage.getItem(LOCK_KEY);
      if (raw) {
        try {
          const lock = JSON.parse(raw);
          const fresh = lock?.key === key && now - (lock?.ts || 0) < LOCK_TTL_MS;
          if (fresh) return false; // someone else is fetching
        } catch {}
      }
      localStorage.setItem(LOCK_KEY, JSON.stringify({ key, ts: now }));
      return true;
    };

    const releaseLock = () => {
      const raw = localStorage.getItem(LOCK_KEY);
      if (!raw) return;
      try {
        const lock = JSON.parse(raw);
        if (lock?.key === key) localStorage.removeItem(LOCK_KEY);
      } catch {
        localStorage.removeItem(LOCK_KEY);
      }
    };

    (async () => {
      if (cached) return; // already set

      const gotLock = tryAcquireLock();
      if (gotLock) {
        try {
          const verse = await fetchRandomVerse();
          finish(verse);
        } catch (e) {
          console.error("[DailyVerse] fetch failed:", e);
          if (!cancelled) {
            setState((s) => ({ ...s, loading: false, error: "Could not load verse. Check network." }));
          }
        } finally {
          releaseLock();
        }
      } else {
        // Wait for whoever has the lock to write the verse
        // Fallback: if nothing arrives within LOCK_TTL_MS + 2s, we fetch anyway
        setState((s) => ({ ...s, loading: true }));
        const fallback = setTimeout(async () => {
          if (cancelled) return;
          const again = readCache();
          if (again) {
            setState({ ...again, loading: false, error: "" });
            return;
          }
          try {
            const verse = await fetchRandomVerse();
            finish(verse);
          } catch (e) {
            console.error("[DailyVerse] late fetch failed:", e);
            if (!cancelled) setState((s) => ({ ...s, loading: false, error: "Could not load verse." }));
          }
        }, LOCK_TTL_MS + 2000);
        return () => clearTimeout(fallback);
      }
    })();

    // 4) New day: clear cache/lock
    const midnightTimer = setTimeout(() => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LOCK_KEY);
    }, msUntilNextMidnight());

    return () => {
      cancelled = true;
      window.removeEventListener("storage", onStorage);
      clearTimeout(midnightTimer);
    };
  }, []);

  return state;
}
