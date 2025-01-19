import React from "react";
import Header from "../components/doctorDashboard/Header";
import Doctor from "../components/doctorDashboard/Doctor";

const DoctorDashboard = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-6">
        <Doctor />
      </main>
    </div>
  );
};

export default DoctorDashboard;
