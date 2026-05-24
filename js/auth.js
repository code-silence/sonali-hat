
import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

/* ---------------- UI HELPERS ---------------- */

function switchForm(formId) {
  const forms = document.querySelectorAll(".form-box");

  forms.forEach((form) => {
    form.classList.remove("active-form");
    form.classList.add("hidden-form");
  });

  const activeForm = document.getElementById(formId);
  activeForm.classList.add("active-form");
  activeForm.classList.remove("hidden-form");
}

function togglePassword(icon) {
  const input = icon.previousElementSibling;

  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  }
}

window.switchForm = switchForm;
window.togglePassword = togglePassword;

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  try {
    const userSnap = await getDoc(doc(db, "users", user.uid));
    const role = userSnap.exists() ? userSnap.data().role : "buyer";
    if (role === "seller") {
      window.location.href = "dashboard.html";
      return;
    }
    window.location.href = "index.html";
  } catch (error) {
    console.error("Auth state redirect error:", error);
  }
});

/* ---------------- FORM ELEMENTS ---------------- */

const loginForm = document.getElementById("loginFormElement");
const signupForm = document.getElementById("signupFormElement");
const forgotForm = document.getElementById("forgotFormElement");

/* ---------------- SIGNUP ---------------- */

signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const role = document.querySelector('input[name="userRole"]:checked').value;

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    const user = userCred.user;

    // SAVE USER DATA + ROLE
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role,
      createdAt: Date.now()
    });

    alert("Registration successful!");
    switchForm("loginForm");

  } catch (err) {
    alert(err.message);
  }
});

/* ---------------- LOGIN ---------------- */

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    const user = userCred.user;

    // GET ROLE FROM FIRESTORE
    const userSnap = await getDoc(doc(db, "users", user.uid));

    const role = userSnap.exists() ? userSnap.data().role : "buyer";

    alert("Login successful!");

    // REDIRECT BASED ON ROLE
    if (role === "seller") {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "index.html";
    }

  } catch (err) {
    alert(err.message);
  }
});

/* ---------------- RESET PASSWORD ---------------- */

forgotForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("resetEmail").value;

  try {
    await sendPasswordResetEmail(auth, email);

    alert("Password reset email sent!");
    switchForm("loginForm");

  } catch (err) {
    alert(err.message);
  }
});