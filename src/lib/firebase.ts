// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNKQg93V9oJjHAr5UaCupFUF6ANQ6hKd0",
  authDomain: "eventech-7411d.firebaseapp.com",
  projectId: "eventech-7411d",
  storageBucket: "eventech-7411d.firebasestorage.app",
  messagingSenderId: "517202316504",
  appId: "1:517202316504:web:ef4de681be9c4614f89bad",
  measurementId: "G-8LXMHPDMY9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);