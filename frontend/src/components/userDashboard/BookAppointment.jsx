import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/authContext";
axios.defaults.baseURL = "http://localhost:5000";

const BookAppointment = () => {
  const { currentUser } = useAuth();
  const [appointment, setAppointment] = useState({
    email: "",
    date: "",
    time: "",
    location: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAppointment({ ...appointment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if date and time are valid
    const now = new Date();
    const selectedDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day later

    if (selectedDateTime < oneDayLater) {
      setError("The selected date and time must be at least one day from now.");
      return;
    }

    setError("");
    try {
      const response = await axios.post("/appointmentdetail", appointment);
      console.log("RESPONSE: ", response.data);
      alert("Appointment booked successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to book appointment.");
    }
  };

  useEffect(() => {
    if (currentUser?.email) {
      setAppointment((prevState) => ({ ...prevState, email: currentUser.email }));
    }
  }, [currentUser]);

  return (
    <div className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-[#00b894] mb-6">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="text-red-500 mb-4">
            {error}
          </div>
        )}
        <div>
          <label className="block text-[#00b894] font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={appointment.email}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894]"
            placeholder="Enter your email"
            disabled
          />
        </div>
        <div>
          <label className="block text-[#00b894] font-semibold mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={appointment.date}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894]"
          />
        </div>
        <div>
          <label className="block text-[#00b894] font-semibold mb-2">Time</label>
          <input
            type="time"
            name="time"
            value={appointment.time}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894]"
          />
        </div>
        <div>
          <label className="block text-[#00b894] font-semibold mb-2">
            Lab Location
          </label>
          <input
            type="text"
            name="location"
            value={appointment.location}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894]"
            placeholder="Enter lab location"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#00b894] text-white py-3 rounded-lg hover:bg-[#059f7d] transition"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
