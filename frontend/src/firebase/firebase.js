import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdS1vuFIKK4bcc2ivAQCD45bIfd4WJlH0",
  authDomain: "sicksense-imagine.firebaseapp.com",
  projectId: "sicksense-imagine",
  storageBucket: "sicksense-imagine.firebasestorage.app",
  messagingSenderId: "756838116975",
  appId: "1:756838116975:web:e12f27af03df5626a1a79a",
  measurementId: "G-C9GZLPEXEM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Firestore
const firestore = getFirestore(app);

// Export Firebase modules
export { app, auth, firestore };
