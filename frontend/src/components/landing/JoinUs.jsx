import React from "react";
import { Link } from "react-router-dom";

const JoinUs = () => {
  return (
    <div className="flex flex-col justify-center items-center lg:px-32 px-5 py-16 gap-8">
      <div className="w-full lg:w-3/4 space-y-4 text-center">
        <h2 className="text-4xl font-bold">Partner Program</h2>
        <p className="text-lg">
          At SickSense, we’re building the future of personalized healthcare by connecting customers to trusted Genotyping Labs. Partner with us to grow your reach, simplify workflows, and make a lasting impact in the healthcare industry.
        </p>
        <p className="text-lg">
          As a partner, you'll gain access to our exclusive portal to securely upload DNA data while we handle the rest—processing the data and providing users with actionable insights. Together, we can empower individuals to take control of their health.
        </p>
      </div>
      
      <div className="w-full lg:w-3/4 text-center">
        <Link to="/admin-login">
          <button className="bg-[#00b894] text-white py-3 px-8 rounded-lg hover:bg-[#059f7d] transition duration-300 w-full lg:w-auto">
            Join Us
          </button>
        </Link>
      </div>
    </div>
  );
};

export default JoinUs;
