/* ===================================================================
   registerPage.js
   Runs the registration page: reads the form, checks it,
   and shows the errors back to the user.
   =================================================================== */

import { isEmpty, isValidEmail, isLongEnough, doPasswordsMatch }
  from "../modules/validation.js";
import { getStudentByEmail, getStudentByNumber, createStudent }
  from "../modules/api.js";

const form = document.getElementById("registerForm");
const formAlert = document.getElementById("formAlert");
const registerButton = document.getElementById("registerButton");

/* Shows a red message under one field and marks the input. */
function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorSpan = document.getElementById(fieldId + "Error");

  input.classList.add("invalid");
  errorSpan.textContent = message;
  errorSpan.classList.remove("hidden");
}

/* Shows one message at the top of the form. */
function showFormAlert(message) {
  formAlert.textContent = message;
  formAlert.classList.add("alert-error");
  formAlert.classList.remove("hidden");
}

/* Removes the errors left from the previous attempt,
   so old messages do not stay on screen. */
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

/* Checks every field and shows a message for each problem.
   Returns true when the whole form is fine. */
function validateForm(student, confirmPassword) {
  let isValid = true;

  if (isEmpty(student.fullName)) {
    showFieldError("fullName", "Full name is required");
    isValid = false;
  }

  if (isEmpty(student.email)) {
    showFieldError("email", "Email is required");
    isValid = false;
  } else if (!isValidEmail(student.email)) {
    showFieldError("email", "Please enter a valid email");
    isValid = false;
  }

  if (isEmpty(student.studentNumber)) {
    showFieldError("studentId", "Student ID is required");
    isValid = false;
  }

  if (isEmpty(student.password)) {
    showFieldError("password", "Password is required");
    isValid = false;
  } else if (!isLongEnough(student.password)) {
    showFieldError("password", "Password must be at least 6 characters");
    isValid = false;
  }

  if (isEmpty(confirmPassword)) {
    showFieldError("confirmPassword", "Please confirm your password");
    isValid = false;
  } else if (!doPasswordsMatch(student.password, confirmPassword)) {
    showFieldError("confirmPassword", "Passwords do not match");
    isValid = false;
  }

  return isValid;
}

/* Asks the server whether this email or student ID is already used.
   Returns true when both are free. */
async function isNotTaken(student) {
  let isFree = true;

  const studentWithSameEmail = await getStudentByEmail(student.email);
  if (studentWithSameEmail) {
    showFieldError("email", "This email is already registered");
    isFree = false;
  }

  const studentWithSameNumber = await getStudentByNumber(student.studentNumber);
  if (studentWithSameNumber) {
    showFieldError("studentId", "This student ID is already registered");
    isFree = false;
  }

  return isFree;
}

/* Runs when the user presses the Create Account button. */
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const student = {
    fullName: document.getElementById("fullName").value.trim(),
    email: document.getElementById("email").value.trim(),
    studentNumber: document.getElementById("studentId").value.trim(),
    password: document.getElementById("password").value
  };
  const confirmPassword = document.getElementById("confirmPassword").value;

  clearErrors();

  if (!validateForm(student, confirmPassword)) {
    return;
  }

  /* The next checks talk to the server, which takes a moment.
     Disabling the button stops double submits. */
  registerButton.disabled = true;
  registerButton.textContent = "Checking...";

  try {
    const isFree = await isNotTaken(student);

    if (isFree) {
      registerButton.textContent = "Creating...";
      await createStudent(student);

      /* Send the new student to the login page.
         The flag tells that page to show a welcome message. */
      window.location.href = "index.html?registered=true";
      return;
    }
  } catch (error) {
    showFormAlert("Cannot reach the server. Is json-server running?");
  }

  registerButton.disabled = false;
  registerButton.textContent = "Create Account";
});
