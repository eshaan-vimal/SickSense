import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";

const DoctorCallPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { patientEmail, patientName } = location.state; // Get patient details passed during navigation

  const appId = "4b5344c73dfe4a289ac73899b6caffe7"; // Replace with your Agora App ID
  const token = "007eJxTYLBRWK905/1Tx3VNKjs23Sy9mi3rOrVny6FL8bM3/lz496KVAoNJkqmxiUmyuXFKWqpJopGFZSKQbWFpmWSWnJiWlmpukded3hDIyHCvS4WJkQECQXw+hpT85JL8It2CxJLM1LwSBgYApHImgg=="; // Replace with your token
  const channel = "doctor-patient"; // Must match the patient's channel

  const [isInCall, setIsInCall] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const client = useRef(null);
  const localAudioTrack = useRef(null);
  const localVideoTrack = useRef(null);

  useEffect(() => {
    // Initialize Agora client
    client.current = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // Setup WebRTC once the patient details are available
    setupWebRTC();

    return () => {
      if (client.current) {
        client.current.leave();
      }
    };
  }, []);

  const setupWebRTC = async () => {
    try {
      // Join the Agora channel
      await client.current.join(appId, channel, token, null);

      // Create local tracks (audio + video)
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      localAudioTrack.current = audioTrack;
      localVideoTrack.current = videoTrack;

      // Play local video in the local video container
      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      // Publish local tracks
      await client.current.publish([audioTrack, videoTrack]);

      // Handle remote stream (the patient's feed)
      client.current.on("user-published", async (user, mediaType) => {
        await client.current.subscribe(user, mediaType);
        if (mediaType === "video" && remoteVideoRef.current) {
          user.videoTrack?.play(remoteVideoRef.current);
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      setIsInCall(true); // Set call state to true
    } catch (error) {
      console.error("Error joining call:", error);
    }
  };

  const endCall = async () => {
    try {
      // Stop the local tracks and leave the channel
      localAudioTrack.current?.close();
      localVideoTrack.current?.close();
      await client.current.unpublish([localAudioTrack.current, localVideoTrack.current]);
      await client.current.leave();
      
      setIsInCall(false);
      navigate("/doctor"); // Redirect to the doctor dashboard after call ends
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen pt-20">
      <h1 className="text-4xl font-bold text-[#00b894] mb-8 text-center">
        Video Call with {patientName}
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">You ({'Dr. Chatterjee'})</h3>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="w-full h-[460px] bg-gray-200 rounded"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{patientName}</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-[460px] bg-gray-200 rounded"
          />
        </div>
      </div>
      <button
        onClick={endCall}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none"
      >
        End Call
      </button>
    </div>
  );
};

export default DoctorCallPage;
