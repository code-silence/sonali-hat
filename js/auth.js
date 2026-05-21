// ফর্ম সুইচ করার ফাংশন
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

// পাসওয়ার্ড দেখা এবং লুকানোর ফাংশন
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
