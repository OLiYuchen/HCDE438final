// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1UuSzIdfpxGd_lE-EGgpayfEvx5KIFyc",
  authDomain: "habits-app-ab563.firebaseapp.com",
  projectId: "habits-app-ab563",
  storageBucket: "habits-app-ab563.firebasestorage.app",
  messagingSenderId: "1006174073960",
  appId: "1:1006174073960:web:5b63323d31ef45c173f7dd",
  measurementId: "G-X9R2VWL7RQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);