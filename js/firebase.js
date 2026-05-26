import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDduU3_gEc-a2lAdzNARc-McOHmwQSRxYY",
  authDomain: "sonali-hat.firebaseapp.com",
  projectId: "sonali-hat",
  storageBucket: "sonali-hat.firebasestorage.app",
  messagingSenderId: "173273844485",
  appId: "1:173273844485:web:95d1f2f48e839b4e1fc56c",
  measurementId: "G-G1S5MYBT1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);