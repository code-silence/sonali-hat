// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8BPLnOXBYW7QS-a3qg5lSViHM40uMS98",
  authDomain: "sonali-hat-1c603.firebaseapp.com",
  projectId: "sonali-hat-1c603",
  storageBucket: "sonali-hat-1c603.firebasestorage.app",
  messagingSenderId: "255090110243",
  appId: "1:255090110243:web:9203cb506d69b6a5762696",
  measurementId: "G-K6HRFHJXSV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Map everything to the global window object to satisfy auth.js
window.firebaseAuth = auth;
window.firebaseCreateUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.firebaseSignInWithEmailAndPassword = signInWithEmailAndPassword;
window.firebaseSendPasswordResetEmail = sendPasswordResetEmail;

console.log("Firebase initialized for Sonali Hat!");