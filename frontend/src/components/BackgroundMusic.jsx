import React, { useEffect, useRef, useState } from "react";

import track1 from "/src/assets/music/Dream Aria Genshin Impact NighttimeEvening Title Screen Main Menu BGM OST EXTENDED.mp3";
import track2 from "/src/assets/music/Goodness Of God_ Worship Instrumental Music _ Prayer & Meditation [ejDu8ATG0Rc].mp3";
import track3 from "/src/assets/music/Who Am I(MP3_128K).mp3";

import SoundOnIcon from "/src/assets/icons/volume.png";
import SoundOffIcon from "/src/assets/icons/volume-mute.png";

const MUTE_KEY = "bgm-muted";
const TRACK_KEY = "bgm-track";

export default function BackgroundMusic() {
  const audioRef = useRef(null);

  // --- Get saved mute setting ---
  const storedMuted = (() => {
    try {
      return JSON.parse(localStorage.getItem(MUTE_KEY) ?? "false");
    } catch {
      return false;
    }
  })();

  // --- Get saved track number (1–3) ---
  const storedTrack = (() => {
    try {
      const val = localStorage.getItem(TRACK_KEY);
      return ["1", "2", "3"].includes(val) ? val : "1";
    } catch {
      return "1";
    }
  })();

  const [isMuted, setIsMuted] = useState(storedMuted);

  // --- Select which track to start with ---
  const [currentTrack, setCurrentTrack] = useState(
    storedTrack === "3" ? track3 : storedTrack === "2" ? track2 : track1
  );

  const [needsUserGesture, setNeedsUserGesture] = useState(false);

  // --- Initialize the audio element ---
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.src = currentTrack;
    a.loop = true;
    a.preload = "auto";
    a.muted = isMuted;
    a.autoplay = true;
    a.playsInline = true;

    a.play().catch(() => {
      if (!isMuted) {
        a.muted = true;
        setIsMuted(true);
        setNeedsUserGesture(true);
        localStorage.setItem(MUTE_KEY, JSON.stringify(true));
        a.play().catch(() => {});
      }
    });
  }, []);

  // --- When the track changes, play the new one ---
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.src = currentTrack;
    a.play().catch(() => {});
  }, [currentTrack]);

  // --- Toggle mute/unmute ---
  const toggleSound = () => {
    const a = audioRef.current;
    if (!a) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    a.muted = nextMuted;
    setNeedsUserGesture(false);
    localStorage.setItem(MUTE_KEY, JSON.stringify(nextMuted));
    if (!nextMuted) a.play().catch(() => {});
  };

  // --- Cycle through 3 tracks ---
  const cycleTrack = () => {
    setCurrentTrack((t) => {
      let next;
      if (t === track1) next = track2;
      else if (t === track2) next = track3;
      else next = track1; // loop back

      localStorage.setItem(
        TRACK_KEY,
        next === track3 ? "3" : next === track2 ? "2" : "1"
      );

      return next;
    });
  };

  return (
    <>
      <audio ref={audioRef} className="hidden" />

      <div
        className="fixed top-3 left-3 z-[9999] 
                   flex items-center gap-2 
                   rounded-full border border-white/60 
                   bg-white/80 backdrop-blur-md 
                   px-2.5 py-1.5 shadow-lg"
        aria-label="Background music controls"
      >
        {/* 🔊 Sound toggle button */}
        <button
          onClick={toggleSound}
          title={isMuted ? "Sound On" : "Sound Off"}
          className={`rounded-full p-1.5 transition hover:bg-black/5 ${
            needsUserGesture ? "ring-2 ring-orange-400" : ""
          }`}
          aria-pressed={!isMuted}
        >
          <img
            src={isMuted ? SoundOffIcon : SoundOnIcon}
            alt=""
            className="h-5 w-5"
          />
          <span className="sr-only">
            {isMuted ? "Turn sound on" : "Turn sound off"}
          </span>
        </button>

        {/* 🔁 Change track button */}
        <button
          onClick={cycleTrack}
          title="Change Track"
          className="rounded-full px-2 py-1 text-[11px] font-medium text-zinc-700 hover:bg-black/5"
        >
          Change
          <span className="sr-only"> background track</span>
        </button>
      </div>
    </>
  );
}
