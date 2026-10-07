/* ===================================================================
   api.js
   Every call to json-server goes through this file.
   The server address is written here once, so changing the port
   later means changing one line instead of searching the project.
   =================================================================== */

const BASE_URL = "http://localhost:3000";

/* Looks for a student with this email.
   json-server returns an array, so we take the first item.
   Returns undefined when nobody uses that email yet. */
export async function getStudentByEmail(email) {
  const response = await fetch(`${BASE_URL}/students?email=${encodeURIComponent(email)}`);

  if (!response.ok) {
    throw new Error("Could not reach the server");
  }

  const students = await response.json();
  return students[0];
}

/* Same idea, but searches by the student number like "S1001".
   The field is called studentNumber and not studentId, because
   json-server treats any field ending in Id as a link to another
   table and deletes rows whose link points nowhere. */
export async function getStudentByNumber(studentNumber) {
  const response = await fetch(`${BASE_URL}/students?studentNumber=${encodeURIComponent(studentNumber)}`);

  if (!response.ok) {
    throw new Error("Could not reach the server");
  }

  const students = await response.json();
  return students[0];
}

/* Saves a new student and returns the saved record,
   which now also has the id that json-server created. */
export async function createStudent(student) {
  const response = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student)
  });

  if (!response.ok) {
    throw new Error("Could not save the new account");
  }

  return response.json();
}

/* The rows that say which courses this student is taking,
   and the score for each one. */
export async function getEnrollments(studentNumber) {
  const response = await fetch(`${BASE_URL}/enrollments?studentNumber=${encodeURIComponent(studentNumber)}`);

  if (!response.ok) {
    throw new Error("Could not load your courses");
  }

  return response.json();
}

/* All courses. The dashboard uses them to turn a courseId
   into a course title. */
export async function getCourses() {
  const response = await fetch(`${BASE_URL}/courses`);

  if (!response.ok) {
    throw new Error("Could not load the courses");
  }

  return response.json();
}

/* All teachers, used the same way to turn a teacherId into a name. */
export async function getTeachers() {
  const response = await fetch(`${BASE_URL}/teachers`);

  if (!response.ok) {
    throw new Error("Could not load the teachers");
  }

  return response.json();
}
