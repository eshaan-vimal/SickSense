import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await doSignOut();
      // Redirect to the home page (or login) after successful logout
      navigate("/");
    } catch (error) {
      console.error("Logout failed: ", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <aside className="fixed top-0 left-0 w-64 bg-[#00b894] text-white flex flex-col min-h-screen shadow-lg">
      {/* Dashboard Header */}
      <Link to="/dashboard">
        <h2 className="text-2xl font-bold p-6 text-center text-white border-b border-[#059f7d]">
          Dashboard
        </h2>
      </Link>

      {/* Navigation Menu */}
      <nav className="flex-grow">
        <ul className="space-y-2 p-4">
          <li>
            <Link
              to="/dashboard/personal-details"
              className="block px-4 py-2 rounded hover:bg-[#059f7d] transition"
            >
              Personal Details
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/book-appointment"
              className="block px-4 py-2 rounded hover:bg-[#059f7d] transition"
            >
              Book Appointment
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/symptoms"
              className="block px-4 py-2 rounded hover:bg-[#059f7d] transition"
            >
              Predictive Diagnosis
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/history"
              className="block px-4 py-2 rounded hover:bg-[#059f7d] transition"
            >
              History
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/connect-doctors"
              className="block px-4 py-2 rounded hover:bg-[#059f7d] transition"
            >
              Connect Doctors
            </Link>
          </li>
        </ul>
      </nav>

      {/* User Profile and Logout */}
      <div className="p-4 text-center">
        {/* Only show the user info if currentUser exists */}
        {currentUser && (
          <div className="bg-[#eaf9f4] text-[#059f7d] px-4 py-3 rounded-full flex items-center justify-center gap-4 shadow-md">
            {/* User Photo (with optional chaining) */}
            {currentUser?.photoURL && (
              <img
                src={currentUser.photoURL}
                alt="User Profile"
                className="w-10 h-10 rounded-full border-2 border-[#059f7d]"
              />
            )}
            {/* User Name */}
            <div className="text-lg font-semibold">
              {currentUser.displayName || currentUser.email}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="block w-full mt-6 px-4 py-2 rounded-full bg-[#eaf9f4] text-[#059f7d] hover:bg-red-700 hover:text-white transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
