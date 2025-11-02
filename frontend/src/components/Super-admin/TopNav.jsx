import React from "react";
import { NavLink } from "react-router-dom";

const SEARCH = "/src/assets/icons/Search.svg";
import ampowerLogo from "/src/assets/icons/ampower.svg";
import test from "/src/assets/images/jc.jpg";

const TopNav = () => {
  return (
    <div className="bg-white text-white p-4 flex justify-center items-center border-b w-full fixed top-0 left-0 z-10">
      {/* Left side - Logo */}
      <div className="flex items-center">
        <img
          src={ampowerLogo}
          alt="Logo"
          className="h-25 mr-4" // Adjust height as needed
        />
      </div>

 

        
      </div>

  );
};

export default TopNav;
