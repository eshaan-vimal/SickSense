// import React from "react";
// import sicksenseLogo from "../../assets/sicksense-logo-cropped.png";

// const Header = () => {
//   return (
//     <header className="fixed top-0 left-0 w-full flex justify-between items-center bg-[#00b894] p-4 shadow-md z-10">
//       <div className="flex items-center space-x-4">
//         <img
//           src={sicksenseLogo}
//           alt="SickSense Logo"
//           className="w-10 h-10 -translate-y-[4px] -translate-x-[-16px]" // Adjust logo size
//         />
//         <h2 className="text-2xl text-white font-bold">SickSense</h2>
//       </div>
//       <button className="bg-white text-[#00b894] px-4 py-2 rounded hover:bg-[#eaf9f4] hover:text-[#059f7d] transition">
//         Logout
//       </button>
//     </header>
//   );
// };

// export default Header;


import React from "react";
import sicksenseLogo from "../../assets/sicksense-logo-cropped.png";
import { doSignOut } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
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
    <header className="fixed top-0 left-0 w-full flex justify-between items-center bg-[#00b894] p-4 shadow-md z-10">
      <div className="flex items-center space-x-4">
        <img
          src={sicksenseLogo}
          alt="SickSense Logo"
          className="w-10 h-10 -translate-y-[4px] -translate-x-[-16px]" // Adjust logo size
        />
        <h2 className="text-2xl text-white font-bold">SickSense</h2>
      </div>
      <button 
        onClick={handleLogout}
        className="bg-white text-[#00b894] px-4 py-2 rounded hover:bg-[#eaf9f4] hover:text-[#059f7d] transition">
        Logout
      </button>
    </header>
  );
};

export default Header;