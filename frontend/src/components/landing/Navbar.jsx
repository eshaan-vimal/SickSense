import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom"; // Renamed Link from react-router-dom
import { Link as ScrollLink } from "react-scroll"; // Renamed Link from react-scroll
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import img from "../../assets/sicksense-logo-cropped.png";

const Navbar = () => {
  const [menu, setMenu] = useState(false);

  const handleChange = () => {
    setMenu(!menu);
  };

  const closeMenu = () => {
    setMenu(false);
  };

  return (
    <div className="fixed w-full z-50 text-white bg-[#00b894] shadow-lg">
      <div>
        <div className="flex flex-row justify-between p-5 md:px-32 px-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
          <div className="flex flex-row items-center cursor-pointer space-x-3">
            <ScrollLink to="home" spy={true} smooth={true} duration={500} className="flex items-center">
              {/* Icon next to SickSense */}
              <img className="w-10 h-10 -translate-y-[4px]" src={img} alt="SickSense Icon" />
              <h1 className="text-2xl font-semibold">SickSense.</h1>
            </ScrollLink>
          </div>

          <nav className="hidden lg:flex flex-row items-center text-lg font-medium gap-8">
            {/* Existing Links using ScrollLink */}
            <ScrollLink
              to="home"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-secondary transition-all cursor-pointer"
            >
              Home
            </ScrollLink>

            <ScrollLink
              to="about"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-secondary transition-all cursor-pointer"
            >
              About Us
            </ScrollLink>

            <ScrollLink
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-secondary transition-all cursor-pointer"
            >
              Services
            </ScrollLink>

            <ScrollLink
              to="labs"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-secondary transition-all cursor-pointer"
            >
              Labs
            </ScrollLink>

            <ScrollLink
              to="blog"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-secondary transition-all cursor-pointer"
            >
              Blog
            </ScrollLink>

            <ScrollLink
              to="cases"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-secondary transition-all cursor-pointer"
            >
              Cases
            </ScrollLink>

            <ScrollLink
              to="join-us"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-secondary transition-all cursor-pointer"
            >
              Partner
            </ScrollLink>

            <ScrollLink
              to="contacts"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-secondary transition-all cursor-pointer"
            >
              Connect
            </ScrollLink>

            {/* RouterLink for page navigation */}
            <RouterLink to="http://localhost:3000/login" className="hover:text-secondary transition-all cursor-pointer">
              <button className="border-2 border-white text-white px-4 py-2 rounded-lg hover:bg-[#128c7e] transition-colors duration-300">
                Login
              </button>
            </RouterLink>
          </nav>

          <div className="lg:hidden flex items-center">
            {menu ? (
              <AiOutlineClose size={28} onClick={handleChange} />
            ) : (
              <AiOutlineMenu size={28} onClick={handleChange} />
            )}
          </div>
        </div>

        <div
          className={`${
            menu ? "translate-x-0" : "-translate-x-full"
          } lg:hidden flex flex-col absolute bg-[#00b894] text-white left-0 top-16 font-semibold text-2xl text-center pt-8 pb-4 gap-8 w-full h-fit transition-transform duration-300`}
        >
          {/* Same links for mobile view */}
          <ScrollLink
            to="home"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-secondary transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Home
          </ScrollLink>

          <ScrollLink
            to="about"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-secondary transition-all cursor-pointer"
            onClick={closeMenu}
          >
            About Us
          </ScrollLink>

          <ScrollLink
            to="services"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-secondary transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Services
          </ScrollLink>

          <ScrollLink
            to="labs"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-secondary transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Labs
          </ScrollLink>

          <ScrollLink
            to="blog"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-secondary transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Blog
          </ScrollLink>

          <ScrollLink
            to="cases"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-secondary transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Cases
          </ScrollLink>

          <ScrollLink
            to="join-us"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-secondary transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Partner
          </ScrollLink>

          <ScrollLink
            to="contacts"
            spy={true}
            smooth={true}
            duration={500}
            className="hover:text-secondary transition-all cursor-pointer"
            onClick={closeMenu}
          >
            Connect
          </ScrollLink>

          <RouterLink to="http://localhost:3000/login" className="hover:text-secondary transition-all cursor-pointer">
            <button className="border-2 border-white text-white px-4 py-2 rounded-lg hover:bg-[#128c7e] transition-colors duration-300">
              Login
            </button>
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
