/* ===================================================================
   loginPage.js
   Runs the login page: checks the form, asks the server whether the
   email and password match a student, and starts the session.
   =================================================================== */

import { isEmpty, isValidEmail } from "../modules/validation.js";
import { getStudentByEmail } from "../modules/api.js";
import { saveSession, redirectIfLoggedIn } from "../modules/session.js";

/* Runs before anything else: a student who is already logged in
   is sent straight to the dashboard. */
redirectIfLoggedIn();

const form = document.getElementById("loginForm");
const formAlert = document.getElementById("formAlert");
const loginButton = document.getElementById("loginButton");

/* Shows a red message under one field and marks the input. */
function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorSpan = document.getElementById(fieldId + "Error");

  input.classList.add("invalid");
  errorSpan.textContent = message;
  errorSpan.classList.remove("hidden");
}

/* Shows one message at the top of the form, green or red. */
function showFormAlert(message, type) {
  formAlert.textContent = message;
  formAlert.classList.remove("alert-error", "alert-success", "hidden");
  formAlert.classList.add("alert-" + type);
}

/* Removes the errors left from the previous attempt. */
function clearErrors() {
  const inputs = form.querySelectorAll("input");
  inputs.forEach(function (input) {
    input.classList.remove("invalid");
  });

  const errorSpans = form.querySelectorAll(".error-text");
  errorSpans.forEach(function (span) {
    span.textContent = "";
    span.classList.add("hidden");
  });

  formAlert.classList.add("hidden");
}

/* Checks the two fields are filled in and the email looks right. */
function validateForm(email, password) {
  let isValid = true;

  if (isEmpty(email)) {
    showFieldError("email", "Email is required");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showFieldError("email", "Please enter a valid email");
    isValid = false;
  }

  if (isEmpty(password)) {
    showFieldError("password", "Password is required");
    isValid = false;
  }

  return isValid;
}

/* The register page sends the user here with ?registered=true
   after creating an account, so we greet them. */
function showRegisteredMessage() {
  const params = new URLSearchParams(window.location.search);

  if (params.get("registered") === "true") {
    showFormAlert("Your account is ready. Please log in.", "success");
  }
}

showRegisteredMessage();

/* Runs when the user presses the Log In button. */
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  clearErrors();

  if (!validateForm(email, password)) {
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = "Logging in...";

  try {
    const student = await getStudentByEmail(email);

    /* The same message for a missing account and a wrong password,
       so the page never reveals which emails are registered. */
    if (!student || student.password !== password) {
      showFormAlert("Wrong email or password", "error");
    } else {
      saveSession(student, rememberMe);
      window.location.href = "dashboard.html";
      return;
    }
  } catch (error) {
    showFormAlert("Cannot reach the server. Is json-server running?", "error");
  }

  loginButton.disabled = false;
  loginButton.textContent = "Log In";
});
