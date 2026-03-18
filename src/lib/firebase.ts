// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCC5lA37CluxUA3yUHOWNLOnEFIfrbWnu0",
  authDomain: "bravecard.firebaseapp.com",
  databaseURL: "https://bravecard-default-rtdb.firebaseio.com",
  projectId: "bravecard",
  storageBucket: "bravecard.firebasestorage.app",
  messagingSenderId: "136694026244",
  appId: "1:136694026244:web:a7913dd4e1b9f875f16551",
  measurementId: "G-X3CRHB47HW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
