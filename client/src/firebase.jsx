// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-8722b.firebaseapp.com",
  projectId: "mern-estate-8722b",
  storageBucket: "mern-estate-8722b.appspot.com",
  messagingSenderId: "57485350034",
  appId: "1:57485350034:web:453524018c07557269024b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);