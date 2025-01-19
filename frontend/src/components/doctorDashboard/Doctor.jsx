// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaCheck, FaTimes, FaVideo } from "react-icons/fa";

// axios.defaults.baseURL = "http://localhost:5000";

// const Doctor = () => {
//   const doctorId = "6778340a4cdcb54f10f06ca9"; // Replace with the logged-in doctor's ID
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [scheduleList, setScheduleList] = useState({}); // Track schedule for each patient
//   const [statusList, setStatusList] = useState({}); // Track confirmation status for each patient

//   useEffect(() => {
//     fetchPatients();
//   }, []);

//   const fetchPatients = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`/api/doctor/${doctorId}/patients`);
//       console.log("Fetched Patients:", response.data.patients);
//       setPatients(response.data.patients || []);
//     } catch (error) {
//       console.error("Failed to fetch patients:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReject = async (patientEmail) => {
//     try {
//       await axios.post(`/sendrejectmail/${patientEmail}`);
//       fetchPatients();
//     } catch (error) {
//       console.error("Failed to reject patient:", error);
//     }
//   };

//   const handleApprove = async (patientEmail) => {
//     const schedule = scheduleList[patientEmail];
//     if (!schedule) {
//       alert("Please set a preferred date and time before approval.");
//       return;
//     }

//     try {
//       await axios.post(`/sendapprovemail/${patientEmail}`, { schedule });
//       fetchPatients();
//     } catch (error) {
//       console.error("Failed to approve patient:", error);
//     }
//   };

//   const handleScheduleChange = (patientEmail, value) => {
//     setScheduleList((prev) => ({ ...prev, [patientEmail]: value }));
//   };

//   const handleStatusChange = (e, patientEmail) => {
//     const value = e.target.value;
//     setStatusList((prev) => ({ ...prev, [patientEmail]: value }));
//   };

//   const handleVideoCall = (patientEmail) => {
//     const status = statusList[patientEmail];
//     if (status === "Confirmed") {
//       alert(`Starting a video call with ${patientEmail}...`);
//     } else if (status === "Cancelled") {
//       alert("The consultation was cancelled.");
//     } else if (status === "Rescheduled") {
//       alert("The consultation has been rescheduled.");
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen pt-20">
//       <h1 className="text-4xl font-bold text-[#00b894] mb-8 text-center">
//         Doctor Panel
//       </h1>
//       {loading ? (
//         <p className="text-gray-600 text-center">Loading...</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
//             <thead>
//               <tr className="bg-[#00b894] text-white text-left">
//                 <th className="p-4">Name</th>
//                 <th className="p-4">Email</th>
//                 <th className="p-4">Mobile</th>
//                 <th className="p-4">Date and Time</th>
//                 <th className="p-4">Confirmation</th>
//                 <th className="p-4">Health Report</th>
//                 <th className="p-4">Video Call</th>
//               </tr>
//             </thead>
//             <tbody>
//               {patients.length > 0 ? (
//                 patients.map((patient, index) => (
//                   <tr key={index} className="border-b last:border-none">
//                     <td className="p-4 text-gray-700">{patient.name}</td>
//                     <td className="p-4 text-gray-700">{patient.email}</td>
//                     <td className="p-4 text-gray-700">{patient.mobile}</td>
//                     <td className="p-4">
//                       <input
//                         type="datetime-local"
//                         className="w-full p-2 border border-gray-300 rounded"
//                         value={scheduleList[patient.email] || ""}
//                         onChange={(e) =>
//                           handleScheduleChange(patient.email, e.target.value)
//                         }
//                       />
//                     </td>
//                     <td className="p-4">
//                       <select
//                         className="p-2 border rounded"
//                         value={statusList[patient.email] || "Pending"}
//                         onChange={(e) => handleStatusChange(e, patient.email)}
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Confirmed" className="text-green-500">
//                           Confirmed
//                         </option>
//                         <option value="Cancelled" className="text-red-500">
//                           Cancelled
//                         </option>
//                         <option value="Rescheduled" className="text-yellow-500">
//                           Rescheduled
//                         </option>
//                       </select>
//                     </td>
//                     <td className="p-4 text-center">
//                       <a
//                         href={patient.healthReportUrl || "#"}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="bg-[#00b894] text-white px-3 py-1 rounded hover:bg-[#059f7d] focus:outline-none inline-block"
//                       >
//                         View Report
//                       </a>
//                     </td>
//                     <td className="p-4 text-center">
//                       <button
//                         onClick={() => handleVideoCall(patient.email)}
//                         className="bg-[#00b894] text-white px-3 py-1 rounded hover:bg-[#059f7d] focus:outline-none inline-block"
//                       >
//                         <FaVideo className="inline-block mr-1" /> Start Call
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="p-4 text-center text-gray-500">
//                     No patients found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Doctor;



// frontend/src/components/doctorDashboard/Doctor.jsx

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { FaVideo } from "react-icons/fa";
// import { io } from "socket.io-client";

// // Replace with your actual signaling server URL
// const signalingServerUrl = "http://localhost:5001";

// const Doctor = () => {
//   const doctorId = "6778340a4cdcb54f10f06ca9"; // Replace with the logged-in doctor's ID
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [scheduleList, setScheduleList] = useState({}); // Track schedule for each patient
//   const [statusList, setStatusList] = useState({}); // Track confirmation status for each patient
//   const [isVideoCallActive, setIsVideoCallActive] = useState(false);
//   const [currentRoomId, setCurrentRoomId] = useState(null);
//   const [currentPatient, setCurrentPatient] = useState(null); // Stores patient info during the call
//   const [userName, setUserName] = useState("Dr. Chatterjee"); // Replace with actual doctor's name

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnection = useRef(null);
//   const socketRef = useRef(null);

//   useEffect(() => {
//     fetchPatients();

//     // Initialize Socket.IO client
//     socketRef.current = io(signalingServerUrl);

//     // Listen for 'call_started' events from doctors (optional if doctors can receive calls)
//     // In this context, doctors are initiating calls, so this might not be necessary.

//     // Clean up on unmount
//     return () => {
//       socketRef.current.disconnect();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (currentRoomId) {
//       setupWebRTC();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentRoomId]);

//   const fetchPatients = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`/api/doctor/${doctorId}/patients`);
//       console.log("Fetched Patients:", response.data.patients);
//       setPatients(response.data.patients || []);
//     } catch (error) {
//       console.error("Failed to fetch patients:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setupWebRTC = async () => {
//     peerConnection.current = new RTCPeerConnection({
//       iceServers: [
//         { urls: "stun:stun.l.google.com:19302" }, // Google's public STUN server
//       ],
//     });

//     // Handle local stream
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//       localVideoRef.current.srcObject = stream;
//       stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));
//     } catch (err) {
//       console.error("Error accessing media devices.", err);
//       alert("Could not access camera and microphone.");
//       return;
//     }

//     // Handle remote stream
//     peerConnection.current.ontrack = (event) => {
//       remoteVideoRef.current.srcObject = event.streams[0];
//     };

//     // Handle ICE candidates
//     peerConnection.current.onicecandidate = (event) => {
//       if (event.candidate) {
//         socketRef.current.emit("signal", { roomId: currentRoomId, payload: { candidate: event.candidate } });
//       }
//     };

//     // Handle incoming signaling messages
//     socketRef.current.on("signal", async (payload) => {
//       if (payload.offer) {
//         try {
//           await peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.offer));
//           const answer = await peerConnection.current.createAnswer();
//           await peerConnection.current.setLocalDescription(answer);
//           socketRef.current.emit("signal", { roomId: currentRoomId, payload: { answer } });
//         } catch (e) {
//           console.error("Error handling offer", e);
//         }
//       } else if (payload.answer) {
//         try {
//           await peerConnection.current.setRemoteDescription(new RTCSessionDescription(payload.answer));
//         } catch (e) {
//           console.error("Error setting remote description", e);
//         }
//       } else if (payload.candidate) {
//         try {
//           await peerConnection.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
//         } catch (e) {
//           console.error("Error adding received ICE candidate", e);
//         }
//       }
//     });

//     // Create and send offer
//     try {
//       const offer = await peerConnection.current.createOffer();
//       await peerConnection.current.setLocalDescription(offer);
//       socketRef.current.emit("signal", { roomId: currentRoomId, payload: { offer } });
//     } catch (e) {
//       console.error("Error creating offer", e);
//     }
//   };

//   const handleReject = async (patientEmail) => {
//     try {
//       await axios.post(`/sendrejectmail/${patientEmail}`);
//       fetchPatients();
//     } catch (error) {
//       console.error("Failed to reject patient:", error);
//     }
//   };

//   const handleApprove = async (patientEmail) => {
//     const schedule = scheduleList[patientEmail];
//     if (!schedule) {
//       alert("Please set a preferred date and time before approval.");
//       return;
//     }

//     try {
//       await axios.post(`/sendapprovemail/${patientEmail}`, { schedule });
//       fetchPatients();
//     } catch (error) {
//       console.error("Failed to approve patient:", error);
//     }
//   };

//   const handleScheduleChange = (patientEmail, value) => {
//     setScheduleList((prev) => ({ ...prev, [patientEmail]: value }));
//   };

//   const handleStatusChange = (e, patientEmail) => {
//     const value = e.target.value;
//     setStatusList((prev) => ({ ...prev, [patientEmail]: value }));
//   };

//   const handleVideoCall = (patientEmail, patientName, patientSpecialty) => {
//     const roomId = `${doctorId}-${patientEmail}`; // Unique room ID per doctor-patient pair
//     setCurrentRoomId(roomId);
//     setIsVideoCallActive(true);
//     socketRef.current.emit("join_room", roomId);
//     socketRef.current.emit("signal", {
//       roomId,
//       payload: {
//         offer: null, // Initiating call without a pre-created offer
//       },
//     });
//     // In this implementation, the offer is created in setupWebRTC
//     setCurrentPatient({
//       name: patientName,
//       specialty: patientSpecialty,
//     }); // Set currentPatient for the modal
//   };

//   const handleEndCall = () => {
//     // Close the peer connection
//     if (peerConnection.current) {
//       peerConnection.current.close();
//       peerConnection.current = null;
//     }

//     // Stop all local tracks
//     if (localVideoRef.current && localVideoRef.current.srcObject) {
//       localVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
//       localVideoRef.current.srcObject = null;
//     }

//     // Remove remote stream
//     if (remoteVideoRef.current) {
//       remoteVideoRef.current.srcObject = null;
//     }

//     // Leave the room
//     if (currentRoomId) {
//       socketRef.current.emit("leave_room", currentRoomId);
//     }

//     // Reset states
//     setIsVideoCallActive(false);
//     setCurrentRoomId(null);
//     setCurrentPatient(null);
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen pt-20">
//       <h1 className="text-4xl font-bold text-[#00b894] mb-8 text-center">
//         Doctor Panel
//       </h1>
//       {loading ? (
//         <p className="text-gray-600 text-center">Loading...</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
//             <thead>
//               <tr className="bg-[#00b894] text-white text-left">
//                 <th className="p-4">Name</th>
//                 <th className="p-4">Email</th>
//                 <th className="p-4">Mobile</th>
//                 <th className="p-4">Date and Time</th>
//                 <th className="p-4">Confirmation</th>
//                 <th className="p-4">Health Report</th>
//                 <th className="p-4">Video Call</th>
//               </tr>
//             </thead>
//             <tbody>
//               {patients.length > 0 ? (
//                 patients.map((patient, index) => (
//                   <tr key={index} className="border-b last:border-none">
//                     <td className="p-4 text-gray-700">{patient.name}</td>
//                     <td className="p-4 text-gray-700">{patient.email}</td>
//                     <td className="p-4 text-gray-700">{patient.mobile}</td>
//                     <td className="p-4">
//                       <input
//                         type="datetime-local"
//                         className="w-full p-2 border border-gray-300 rounded"
//                         value={scheduleList[patient.email] || ""}
//                         onChange={(e) =>
//                           handleScheduleChange(patient.email, e.target.value)
//                         }
//                       />
//                     </td>
//                     <td className="p-4">
//                       <select
//                         className="p-2 border rounded"
//                         value={statusList[patient.email] || "Pending"}
//                         onChange={(e) => handleStatusChange(e, patient.email)}
//                       >
//                         <option value="Pending">Pending</option>
//                         <option value="Confirmed" className="text-green-500">
//                           Confirmed
//                         </option>
//                         <option value="Cancelled" className="text-red-500">
//                           Cancelled
//                         </option>
//                         <option value="Rescheduled" className="text-yellow-500">
//                           Rescheduled
//                         </option>
//                       </select>
//                     </td>
//                     <td className="p-4 text-center">
//                       <a
//                         href={patient.healthReportUrl || "#"}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="bg-[#00b894] text-white px-3 py-1 rounded hover:bg-[#059f7d] focus:outline-none inline-block"
//                       >
//                         View Report
//                       </a>
//                     </td>
//                     <td className="p-4 text-center">
//                       <button
//                         onClick={() =>
//                           handleVideoCall(patient.email, patient.name, patient.specialty)
//                         }
//                         className="bg-[#00b894] text-white px-3 py-1 rounded hover:bg-[#059f7d] focus:outline-none inline-block"
//                       >
//                         <FaVideo className="inline-block mr-1" /> Start Call
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="p-4 text-center text-gray-500">
//                     No patients found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}
//       {/* Video Call Modal */}
//       {isVideoCallActive && currentPatient && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-3xl">
//             <h2 className="text-2xl font-bold text-[#00b894] mb-4">
//               Video Call with {currentPatient.name}
//             </h2>
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-2">You ({userName})</h3>
//                 <video
//                   ref={localVideoRef}
//                   autoPlay
//                   muted
//                   className="w-full h-64 bg-gray-200 rounded"
//                 />
//               </div>
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold text-gray-700 mb-2">{currentPatient.name}</h3>
//                 <video
//                   ref={remoteVideoRef}
//                   autoPlay
//                   className="w-full h-64 bg-gray-200 rounded"
//                 />
//               </div>
//             </div>
//             <button
//               onClick={handleEndCall}
//               className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
//             >
//               End Call
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Doctor;


// src/components/doctorDashboard/Doctor.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added useNavigate import
import { FaVideo } from "react-icons/fa";
import axios from "axios";

const Doctor = () => {
  const doctorId = "6778340a4cdcb54f10f06ca9"; // Replace with the logged-in doctor's ID
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scheduleList, setScheduleList] = useState({});
  const [statusList, setStatusList] = useState({});
  const navigate = useNavigate(); // useNavigate hook for redirection

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/doctor/${doctorId}/patients`);
      setPatients(response.data.patients || []);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoCall = (patientEmail, patientName) => {
    // Navigate to DoctorCallPage with the patient details
    navigate("/doctor/call", {
      state: { patientEmail, patientName },
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen pt-20">
      <h1 className="text-4xl font-bold text-[#00b894] mb-8 text-center">
        Doctor Panel
      </h1>
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
                <th className="p-4">Date and Time</th>
                <th className="p-4">Confirmation</th>
                <th className="p-4">Health Report</th>
                <th className="p-4">Video Call</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient, index) => (
                  <tr key={index} className="border-b last:border-none">
                    <td className="p-4 text-gray-700">{patient.name}</td>
                    <td className="p-4 text-gray-700">{patient.email}</td>
                    <td className="p-4 text-gray-700">{patient.mobile}</td>
                    <td className="p-4">
                      <input
                        type="datetime-local"
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </td>
                    <td className="p-4">
                      <select
                        className="p-2 border rounded"
                        value={statusList[patient.email] || "Pending"}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed" className="text-green-500">
                          Confirmed
                        </option>
                        <option value="Cancelled" className="text-red-500">
                          Cancelled
                        </option>
                        <option value="Rescheduled" className="text-yellow-500">
                          Rescheduled
                        </option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <a
                        href={patient.healthReportUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#00b894] text-white px-3 py-1 rounded hover:bg-[#059f7d] focus:outline-none inline-block"
                      >
                        View Report
                      </a>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleVideoCall(patient.email, patient.name)}
                        className="bg-[#00b894] text-white px-3 py-1 rounded hover:bg-[#059f7d] focus:outline-none inline-block"
                      >
                        <FaVideo className="inline-block mr-1" /> Start Call
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No patients found.
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

export default Doctor;
