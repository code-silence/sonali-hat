// Auth page helper functions and event handlers.
// This file controls form switching, password visibility, and Firebase auth actions.

// Switch between login, signup, and forgot-password forms.
function switchForm(formId) {
  const forms = document.querySelectorAll(".form-box");
  forms.forEach((form) => {
    form.classList.remove("active-form");
    form.classList.add("hidden-form");
  });

  const activeForm = document.getElementById(formId);
  activeForm.classList.remove("hidden-form");
  activeForm.classList.add("active-form");
}

// Toggle the password input visibility and swap the eye icon state.
function togglePassword(icon) {
  const inputField = icon.previousElementSibling;
  if (inputField.type === "password") {
    inputField.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    inputField.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

// Cache DOM elements for the login/signup/reset forms.
const loginForm = document.getElementById("loginFormElement");
const signupForm = document.getElementById("signupFormElement");
const forgotForm = document.getElementById("forgotFormElement");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const resetEmail = document.getElementById("resetEmail");

// Display a message to the user using the browser alert.
function showMessage(message) {
  alert(message);
}

// Handle login form submission with Firebase authentication.
function handleLogin(event) {
  event.preventDefault();

  if (!window.firebaseAuth || !window.firebaseSignInWithEmailAndPassword) {
    console.error("Firebase Auth is not initialized.");
    showMessage(
      "ফায়ারবেস লোড করতে সমস্যা হয়েছে। পেজটি রিফ্রেশ করুন এবং আবার চেষ্টা করুন।",
    );
    return;
  }

  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    showMessage("দয়া করে ইমেইল ও পাসওয়ার্ড প্রদান করুন।");
    return;
  }

  window
    .firebaseSignInWithEmailAndPassword(window.firebaseAuth, email, password)
    .then(() => {
      showMessage("সফলভাবে লগইন হয়েছে।");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error(error);
      showMessage(`লগইন ব্যর্থ: ${error.message}`);
    });
}

// Handle signup form submission and create a new Firebase user.
function handleSignup(event) {
  event.preventDefault();

  if (!window.firebaseAuth || !window.firebaseCreateUserWithEmailAndPassword) {
    console.error("Firebase Auth is not initialized.");
    showMessage(
      "ফায়ারবেস লোড করতে সমস্যা হয়েছে। পেজটি রিফ্রেশ করুন এবং আবার চেষ্টা করুন।",
    );
    return;
  }

  const name = signupName.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();
  const role =
    document.querySelector('input[name="userRole"]:checked')?.value || "buyer";

  if (!name || !email || !password) {
    showMessage("দয়া করে নাম, ইমেইল ও পাসওয়ার্ড পূরণ করুন।");
    return;
  }

  window
    .firebaseCreateUserWithEmailAndPassword(
      window.firebaseAuth,
      email,
      password,
    )
    .then(() => {
      showMessage(`রেজিস্ট্রেশন সম্পন্ন হয়েছে। আপনার ভূমিকা: ${role}`);
      signupForm.reset();
      switchForm("loginForm");
    })
    .catch((error) => {
      console.error(error);
      showMessage(`রেজিস্ট্রেশন ব্যর্থ: ${error.message}`);
    });
}

// Handle forgot-password form submission and send a reset email.
function handleReset(event) {
  event.preventDefault();

  if (!window.firebaseAuth || !window.firebaseSendPasswordResetEmail) {
    console.error("Firebase Auth is not initialized.");
    showMessage(
      "ফায়ারবেস লোড করতে সমস্যা হয়েছে। পেজটি রিফ্রেশ করুন এবং আবার চেষ্টা করুন।",
    );
    return;
  }

  const email = resetEmail.value.trim();
  if (!email) {
    showMessage("দয়া করে ইমেইল প্রদান করুন।");
    return;
  }

  window
    .firebaseSendPasswordResetEmail(window.firebaseAuth, email)
    .then(() => {
      showMessage("পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।");
      forgotForm.reset();
      switchForm("loginForm");
    })
    .catch((error) => {
      console.error(error);
      showMessage(`রিসেট ব্যর্থ: ${error.message}`);
    });
}

// Register form submit listeners only when the corresponding form exists.
if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

if (signupForm) {
  signupForm.addEventListener("submit", handleSignup);
}

if (forgotForm) {
  forgotForm.addEventListener("submit", handleReset);
}
