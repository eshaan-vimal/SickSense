import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { FiCamera } from "react-icons/fi";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DashboardContent = () => {
  // Chart Data
  const [calorieData] = useState([
    { name: "Protein", value: 500 },
    { name: "Carbs", value: 700 },
    { name: "Fat", value: 600 },
    { name: "Iron", value: 300 },
  ]);

  const [stepsData] = useState([
    { name: "Monday", steps: 5000 },
    { name: "Tuesday", steps: 8000 },
    { name: "Wednesday", steps: 7500 },
    { name: "Thursday", steps: 6000 },
    { name: "Friday", steps: 9000 },
  ]);

  // Uneven Graph Data for Each Metric
  const bloodSugarData = [
    { time: "6 AM", value: 85 },
    { time: "9 AM", value: 120 },
    { time: "12 PM", value: 95 },
    { time: "3 PM", value: 140 },
    { time: "6 PM", value: 100 },
    { time: "9 PM", value: 90 },
  ];

  const heartRateData = [
    { time: "6 AM", value: 70 },
    { time: "9 AM", value: 80 },
    { time: "12 PM", value: 75 },
    { time: "3 PM", value: 90 },
    { time: "6 PM", value: 85 },
    { time: "9 PM", value: 78 },
  ];

  const bloodPressureData = [
    { time: "6 AM", value: 120 },
    { time: "9 AM", value: 110 },
    { time: "12 PM", value: 125 },
    { time: "3 PM", value: 130 },
    { time: "6 PM", value: 115 },
    { time: "9 PM", value: 122 },
  ];

  const spo2Data = [
    { time: "6 AM", value: 96 },
    { time: "9 AM", value: 97 },
    { time: "12 PM", value: 95 },
    { time: "3 PM", value: 98 },
    { time: "6 PM", value: 96 },
    { time: "9 PM", value: 97 },
  ];

  // Metrics Data
  const metricsData = [
    {
      label: "Blood Sugar",
      value: "80 mg/dL",
      status: "Normal",
      statusColor: "#fbc02d",
      graphColor: "#FFA726",
      graphData: bloodSugarData,
      icon: "🩸",
    },
    {
      label: "Blood Pressure",
      value: "102/72 mmHg",
      status: "Normal",
      statusColor: "#4caf50",
      graphColor: "#66BB6A",
      graphData: bloodPressureData,
      icon: "💧",
    },
    {
      label: "Heart Rate",
      value: "98 bpm",
      status: "Normal",
      statusColor: "#e57373",
      graphColor: "#FF5252",
      graphData: heartRateData,
      icon: "❤️",
    },
    {
      label: "SpO2",
      value: "97%",
      status: "Normal",
      statusColor: "#42a5f5",
      graphColor: "#2196F3",
      graphData: spo2Data,
      icon: "🫁",
    },
  ];

  // Remedies Data
  const remedies = [
    { name: "Flu", remedy: "Drink plenty of fluids and rest." },
    { name: "Asthma", remedy: "Use prescribed inhalers and avoid triggers." },
    { name: "Diabetes Mellitus Type 1", remedy: "Manage blood sugar with insulin and a healthy diet." },
    { name: "Hypertension", remedy: "Reduce salt intake and exercise regularly." },
    { name: "Alzheimer's Disease", remedy: "Maintain a healthy diet and stay mentally active." },
    { name: "Breast Carcinoma", remedy: "Seek treatment from an oncologist and maintain a healthy lifestyle." },
    { name: "Coronary Artery Disease", remedy: "Maintain a heart-healthy diet and exercise." },
    { name: "Ischemic Stroke", remedy: "Take prescribed medication and follow physical therapy." },
  ];

  // File Upload Handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert(`File uploaded: ${file.name}`);
      // Here you can handle the uploaded file as per your requirement
    }
  };

  return (
    <div className="ml-64 p-8">
      {/* Static Metrics Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-[#00b894] mb-6">Health Metrics Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {metricsData.map((metric, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg flex flex-col items-center"
              style={{
                boxShadow:
                  "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Icon */}
              <div
                className="text-3xl mb-4"
                style={{
                  backgroundColor: `${metric.graphColor}22`,
                  borderRadius: "50%",
                  padding: "10px",
                }}
              >
                {metric.icon}
              </div>

              {/* Label and Value */}
              <h3 className="text-lg font-semibold mb-1">{metric.label}</h3>
              <p className="text-2xl font-bold mb-1">{metric.value}</p>

              {/* Status */}
              <span
                className="text-sm font-medium mb-4 px-3 py-1 rounded-md"
                style={{
                  backgroundColor: `${metric.statusColor}22`,
                  color: metric.statusColor,
                }}
              >
                {metric.status}
              </span>

              {/* Graph */}
              <ResponsiveContainer width="100%" height={50}>
                <LineChart data={metric.graphData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={metric.graphColor}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>

      {/* Health Charts Section */}
      <div className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calories Chart */}
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800">Calories Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={calorieData} dataKey="value" cx="50%" cy="50%" outerRadius={100}>
                  {calorieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

{/* Steps Chart */}
{/* Steps Chart */}
<div className="p-6 bg-white shadow-lg rounded-lg">
  <h3 className="text-lg font-semibold text-gray-800">Steps Walked</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={stepsData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
        dataKey="name" 
        interval={0} 
        style={{ fontSize: "12px" }} // Reduce font size here
      />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="steps" fill="#00C49F" />
    </BarChart>
  </ResponsiveContainer>
</div>


        </div>
      </div>

{/* Food Content Feature */}
<div
  className="p-6 bg-white rounded-lg flex justify-between items-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
  onClick={() => document.getElementById("fileInput").click()}
>
  <h3 className="text-lg font-semibold text-gray-800">
    Check Nutritional Content of Food
  </h3>
  <FiCamera size={24} className="text-[#00b894]" />
  <input
    type="file"
    id="fileInput"
    accept="image/*"
    style={{ display: "none" }}
    onChange={handleFileUpload}
  />
</div>



      {/* Remedies Section */}
      <div className="mt-10">
        <h2 className="text-3xl font-bold text-[#00b894] mb-6">Home Remedies</h2>
        <div className="grid grid-cols-1 gap-4">
          {remedies.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white shadow-md rounded-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600">{item.remedy}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;