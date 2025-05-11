import React from "react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-eventAmber bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
