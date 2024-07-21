// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "ai-trip-e5c6b.firebaseapp.com",
  projectId: "ai-trip-e5c6b",
  storageBucket: "ai-trip-e5c6b.appspot.com",
  messagingSenderId: "907565777912",
  appId: "1:907565777912:web:7485e004d2bfc42344cc0d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);