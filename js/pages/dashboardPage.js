/* ===================================================================
   dashboardPage.js
   Runs the dashboard: shows who is logged in and handles logout.
   =================================================================== */

import { requireLogin, getSession, clearSession, updateSession } from "../modules/session.js";
import { getEnrollments, getCourses, getTeachers, getStudentByEmail, updateStudent }
  from "../modules/api.js";
import { isEmpty, isValidEmail } from "../modules/validation.js";

/* Runs before anything else. A visitor who is not logged in is sent
   back to the login page, and isLoggedIn stays false so the rest
   of this file does not try to read a session that is not there. */
const isLoggedIn = requireLogin();

const logoutButton = document.getElementById("logoutButton");
const coursesBody = document.getElementById("coursesBody");
const coursesMessage = document.getElementById("coursesMessage");
const profileDetails = document.getElementById("profileDetails");
const profileForm = document.getElementById("profileForm");
const profileAlert = document.getElementById("profileAlert");
const editProfileButton = document.getElementById("editProfileButton");
const editActions = document.getElementById("editActions");
const saveProfileButton = document.getElementById("saveProfileButton");
const cancelEditButton = document.getElementById("cancelEditButton");

/* Turns the stored login time into something a person can read,
   for example "7 Oct 2026, 22:05". */
function formatLoginTime(loginTime) {
  const date = new Date(loginTime);

  return date.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

/* Fills the welcome line and the profile card from the session.
   No server call is needed because the session already holds
   the name, email and student number saved at login. */
function showStudent() {
  const session = getSession();

  document.getElementById("welcomeName").textContent = session.name;
  document.getElementById("profileName").textContent = session.name;
  document.getElementById("profileEmail").textContent = session.email;
  document.getElementById("profileStudentId").textContent = session.studentNumber;
  document.getElementById("profileLoginTime").textContent = formatLoginTime(session.loginTime);
}

/* Ends the session and sends the student back to the login page. */
function logout() {
  clearSession();
  window.location.replace("index.html");
}

/* Builds one table row for a course the student is taking. */
function addCourseRow(courseTitle, teacherName, score) {
  const row = document.createElement("tr");

  const titleCell = document.createElement("td");
  titleCell.textContent = courseTitle;

  const teacherCell = document.createElement("td");
  teacherCell.textContent = teacherName;

  const scoreCell = document.createElement("td");
  scoreCell.textContent = score;
  scoreCell.classList.add("score");

  row.appendChild(titleCell);
  row.appendChild(teacherCell);
  row.appendChild(scoreCell);
  coursesBody.appendChild(row);
}

/* Loads the courses this student is taking and fills the table.
   The three lists come from three different tables, so each
   enrollment is matched to its course, and the course to its teacher. */
async function showCourses() {
  const session = getSession();

  try {
    const enrollments = await getEnrollments(session.studentNumber);
    const courses = await getCourses();
    const teachers = await getTeachers();

    if (enrollments.length === 0) {
      coursesMessage.textContent = "You are not enrolled in any course yet.";
      return;
    }

    enrollments.forEach(function (enrollment) {
      const course = courses.find(function (item) {
        return item.id === enrollment.courseId;
      });

      const teacher = teachers.find(function (item) {
        return item.id === course.teacherId;
      });

      addCourseRow(course.title, teacher.name, enrollment.score);
    });

    /* The table has rows now, so the loading line is not needed. */
    coursesMessage.classList.add("hidden");
  } catch (error) {
    coursesMessage.textContent = "Could not load your courses. Is json-server running?";
  }
}

/* ---------- Editing the profile ---------- */

/* Shows one message above the profile card, green or red. */
function showProfileAlert(message, type) {
  profileAlert.textContent = message;
  profileAlert.classList.remove("alert-error", "alert-success", "hidden");
  profileAlert.classList.add("alert-" + type);
}

/* Clears the messages left from the previous attempt. */
function clearProfileErrors() {
  const inputs = profileForm.querySelectorAll("input");
  inputs.forEach(function (input) {
    input.classList.remove("invalid");
  });

  const errorSpans = profileForm.querySelectorAll(".error-text");
  errorSpans.forEach(function (span) {
    span.textContent = "";
    span.classList.add("hidden");
  });

  profileAlert.classList.add("hidden");
}

/* Shows a red message under one field of the edit form. */
function showEditError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorSpan = document.getElementById(fieldId + "Error");

  input.classList.add("invalid");
  errorSpan.textContent = message;
  errorSpan.classList.remove("hidden");
}

/* Swaps the card between reading the details and editing them. */
function setEditing(isEditing) {
  profileDetails.classList.toggle("hidden", isEditing);
  profileForm.classList.toggle("hidden", !isEditing);
  editActions.classList.toggle("hidden", !isEditing);
  editProfileButton.classList.toggle("hidden", isEditing);
}

/* Fills the form with the current details and opens edit mode. */
function startEditing() {
  const session = getSession();

  document.getElementById("editName").value = session.name;
  document.getElementById("editEmail").value = session.email;

  clearProfileErrors();
  setEditing(true);
}

/* Leaves edit mode and throws away anything the user typed. */
function cancelEditing() {
  clearProfileErrors();
  setEditing(false);
}

/* Checks the two fields before we talk to the server. */
function validateProfile(name, email) {
  let isValid = true;

  if (isEmpty(name)) {
    showEditError("editName", "Full name is required");
    isValid = false;
  }

  if (isEmpty(email)) {
    showEditError("editEmail", "Email is required");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showEditError("editEmail", "Please enter a valid email");
    isValid = false;
  }

  return isValid;
}

/* Saves the new details to the server, then to the open session,
   so the page shows them straight away. */
async function saveProfile(event) {
  event.preventDefault();

  const session = getSession();
  const name = document.getElementById("editName").value.trim();
  const email = document.getElementById("editEmail").value.trim();

  clearProfileErrors();

  if (!validateProfile(name, email)) {
    return;
  }

  saveProfileButton.disabled = true;
  saveProfileButton.textContent = "Saving...";

  try {
    /* Only check the email when it actually changed, otherwise the
       student would clash with their own account. */
    if (email !== session.email) {
      const owner = await getStudentByEmail(email);

      if (owner) {
        showEditError("editEmail", "This email is already registered");
        saveProfileButton.disabled = false;
        saveProfileButton.textContent = "Save";
        return;
      }
    }

    await updateStudent(session.id, { fullName: name, email: email });
    updateSession({ name: name, email: email });

    showStudent();
    setEditing(false);
    showProfileAlert("Your profile has been updated.", "success");
  } catch (error) {
    showProfileAlert("Could not save your changes. Is json-server running?", "error");
  }

  saveProfileButton.disabled = false;
  saveProfileButton.textContent = "Save";
}

/* Only a logged in student gets the page filled in. */
if (isLoggedIn) {
  showStudent();
  showCourses();
}

logoutButton.addEventListener("click", logout);
editProfileButton.addEventListener("click", startEditing);
cancelEditButton.addEventListener("click", cancelEditing);
profileForm.addEventListener("submit", saveProfile);
