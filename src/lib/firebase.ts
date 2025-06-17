// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJVw7940Ayc0lposv8dNNVnu5xvUqeNDs",
  authDomain: "kuta-f02d2.firebaseapp.com",
  projectId: "kuta-f02d2",
  storageBucket: "kuta-f02d2.appspot.com",
  messagingSenderId: "1065370220535",
  appId: "1:1065370220535:web:487336f7220d083a0720f2",
  measurementId: "G-2TZXB8XSJP"
};

// Initialize Firebase (singleton pattern for Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Analytics sadece browser ortamında çalışır
let analytics: ReturnType<typeof getAnalytics> | undefined = undefined;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
