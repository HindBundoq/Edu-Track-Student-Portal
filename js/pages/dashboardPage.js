/* ===================================================================
   dashboardPage.js
   Runs the dashboard: shows who is logged in and handles logout.
   =================================================================== */

import { requireLogin, getSession, clearSession } from "../modules/session.js";
import { getEnrollments, getCourses, getTeachers } from "../modules/api.js";

/* Runs before anything else. A visitor who is not logged in is sent
   back to the login page and never sees this content. */
requireLogin();

const logoutButton = document.getElementById("logoutButton");
const coursesBody = document.getElementById("coursesBody");
const coursesMessage = document.getElementById("coursesMessage");

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

showStudent();
showCourses();

logoutButton.addEventListener("click", logout);
