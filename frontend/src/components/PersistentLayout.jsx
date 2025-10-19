// src/components/PersistentLayout.jsx
import React from "react";
import BackgroundMusic from "./BackgroundMusic";  // Import the BackgroundMusic component

const PersistentLayout = ({ children }) => {
  return (
    <div>
      {/* BackgroundMusic will be always present */}
      <BackgroundMusic />
      
      {/* Render the page content */}
      {children}
    </div>
  );
};

export default PersistentLayout;
