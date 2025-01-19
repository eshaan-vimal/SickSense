import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import defaultProfilePic from "../../assets/default-profile.jpg"; // Default profile image

const socket = io("http://localhost:3001", { transports: ["websocket"] }); // Socket.IO server connection

const ConnectDoctors = ({ userId }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactedDoctors, setContactedDoctors] = useState(new Set()); // Track contacted doctors
  const [currentCall, setCurrentCall] = useState(null); // Track the ongoing call
  const [isInCall, setIsInCall] = useState(false); // Track if the patient is in a call

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/doctors");
        if (!response.ok) throw new Error("Failed to fetch doctor data");
        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();

    // Listen for 'start-call' and 'call-ended' events
    socket.on("start-call", (data) => {
      console.log("Doctor started a call:", data);
      setCurrentCall(data); // Store call details
    });

    socket.on("call-ended", () => {
      console.log("Doctor ended the call.");
      setCurrentCall(null); // Reset call state
      setIsInCall(false);
    });

    return () => {
      socket.off("start-call");
      socket.off("call-ended");
    };
  }, []);

  const joinCall = () => {
    console.log("Joining call:", currentCall);
    setIsInCall(true); // Mark as in-call
  };

  const handleContact = async (rank, name) => {
    try {
      const response = await fetch("http://localhost:5000/api/add-patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rank, userId }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Your details have been shared with ${name}.`);
        setContactedDoctors((prev) => new Set(prev).add(rank));
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("An error occurred while contacting the doctor.");
    }
  };

  if (loading) {
    return (
      <div className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-gray-700 text-lg">Loading doctors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen relative">
      <h2 className="text-3xl font-bold text-[#00b894] mb-8">Connect with Doctors</h2>

      {!isInCall && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {doctors.map((doctor) => (
            <div
              key={doctor.rank}
              className="p-6 bg-[#eaf9f4] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 flex items-center"
            >
              {/* Profile Picture */}
              <img
                src={defaultProfilePic}
                alt={`${doctor.name}'s Profile`}
                className="w-16 h-16 rounded-full mr-4 border-2 border-[#059f7d]"
              />
              {/* Doctor Details */}
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-[#00594f]">{doctor.name}</h3>
                <p className="text-gray-600">Specialization: {doctor.specialty}</p>
              </div>
              {/* Contact Button */}
              <button
                className={`px-4 py-2 rounded-lg transition ${
                  contactedDoctors.has(doctor.rank)
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#00b894] text-white hover:bg-[#059f7d]"
                }`}
                onClick={() => handleContact(doctor.rank, doctor.name)}
                disabled={contactedDoctors.has(doctor.rank)}
              >
                {contactedDoctors.has(doctor.rank) ? "Wait" : "Contact"}
              </button>
            </div>
          ))}
        </div>
      )}

      {currentCall && !isInCall && (
        <div className="flex justify-center mt-6">
          <button
            onClick={joinCall}
            className="bg-[#00b894] text-white px-4 py-2 rounded hover:bg-[#059f7d] focus:outline-none"
          >
            Join Call with {currentCall.patientName}
          </button>
        </div>
      )}

      {isInCall && (
        <div className="flex flex-col items-center mt-6">
          <h2 className="text-xl font-bold mb-4 text-[#00b894]">Video Call in Progress</h2>
          <div className="w-full md:w-2/3 lg:w-1/2 bg-gray-200 rounded shadow-md p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-black h-[300px] rounded">
                <p className="text-white text-center pt-12">Your Video</p>
              </div>
              <div className="flex-1 bg-black h-[300px] rounded">
                <p className="text-white text-center pt-12">Doctor's Video</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectDoctors;
