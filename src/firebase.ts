// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1zU1qtJ76dJ1rBDpHHQFFhilpohMjvoI",
  authDomain: "studentstudy-b4ee8.firebaseapp.com",
  projectId: "studentstudy-b4ee8",
  storageBucket: "studentstudy-b4ee8.firebasestorage.app",
  messagingSenderId: "336227925326",
  appId: "1:336227925326:web:bb222f14e490ac018df21f",
  measurementId: "G-3ERE3R7RDN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);

export { app, analytics };
