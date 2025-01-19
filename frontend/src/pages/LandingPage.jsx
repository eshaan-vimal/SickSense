import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/landing/Navbar";
import Home from "../components/landing/Home";
import About from "../components/landing/About";
import Services from "../components/landing/Services";
import Doctors from "../components/landing/Doctors"; // Import Doctors
import Labs from "../components/landing/Labs";
import Blogs from "../components/landing/Blogs";
import Cases from "../components/landing/Cases";
import Contacts from "../components/landing/Contacts";
import JoinUs from "../components/landing/JoinUs";
import Footer from "../components/landing/Footer";

const MainLanding = () => {
  return (
    <>
      <div id="home">
        <Home />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="services">
        <Services />
      </div>
      <div id="doctors">
        <Doctors />
      </div>
      <div id="labs">
        <Labs />
      </div>
      <div id="blog">
        <Blogs />
      </div>
      <div id="cases">
        <Cases />
      </div>
      <div id="join-us">
        <JoinUs />
      </div>
      <div id="contacts">
        <Contacts />
      </div>
    </>
  );
};

const LandingPage = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<MainLanding />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/labs" element={<Labs />} />
          <Route path="/doctors" element={<Doctors />} /> {/* Add Doctors Route */}
          <Route path="/blog" element={<Blogs />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/contacts" element={<Contacts />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;