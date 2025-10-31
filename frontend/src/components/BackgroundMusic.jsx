import React, { useEffect, useRef, useState } from "react";

import track1 from "/src/assets/music/Dream Aria Genshin Impact NighttimeEvening Title Screen Main Menu BGM OST EXTENDED.mp3";
import track2 from "/src/assets/music/bassilyo-lord-patawad_q4GE6g1Y.mp3";
import track3 from "/src/assets/music/bassilyo-lord-patawad_q4GE6g1Y.mp3";


import SoundOnIcon from "/src/assets/icons/volume.png";
import SoundOffIcon from "/src/assets/icons/volume-mute.png";

const MUTE_KEY = "bgm-muted";
const TRACK_KEY = "bgm-track";

export default function BackgroundMusic() {
  const audioRef = useRef(null);

 
  const storedMuted = (() => {
    try { return JSON.parse(localStorage.getItem(MUTE_KEY) ?? "false"); } catch { return false; }
  })();

  const storedTrack = (() => {
    try { return localStorage.getItem(TRACK_KEY) === "2" ? "2" : "1"; } catch { return "1"; }
  })();

  const [isMuted, setIsMuted] = useState(storedMuted);
  const [currentTrack, setCurrentTrack] = useState(storedTrack === "2" ? track2 : track1 );
  const [needsUserGesture, setNeedsUserGesture] = useState(false);

  
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


  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.src = currentTrack;
    a.play().catch(() => {});
  }, [currentTrack]);

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

  const cycleTrack = () => {
    setCurrentTrack((t) => {
      const next = t === track1 ? track2 : track1;
      localStorage.setItem(TRACK_KEY, next === track2 ? "2" : "1");
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
      <span className="sr-only">{isMuted ? "Turn sound on" : "Turn sound off"}</span>
    </button>

 
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
