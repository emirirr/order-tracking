// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJVw7940Ayc0lposv8dNNVnu5xvUqeNDs",
  authDomain: "kuta-f02d2.firebaseapp.com",
  projectId: "kuta-f02d2",
  storageBucket: "kuta-f02d2.firebasestorage.app",
  messagingSenderId: "1065370220535",
  appId: "1:1065370220535:web:487336f7220d083a0720f2",
  measurementId: "G-2TZXB8XSJP"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth }; 