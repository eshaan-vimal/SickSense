import React from "react";
import Header from "../components/adminDashboard/Header";
import Admin from "../components/adminDashboard/Admin";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-6">
        <Admin />
      </main>
    </div>
  );
};

export default AdminDashboard;
