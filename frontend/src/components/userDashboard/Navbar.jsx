import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import sicksenseLogo from "../../assets/sicksense-logo-cropped.png";

const Navbar = () => {
  const { user, isAuthenticated } = useAuth0();

  return (
    <nav className="bg-green-600 text-white py-2 px-6 shadow-md flex items-center justify-between">
      {/* Logo and Dashboard Text */}
      <div className="flex items-center space-x-4">
        <img
          src={sicksenseLogo}
          alt="SickSense Logo"
          className="w-12 h-12" // Adjust logo size
        />
        <h2 className="text-2xl text-white font-bold">SickSense</h2>
      </div>

      {/* User Info or Login Prompt */}
      {isAuthenticated && user ? (
        <div className="flex items-center space-x-4">
          <img
            src={user.picture}
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="text-sm font-medium">{user.name}</h2>
            <p className="text-xs">{user.email}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm">Please log in.</p>
      )}
    </nav>
  );
};

export default Navbar;
