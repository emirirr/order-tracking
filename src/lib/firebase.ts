// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
<<<<<<< HEAD
=======
import { getAnalytics, isSupported } from "firebase/analytics";
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
<<<<<<< HEAD
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
=======
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
const firebaseConfig = {
  apiKey: "AIzaSyAJVw7940Ayc0lposv8dNNVnu5xvUqeNDs",
  authDomain: "kuta-f02d2.firebaseapp.com",
  projectId: "kuta-f02d2",
<<<<<<< HEAD
  storageBucket: "kuta-f02d2.firebasestorage.app",
=======
  storageBucket: "kuta-f02d2.appspot.com",
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
  messagingSenderId: "1065370220535",
  appId: "1:1065370220535:web:487336f7220d083a0720f2",
  measurementId: "G-2TZXB8XSJP"
};

<<<<<<< HEAD
// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth }; 
=======
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
>>>>>>> a7790e561d22362d6dca1f1a3b8024df167f6b14
