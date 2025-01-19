import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/authContext";
import { FaCheck, FaTimes } from "react-icons/fa";
axios.defaults.baseURL = "http://localhost:5000";

const Admin = () => {
  const { currentUser } = useAuth();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/sendalldetails");
      setDataList(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.post(`/sendrejectmail/${id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to send rejection email:", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.post(`/sendapprovemail/${id}`);
      fetchData();
    } catch (error) {
      console.error("Failed to send approval email:", error);
    }
  };

  const handleFileChange = (file, email) => {
    setSelectedFiles((prev) => ({ ...prev, [email]: file }));
  };

  const handleFileUpload = async (email) => {
    const file = selectedFiles[email];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`/upload-snp/${email}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully!");
      setSelectedFiles((prev) => ({ ...prev, [email]: null }));
    } catch (error) {
      console.error("Failed to upload file:", error);
      alert("File upload failed!");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen pt-20">
      <h1 className="text-4xl font-bold text-[#00b894] mb-8 text-center">Admin Panel</h1>
      {loading ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#00b894] text-white text-left">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
                <th className="p-4 w-40">SNP File</th>
                <th className="p-4">Submit</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 ? (
                dataList.map((record) => (
                  <tr key={record._id} className="border-b last:border-none">
                    <td className="p-4 text-gray-700">{record.name}</td>
                    <td className="p-4 text-gray-700">{record.email}</td>
                    <td className="p-4 text-gray-700">{record.mobile}</td>
                    <td className="p-4 text-gray-700">{record.date || "N/A"}</td>
                    <td className="p-4 text-gray-700">{record.time || "N/A"}</td>
                    <td className="p-4 text-gray-700">{record.status || "Pending"}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(record.email)}
                          className="bg-[#00b894] text-white p-2 rounded hover:bg-[#059f7d] focus:outline-none"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleReject(record.email)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 relative">
                      <label className="block w-full cursor-pointer border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#00b894] text-center text-gray-700">
                        {selectedFiles[record.email]?.name || "Choose File"}
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleFileChange(e.target.files[0], record.email)}
                        />
                      </label>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleFileUpload(record.email)}
                        className="bg-[#00b894] text-white px-3 py-1 rounded hover:bg-[#059f7d] focus:outline-none"
                      >
                        Upload
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="p-4 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
