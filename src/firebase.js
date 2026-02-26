// Import the functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc3uclgAmwDirfUWRTJG2zJxPvHDm1gMU",
  authDomain: "complain-portal-9026b.firebaseapp.com",
  databaseURL: "https://complain-portal-9026b-default-rtdb.firebaseio.com",
  projectId: "complain-portal-9026b",
  storageBucket: "complain-portal-9026b.firebasestorage.app",
  messagingSenderId: "767028303961",
  appId: "1:767028303961:web:34fd55b4d3be5494a4f948",
  measurementId: "G-PF61N4QC3W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();