import React from "react";
import { Link } from "react-scroll";

const Footer = () => {
  return (
    <div className="bg-[#00b894] text-white mt-8">
      <div className="flex flex-col md:flex-row justify-between p-8 md:px-32 px-5">
        <div className="w-full md:w-1/4">
          <h1 className="font-semibold text-xl pb-4">SickSense</h1>
          <p className="text-sm">
            Feeling under the Weather?<br/>
            We've got the Forecast
          </p>
        </div>
        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">About Us</h1>
          <nav className="flex flex-col gap-2">
            <Link
              to="about"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-[#059f7d] transition-all cursor-pointer"
            >
              About
            </Link>
            <Link
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-[#059f7d] transition-all cursor-pointer"
            >
              Services
            </Link>
            <Link
              to="labs"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-[#059f7d] transition-all cursor-pointer"
            >
              Labs
            </Link>
          </nav>
        </div>
        <div>
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Services</h1>
          <nav className="flex flex-col gap-2">
            <Link
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-[#059f7d] transition-all cursor-pointer"
            >
              DNA Sequencing
            </Link>
            <Link
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-[#059f7d] transition-all cursor-pointer"
            >
              Disease Prediction
            </Link>
            <Link
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-[#059f7d] transition-all cursor-pointer"
            >
              Drug Recommendation
            </Link>
            <Link
              to="services"
              spy={true}
              smooth={true}
              duration={500}
              className="hover:text-[#059f7d] transition-all cursor-pointer"
            >
              Lifestyle Changes
            </Link>
          </nav>
        </div>
        <div className="w-full md:w-1/4">
          <h1 className="font-medium text-xl pb-4 pt-5 md:pt-0">Contact Us</h1>
          <nav className="flex flex-col gap-2">
            <p>SickSense Avenue</p>
            <p>sicksense.app@gmail.com</p>
            <p>+91 1234567890</p>
          </nav>
        </div>
      </div>
      <div>
        <p className="text-center py-4">
          &copy; {new Date().getFullYear()} Developed by{" "}
          <span className="text-[#ffffff]">SickSense</span> | All rights reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
