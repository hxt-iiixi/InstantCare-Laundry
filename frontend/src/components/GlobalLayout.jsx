// src/components/GlobalLayout.js
import React from "react";
import BackgroundMusic from "./BackgroundMusic";  // Import BackgroundMusic component

const GlobalLayout = ({ children }) => {
  return (
    <div>
      {/* The BackgroundMusic component will persist across all pages */}
      <BackgroundMusic />

      {/* Render the page content passed to the layout */}
      {children}
    </div>
  );
};

export default GlobalLayout;
