import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/authContext";

// MUI imports for Backdrop and CircularProgress
import { CircularProgress, Backdrop } from "@mui/material";

const Symptoms = () => {
  const { currentUser } = useAuth();

  const [symptoms, setSymptoms] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [drink, setDrink] = useState("");
  const [smoke, setSmoke] = useState("");
  const [diet, setDiet] = useState("");
  const [sleepDuration, setSleepDuration] = useState("");
  const [exerciseHours, setExerciseHours] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddSymptom = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      const trimmedValue = inputValue.trim();
      if (trimmedValue && !symptoms.includes(trimmedValue)) {
        setSymptoms([...symptoms, trimmedValue]);
      }
      setInputValue("");
    }
  };

  const handleRemoveSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter((symptom) => symptom !== symptomToRemove));
  };

  const handleSubmit = async () => {
    const requestData = {
      symptoms,
      drink,
      smoke,
      diet,
      sleepDuration,
      exerciseHours,
    };

    setLoading(true); // Show loading indicator

    try {
      const response = await axios.post(
        `http://localhost:5000/diagnosis/${currentUser.email}`,
        requestData
      );

      if (response.data.file_url) {
        setFileUrl(response.data.file_url);
      } else {
        alert("PDF generation failed.");
      }
    } catch (error) {
      alert("An error occurred while processing your request.");
      console.error(error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "personalized_health_report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-[#00b894] mb-6">Symptoms and Lifestyle</h2>

      {/* Symptoms Input */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Report Your Symptoms</h3>
        <input
          type="text"
          placeholder="Type a symptom and press Enter..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleAddSymptom}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894] mb-4"
        />
        <div className="flex flex-wrap gap-2">
          {symptoms.map((symptom, index) => (
            <div
              key={index}
              className="flex items-center bg-teal-100 text-teal-700 px-3 py-1 rounded-full shadow-md"
            >
              <span className="mr-2">{symptom}</span>
              <button
                onClick={() => handleRemoveSymptom(symptom)}
                className="text-teal-700 hover:text-red-500 focus:outline-none"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Lifestyle Questions */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Lifestyle Questions</h3>

        {/* Drink */}
        <div className="mb-4">
          <label className="block text-gray-700">Drink</label>
          <select
            value={drink}
            onChange={(e) => setDrink(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894]"
          >
            <option value="">Select</option>
            <option value="Never">Never</option>
            <option value="Occasional">Occasional</option>
            <option value="Frequently">Frequently</option>
          </select>
        </div>

        {/* Smoke */}
        <div className="mb-4">
          <label className="block text-gray-700">Smoke</label>
          <select
            value={smoke}
            onChange={(e) => setSmoke(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894]"
          >
            <option value="">Select</option>
            <option value="Never">Never</option>
            <option value="Occasional">Occasional</option>
            <option value="Frequently">Frequently</option>
          </select>
        </div>

        {/* Diet */}
        <div className="mb-4">
          <label className="block text-gray-700">Diet/Nutrition</label>
          <select
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894]"
          >
            <option value="">Select</option>
            <option value="Healthy">Healthy</option>
            <option value="Balanced">Balanced</option>
            <option value="Junk">Junk</option>
          </select>
        </div>
      </div>

      {/* Sleep and Exercise */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Sleep and Exercise</h3>

        <div className="mb-4">
          <label className="block text-gray-700">Sleep Duration (hours per night)</label>
          <input
            type="number"
            value={sleepDuration}
            onChange={(e) => setSleepDuration(e.target.value)}
            placeholder="Enter sleep duration"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894]"
            min="0"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Exercise (hours per week)</label>
          <input
            type="number"
            value={exerciseHours}
            onChange={(e) => setExerciseHours(e.target.value)}
            placeholder="Enter exercise hours"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894]"
            min="0"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleSubmit}
          className="bg-[#00b894] text-white py-3 px-6 rounded-lg hover:bg-[#059f7d] transition"
        >
          Submit
        </button>
        {fileUrl && (
          <button
            onClick={handleDownload}
            // New color scheme for the Download button
            className="bg-[#1abc9c] text-white py-3 px-6 rounded-lg hover:bg-[#16a085] transition"
          >
            Download Report
          </button>
        )}
      </div>

      {/* Backdrop and Loading Spinner */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <p className="mt-4">Generating your report, please wait...</p>
      </Backdrop>
    </div>
  );
};

export default Symptoms;
