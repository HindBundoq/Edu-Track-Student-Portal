/* ===================================================================
   dashboardPage.js
   Runs the dashboard: shows who is logged in and handles logout.
   =================================================================== */

import { requireLogin, getSession, clearSession } from "../modules/session.js";

/* Runs before anything else. A visitor who is not logged in is sent
   back to the login page and never sees this content. */
requireLogin();

const logoutButton = document.getElementById("logoutButton");

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

showStudent();

logoutButton.addEventListener("click", logout);
