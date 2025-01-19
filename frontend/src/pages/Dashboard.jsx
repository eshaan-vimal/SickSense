import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/userDashboard/Sidebar";
import PersonalDetails from "../components/userDashboard/PersonalDetails";
import BookAppointment from "../components/userDashboard/BookAppointment";
import Symptoms from "../components/userDashboard/Symptoms";
import ConnectDoctors from "../components/userDashboard/ConnectDoctors";
import History from "../components/userDashboard/History";
import DashboardContent from "../components/userDashboard/DashboardContent";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-grow p-6">
        <Routes>
          <Route path="/" element={<DashboardContent />} />
          <Route path="personal-details" element={<PersonalDetails />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="symptoms" element={<Symptoms />} />
          <Route path="connect-doctors" element={<ConnectDoctors />} />
          <Route path="history" element={<History />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
