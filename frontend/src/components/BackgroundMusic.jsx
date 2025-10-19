import React, { useState, useRef } from "react";

// Import your music files
import backgroundMusic1 from "../assets/music/Dream Aria Genshin Impact NighttimeEvening Title Screen Main Menu BGM OST EXTENDED.mp3";  
import backgroundMusic2 from "../assets/music/Bassilyo - Lord Patawad.mp3";  

const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(backgroundMusic1); 
  const audioRef = useRef(null);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeTrack = () => {
    const newTrack = currentTrack === backgroundMusic1 ? backgroundMusic2 : backgroundMusic1;
    setCurrentTrack(newTrack);
    audioRef.current.src = newTrack;
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center gap-4">
      <audio ref={audioRef} loop>
        <source src={currentTrack} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <button onClick={togglePlayPause} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md">
        {isPlaying ? "Pause" : "Play"}
      </button>

      <button onClick={toggleMute} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md">
        {isMuted ? "Unmute" : "Mute"}
      </button>

      <button onClick={changeTrack} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-md">
        Change Track
      </button>
    </div>
  );
};

export default BackgroundMusic;
