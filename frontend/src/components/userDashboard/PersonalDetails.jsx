import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../contexts/authContext";

axios.defaults.baseURL = "http://localhost:5000";

const PersonalDetails = () => {
  const { currentUser } = useAuth();

  const [userInfo, setUserInfo] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
    allergies: "",
    illness: "",
    medication: "",
  });

  const [isEditing, setIsEditing] = useState(true);
  const [errors, setErrors] = useState({});

  userInfo.email = currentUser.email;

  // Function to validate a single field
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required.";
        }
        break;
      case "mobile":
        if (!/^[0-9]{10}$/.test(value)) {
          error = "Mobile number must be 10 digits.";
        }
        break;
      case "email":
        if (!value || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
          error = "Valid email is required.";
        }
        break;
      case "city":
        if (!value.trim()) {
          error = "City is required.";
        }
        break;
      case "age":
        if (!value || value < 5) {
          error = "Age must be at least 5.";
        }
        break;
      case "weight":
        if (!value || value <= 0) {
          error = "Weight must be a positive number.";
        }
        break;
      case "height":
        if (!value || value <= 0) {
          error = "Height must be a positive number.";
        }
        break;
      case "gender":
        if (!/^(M|F|Male|Female)$/i.test(value)) {
          error = "Gender must be 'M' or 'F'.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // Function to validate all fields (used before saving)
  const validateAll = () => {
    const newErrors = {};

    if (!userInfo.name.trim()) {
      newErrors.name = "Name is required.";
    }
    if (!/^[0-9]{10}$/.test(userInfo.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }
    if (!userInfo.city.trim()) {
      newErrors.city = "City is required.";
    }
    if (!userInfo.age || userInfo.age < 5) {
      newErrors.age = "Age must be at least 5.";
    }
    if (!userInfo.weight || userInfo.weight <= 0) {
      newErrors.weight = "Weight must be a positive number.";
    }
    if (!userInfo.height || userInfo.height <= 0) {
      newErrors.height = "Height must be a positive number.";
    }
    if (!/^(M|F|Male|Female)$/i.test(userInfo.gender)) {
      newErrors.gender = "Gender must be 'M' or 'F'.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchUserDetails = async (email) => {
    try {
      const response = await axios.get(`/profile/${email}`);
      if (response.data.success) {
        const user = response.data.data;

        const updatedUserInfo = {
          name: user.name || "",
          mobile: user.mobile || "",
          email: user.email || "",
          city: user.city || "",
          age: user.age || "",
          weight: user.weight || "",
          height: user.height || "",
          gender: user.gender || "",
          allergies: user.allergies || "",
          illness: user.illness || "",
          medication: user.medication || "",
        };

        setUserInfo(updatedUserInfo);
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };

  const handleSave = async () => {
    if (!validateAll()) {
      alert("Please fix the errors before saving.");
      return;
    }

    try {
      await axios.post("/profile", userInfo);
      alert("Details saved successfully!");

      setUserInfo((prevState) => ({
        ...prevState,
        ...userInfo,
      }));

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving details: ", error);
      alert("Failed to save details. Please try again.");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });

    // Optional: Validate on change for immediate feedback
    // validateField(name, value);
  };

  // Handle field validation onBlur
  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userInfo");

    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
      setIsEditing(false);
    } else if (currentUser?.email) {
      fetchUserDetails(currentUser.email);
    }
  }, [currentUser]);

  return (
    <motion.div
      className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-3xl font-bold text-[#00b894] mb-6">Personal Details</h2>
      <div className="flex-grow">
        {isEditing ? (
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-[#00b894] font-semibold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter your full name"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#00b894]"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* Mobile Field */}
              <div>
                <label className="block text-[#00b894] font-semibold">Phone Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={userInfo.mobile}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter your phone number"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.mobile
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#00b894]"
                  }`}
                />
                {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-[#00b894] font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter your email address"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#00b894]"
                  }`}
                  disabled
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Age Field */}
              <div>
                <label className="block text-[#00b894] font-semibold">Age</label>
                <input
                  type="number"
                  name="age"
                  value={userInfo.age}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter your age"
                  min="5"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.age
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#00b894]"
                  }`}
                />
                {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
              </div>

              {/* Weight Field */}
              <div>
                <label className="block text-[#00b894] font-semibold">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={userInfo.weight}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter your weight in kg"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.weight
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#00b894]"
                  }`}
                />
                {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
              </div>

              {/* Height Field */}
              <div>
                <label className="block text-[#00b894] font-semibold">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={userInfo.height}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter your height in cm"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.height
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#00b894]"
                  }`}
                />
                {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
              </div>

              {/* City Field */}
              <div>
                <label className="block text-[#00b894] font-semibold">City</label>
                <input
                  type="text"
                  name="city"
                  value={userInfo.city}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter your city"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.city
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#00b894]"
                  }`}
                />
                {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
              </div>

              {/* Gender Field */}
              <div>
                <label className="block text-[#00b894] font-semibold">Gender (M/F)</label>
                <input
                  type="text"
                  name="gender"
                  value={userInfo.gender}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Enter your gender (M/F)"
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.gender
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#00b894]"
                  }`}
                />
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
              </div>
            </div>

            {/* Allergies Field */}
            <div>
              <label className="block text-[#00b894] font-semibold">Allergies</label>
              <input
                type="text"
                name="allergies"
                value={userInfo.allergies}
                onChange={handleInputChange}
                placeholder="List any allergies (if any)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894]"
              />
            </div>

            {/* Past Illnesses Field */}
            <div>
              <label className="block text-[#00b894] font-semibold">Past Illnesses</label>
              <textarea
                name="illness"
                value={userInfo.illness}
                onChange={handleInputChange}
                placeholder="Mention any past illnesses"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894]"
                rows="3"
              ></textarea>
            </div>

            {/* Current Medication Field */}
            <div>
              <label className="block text-[#00b894] font-semibold">Current Medication</label>
              <textarea
                name="medication"
                value={userInfo.medication}
                onChange={handleInputChange}
                placeholder="Mention any ongoing medication"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00b894]"
                rows="3"
              ></textarea>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSave}
              className="w-full bg-[#00b894] text-white py-3 rounded-lg hover:bg-[#059f7d] transition"
            >
              Save
            </button>
          </form>
        ) : (
          // Display Mode
          <div className="space-y-4 max-w-4xl bg-white p-8 shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold text-[#00b894] mb-4">Your Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="font-medium">Name: <span className="text-gray-700">{userInfo.name}</span></div>
              <div className="font-medium">Email: <span className="text-gray-700">{userInfo.email}</span></div>
              <div className="font-medium">Phone Number: <span className="text-gray-700">{userInfo.mobile}</span></div>
              <div className="font-medium">City: <span className="text-gray-700">{userInfo.city}</span></div>
              <div className="font-medium">Age: <span className="text-gray-700">{userInfo.age}</span></div>
              <div className="font-medium">Weight: <span className="text-gray-700">{userInfo.weight} kg</span></div>
              <div className="font-medium">Height: <span className="text-gray-700">{userInfo.height} cm</span></div>
              <div className="font-medium">Gender: <span className="text-gray-700">{userInfo.gender}</span></div>
              <div className="font-medium">Allergies: <span className="text-gray-700">{userInfo.allergies || "None"}</span></div>
              <div className="font-medium">Past Illnesses: <span className="text-gray-700">{userInfo.illness || "None"}</span></div>
              <div className="font-medium">Current Medication: <span className="text-gray-700">{userInfo.medication || "None"}</span></div>
            </div>
            <button
              className="w-full bg-[#00b894] text-white py-3 px-4 rounded hover:bg-[#059f7d] transition"
              onClick={handleEdit}
            >
              Edit
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PersonalDetails;
