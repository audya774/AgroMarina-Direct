import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB9G2ZlJLCtSJb5prKd5Q5GQU_2le80QTg",
  authDomain: "agromarina-direct.firebaseapp.com",
  projectId: "agromarina-direct",
  storageBucket: "agromarina-direct.firebasestorage.app",
  messagingSenderId: "511898377932",
  appId: "1:511898377932:web:007ca611f864f5e75b6c69",
  measurementId: "G-CDGQN1FHHN"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inisialisasi Firestore (Database)
export const db = getFirestore(app);

