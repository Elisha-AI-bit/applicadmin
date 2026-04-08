// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr1ac-YprCM5ci4dKKDuXNRYnmWWg21Ec",
  authDomain: "school-app-faaa3.firebaseapp.com",
  projectId: "school-app-faaa3",
  storageBucket: "school-app-faaa3.firebasestorage.app",
  messagingSenderId: "587478154868",
  appId: "1:587478154868:web:87896bf22ed5cf13969b21",
  measurementId: "G-3J3MJVL8MK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, storage, db, auth };
