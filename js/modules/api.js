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

/* Same idea, but searches by the student ID like "S1001". */
export async function getStudentByStudentId(studentId) {
  const response = await fetch(`${BASE_URL}/students?studentId=${encodeURIComponent(studentId)}`);

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
