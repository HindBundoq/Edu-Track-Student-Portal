/* ===================================================================
   session.js
   Keeps track of who is logged in.

   The session is saved in one of two places:
   - localStorage   when the user ticked "Remember me", so it survives
                    closing the browser.
   - sessionStorage when they did not, so it disappears with the tab.
   =================================================================== */

const SESSION_KEY = "eduTrackSession";

/* Saves the logged in student.
   rememberMe decides which storage is used. */
export function saveSession(student, rememberMe) {
  const session = {
    id: student.id,
    name: student.fullName,
    email: student.email,
    studentNumber: student.studentNumber,
    loginTime: new Date().toISOString()
  };

  /* Storage only holds text, so the object becomes a JSON string. */
  const sessionText = JSON.stringify(session);

  if (rememberMe) {
    localStorage.setItem(SESSION_KEY, sessionText);
  } else {
    sessionStorage.setItem(SESSION_KEY, sessionText);
  }
}

/* Returns the logged in student, or null when nobody is logged in.
   sessionStorage is checked first because it belongs to this tab. */
export function getSession() {
  const sessionText =
    sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);

  if (!sessionText) {
    return null;
  }

  return JSON.parse(sessionText);
}

/* Removes the session from both storages, so logout always works
   no matter which one was used. */
export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

/* True when somebody is logged in. */
export function isLoggedIn() {
  return getSession() !== null;
}

/* Used by the dashboard. Sends visitors who are not logged in
   back to the login page. */
export function requireLogin() {
  if (!isLoggedIn()) {
    window.location.replace("index.html");
  }
}

/* Used by the login and register pages. Someone who is already
   logged in has no reason to see them, so send them to the dashboard. */
export function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.replace("dashboard.html");
  }
}
