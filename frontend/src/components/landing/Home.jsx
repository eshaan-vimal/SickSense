import React from "react";
import { Link } from "react-scroll";
import bgImage from "../../assets/new-assets/img/home.png";

const Home = () => {
  return (
    <div 
      className="relative min-h-screen flex flex-col justify-center lg:px-32 px-5 pt-20 z-10" // Reduced z-index to prevent overlap
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Background overlay for better contrast */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <div className="relative z-0 w-full lg:w-4/5 space-y-5 text-white">
        <h1 className="text-5xl font-bold leading-tight drop-shadow-lg">
          Welcome to SickSense: Your Partner in Health and Wellness
        </h1>
        <p className="text-xl drop-shadow-md">
          At SickSense, we are dedicated to providing you with cutting-edge diagnostics and personalized care to help you make informed health decisions. Our state-of-the-art facilities and expert team ensure that you receive accurate results and actionable insights for a healthier, more vibrant life.
        </p>

        <div className="mt-8">
          <Link
            to="services"
            spy={true}
            smooth={true}
            duration={500}
            className="cursor-pointer"
          >
            <button className="bg-[#00b894] text-white px-6 py-3 rounded-lg text-lg hover:bg-[#059f7d] transition">Check our services</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
