// src/components/MusicLayout.jsx
import React from "react";
import BackgroundMusic from "./BackgroundMusic";  // Import the BackgroundMusic component

const MusicLayout = ({ children }) => {
  return (
    <div>
      {/* Render BackgroundMusic only inside this layout */}
      <BackgroundMusic />
      
      {/* Render the page content */}
      {children}
    </div>
  );
};

export default MusicLayout;
